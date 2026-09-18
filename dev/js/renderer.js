window.SponsorRenderer = (() => {
  const status = document.getElementById("status");
  const levelsContainer = document.getElementById("sponsor-levels");
  const seasonLabel = document.getElementById("season-label");
  const timers = new Set();
  const ANIMATION_MS = 850;

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("status-error", isError);
    status.hidden = false;
  }

  function clearStatus() {
    status.hidden = true;
  }

  function clearTimers() {
    timers.forEach(timer => window.clearInterval(timer));
    timers.clear();
  }

  function levelClass(levelName) {
    return `level-${String(levelName).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  }

  function createSponsorCard(sponsor) {
    const card = document.createElement(sponsor.website ? "a" : "article");
    card.className = "sponsor-card";

    if (sponsor.website) {
      card.href = sponsor.website;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.setAttribute("aria-label", `${sponsor.name} website`);
    }

    if (sponsor.logo) {
      const img = document.createElement("img");
      img.className = "sponsor-logo";
      img.src = sponsor.logo;
      img.alt = sponsor.name;
      img.addEventListener("error", () => {
        img.hidden = true;
        card.classList.add("logo-missing");
      });
      card.appendChild(img);
    }

    const name = document.createElement("span");
    name.className = "sponsor-name";
    name.textContent = sponsor.name;
    card.appendChild(name);
    return card;
  }

  function createArrow(direction, levelName) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `carousel-arrow carousel-arrow-${direction}`;
    button.textContent = direction === "previous" ? "‹" : "›";
    button.setAttribute("aria-label", `${direction === "previous" ? "Previous" : "Next"} ${levelName} sponsor`);
    return button;
  }

  function randomStartIndex(length) {
    return length > 1 ? Math.floor(Math.random() * length) : 0;
  }

  function createLevelSection(level) {
    const section = document.createElement("section");
    section.className = `sponsor-level ${levelClass(level.name)}`;

    const heading = document.createElement("h2");
    heading.className = "level-title";
    heading.textContent = `${level.name} Sponsors`;
    section.appendChild(heading);

    const carousel = document.createElement("div");
    carousel.className = "sponsor-carousel";
    section.appendChild(carousel);

    const stage = document.createElement("div");
    stage.className = "sponsor-stage";
    stage.setAttribute("aria-live", "off");

    let currentIndex = randomStartIndex(level.sponsors.length);
    let timer = null;
    let animating = false;

    function showSponsor(index, direction = "next", animate = false) {
      if (animating) return false;
      const nextCard = createSponsorCard(level.sponsors[index]);

      if (!animate || !stage.firstElementChild || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        stage.replaceChildren(nextCard);
        currentIndex = index;
        return true;
      }

      animating = true;
      const oldCard = stage.firstElementChild;
      const forward = direction === "next";

      oldCard.classList.add("sponsor-card-moving", forward ? "exit-left" : "exit-right");
      nextCard.classList.add("sponsor-card-moving", forward ? "enter-right" : "enter-left");
      stage.appendChild(nextCard);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          oldCard.classList.add("slide-active");
          nextCard.classList.add("slide-active");
        });
      });

      window.setTimeout(() => {
        oldCard.remove();
        nextCard.classList.remove("sponsor-card-moving", "enter-right", "enter-left", "slide-active");
        currentIndex = index;
        animating = false;
      }, ANIMATION_MS + 40);

      return true;
    }

    function stopTimer() {
      if (timer !== null) {
        window.clearInterval(timer);
        timers.delete(timer);
        timer = null;
      }
    }

    function startTimer() {
      stopTimer();
      if (level.sponsors.length <= 1) return;
      const seconds = Math.max(1, Number(level.rotationSeconds) || 5);
      timer = window.setInterval(() => {
        if (animating) return;
        const nextIndex = (currentIndex + 1) % level.sponsors.length;
        showSponsor(nextIndex, "next", true);
      }, seconds * 1000);
      timers.add(timer);
    }

    function advance(direction) {
      if (animating) return;
      const count = level.sponsors.length;
      const nextIndex = direction === "next"
        ? (currentIndex + 1) % count
        : (currentIndex - 1 + count) % count;

      if (showSponsor(nextIndex, direction, true)) {
        startTimer();
      }
    }

    showSponsor(currentIndex);

    if (level.sponsors.length > 1) {
      const previous = createArrow("previous", level.name);
      const next = createArrow("next", level.name);
      previous.addEventListener("click", () => advance("previous"));
      next.addEventListener("click", () => advance("next"));
      carousel.append(previous, stage, next);
      startTimer();
    } else {
      carousel.classList.add("single-sponsor");
      carousel.appendChild(stage);
    }

    return section;
  }

  function render(configuration, levels) {
    clearTimers();
    seasonLabel.textContent = `Season ${configuration.currentSeason}`;
    levelsContainer.replaceChildren();

    if (!levels.length) {
      setStatus(`No active sponsors found for ${configuration.currentSeason}.`);
      levelsContainer.hidden = true;
      return;
    }

    levels.forEach(level => levelsContainer.appendChild(createLevelSection(level)));
    clearStatus();
    levelsContainer.hidden = false;
  }

  return { setStatus, render };
})();
