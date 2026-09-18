window.SponsorRenderer = (() => {
  const status = document.getElementById("status");
  const levelsContainer = document.getElementById("sponsor-levels");
  const seasonLabel = document.getElementById("season-label");

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("status-error", isError);
    status.hidden = false;
  }

  function clearStatus() {
    status.hidden = true;
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
      img.loading = "lazy";

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

  function createLevelSection(level) {
    const section = document.createElement("section");
    section.className = `sponsor-level ${levelClass(level.name)}`;

    const heading = document.createElement("h2");
    heading.className = "level-title";
    heading.textContent = `${level.name} Sponsors`;
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "sponsor-grid";

    level.sponsors.forEach(sponsor => {
      grid.appendChild(createSponsorCard(sponsor));
    });

    section.appendChild(grid);
    return section;
  }

  function render(configuration, levels) {
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
