import { CONFIG } from "./config.js";
import { load, objects, configuration } from "./sheets.js";

const levelsEl = document.querySelector("#levels");
const status = document.querySelector("#status");
const seasonEl = document.querySelector("#season");
const timers = new Set();
const ANIMATION_MS = 900;

const yes = value => /^(true|yes|1|on)$/i.test(String(value ?? "").trim());
const logo = path => String(path || "").trim().replace(/^\.?\//, "./");

function card(level, sponsor, showName, entry = "") {
  const el = document.createElement(sponsor.Website ? "a" : "div");
  el.className = `card ${level.toLowerCase()} ${entry}`.trim();

  if (sponsor.Website) {
    el.href = sponsor.Website;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  }

  const img = document.createElement("img");
  img.src = logo(sponsor.Logo);
  img.alt = sponsor.Name || "Sponsor";
  el.append(img);

  if (showName) {
    const name = document.createElement("strong");
    name.textContent = sponsor.Name;
    el.append(name);
  }

  return el;
}

function levelView(cfg, list, showName) {
  const section = document.createElement("section");
  section.className = `level ${cfg.level.toLowerCase()}`;

  const heading = document.createElement("h2");
  heading.textContent = `${cfg.level} Sponsors`;
  section.append(heading);

  const carousel = document.createElement("div");
  carousel.className = "carousel";

  const previous = document.createElement("button");
  const next = document.createElement("button");
  const view = document.createElement("div");
  const dots = document.createElement("div");

  previous.textContent = "‹";
  next.textContent = "›";
  previous.ariaLabel = `Previous ${cfg.level} sponsor`;
  next.ariaLabel = `Next ${cfg.level} sponsor`;
  previous.className = next.className = "arrow";
  view.className = "viewport";
  dots.className = "dots";

  let index = list.length > 1 ? Math.floor(Math.random() * list.length) : 0;
  let busy = false;
  let timer = null;
  const rotationMs = Math.max(1, Number(cfg.rotationSeconds) || CONFIG.defaultRotationSeconds) * 1000;

  function renderDots() {
    dots.replaceChildren(...list.map((_, dotIndex) => {
      const dot = document.createElement("i");
      if (dotIndex === index) dot.className = "active";
      return dot;
    }));
  }

  function initial() {
    view.replaceChildren(card(cfg.level, list[index], showName));
    renderDots();
  }

  function clearTimer() {
    if (timer !== null) {
      window.clearTimeout(timer);
      timers.delete(timer);
      timer = null;
    }
  }

  function scheduleNext() {
    clearTimer();
    if (list.length < 2) return;

    timer = window.setTimeout(() => {
      timers.delete(timer);
      timer = null;
      move(1, false);
    }, rotationMs);
    timers.add(timer);
  }

  function finishMove(oldCard, newCard, newIndex) {
    oldCard.remove();
    newCard.classList.remove("from-right", "from-left", "arrive");
    index = newIndex;
    renderDots();
    busy = false;
    scheduleNext();
  }

  function move(direction, manual = false) {
    if (busy || list.length < 2) return;

    // A manual arrow click immediately cancels the existing countdown.
    // The full tier-specific countdown begins again after the slide completes.
    if (manual) clearTimer();

    busy = true;
    const oldCard = view.querySelector(".card");
    const newIndex = (index + direction + list.length) % list.length;
    const newCard = card(cfg.level, list[newIndex], showName, direction > 0 ? "from-right" : "from-left");
    view.append(newCard);

    // Force the browser to commit the new card's off-screen starting position
    // before applying the transition classes. This prevents a hard swap.
    void newCard.offsetWidth;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        oldCard.classList.add(direction > 0 ? "to-left" : "to-right");
        newCard.classList.add("arrive");
      });
    });

    window.setTimeout(() => finishMove(oldCard, newCard, newIndex), ANIMATION_MS + 50);
  }

  previous.onclick = () => move(-1, true);
  next.onclick = () => move(1, true);

  if (list.length > 1) {
    carousel.append(previous, view, next);
  } else {
    carousel.classList.add("single");
    carousel.append(view);
  }
  section.append(carousel);

  if (list.length > 1) {
    section.append(dots);
  }

  initial();
  scheduleNext();
  return section;
}

try {
  const [sponsorRows, configurationRows] = await Promise.all([
    load(CONFIG.sheets.Sponsor),
    load(CONFIG.sheets.Configuration)
  ]);

  const sponsors = objects(sponsorRows);
  const { settings, levels } = configuration(configurationRows);
  const currentSeason = settings.CurrentSeason;
  const showName = yes(settings.ShowSponsorName);

  seasonEl.textContent = currentSeason ? `Season ${currentSeason}` : "";

  const activeSponsors = sponsors.filter(
    sponsor => sponsor.Season === currentSeason && yes(sponsor.Active)
  );

  for (const cfg of levels) {
    const list = activeSponsors
      .filter(sponsor => sponsor.Level === cfg.level)
      .sort((a, b) => (+a.Order || 999) - (+b.Order || 999));

    if (list.length) levelsEl.append(levelView(cfg, list, showName));
  }

  if (levelsEl.children.length) {
    status.hidden = true;
    levelsEl.hidden = false;
  } else {
    status.textContent = "No active sponsors found for the current season.";
  }
} catch (error) {
  console.error(error);
  status.textContent = "Unable to load sponsor information.";
}
