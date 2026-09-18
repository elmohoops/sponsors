window.SponsorRenderer = (() => {
  const status = document.getElementById("status");
  const levelsContainer = document.getElementById("sponsor-levels");
  const seasonLabel = document.getElementById("season-label");
  const timers = [];

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
    timers.length = 0;
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

    const stage = document.createElement("div");
    stage.className = "sponsor-stage";
    stage.setAttribute("aria-live", "off");
    section.appendChild(stage);

    let currentIndex = randomStartIndex(level.sponsors.length);

    function showSponsor(index, animate = false) {
      const nextCard = createSponsorCard(level.sponsors[index]);

      if (!animate || !stage.firstElementChild) {
        stage.replaceChildren(nextCard);
        return;
      }

      const oldCard = stage.firstElementChild;
      oldCard.classList.add("sponsor-card-exit");
      nextCard.classList.add("sponsor-card-enter");
      stage.appendChild(nextCard);

      requestAnimationFrame(() => {
        nextCard.classList.add("sponsor-card-enter-active");
      });

      window.setTimeout(() => {
        oldCard.remove();
        nextCard.classList.remove("sponsor-card-enter", "sponsor-card-enter-active");
      }, 450);
    }

    showSponsor(currentIndex);

    if (level.sponsors.length > 1) {
      const seconds = Math.max(1, Number(level.rotationSeconds) || 5);
      const timer = window.setInterval(() => {
        currentIndex = (currentIndex + 1) % level.sponsors.length;
        showSponsor(currentIndex, true);
      }, seconds * 1000);
      timers.push(timer);
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

    levels.forEach(level => {
      levelsContainer.appendChild(createLevelSection(level));
    });

    clearStatus();
    levelsContainer.hidden = false;
  }

  return { setStatus, render };
})();
