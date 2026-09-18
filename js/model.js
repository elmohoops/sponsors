window.SponsorModel = (() => {
  const { toBoolean, toNumber, normalizeHeader } = window.SponsorUtils;

  function sponsorsFromRows(rows) {
    if (!rows.length) return [];

    const headers = rows[0].map(normalizeHeader);

    return rows.slice(1)
      .filter(row => row.some(cell => String(cell).trim() !== ""))
      .map(row => {
        const record = {};
        headers.forEach((header, index) => {
          record[header] = String(row[index] ?? "").trim();
        });

        return {
          season: record.season || "",
          order: toNumber(record.order, 999),
          active: toBoolean(record.active),
          level: record.level || "",
          name: record.name || "",
          logo: record.logo || "",
          website: record.website || ""
        };
      });
  }

  function configurationFromRows(rows) {
    const currentSeason = String(rows?.[1]?.[1] ?? "").trim();

    const levelHeaderIndex = rows.findIndex(row =>
      String(row?.[0] ?? "").trim().toLowerCase() === "level"
    );

    const levels = levelHeaderIndex >= 0
      ? rows.slice(levelHeaderIndex + 1)
          .filter(row => String(row?.[0] ?? "").trim() !== "")
          .map(row => ({
            name: String(row[0] ?? "").trim(),
            displayOrder: toNumber(row[1], 999),
            rotationSeconds: toNumber(row[2], 5)
          }))
          .sort((a, b) => a.displayOrder - b.displayOrder)
      : [];

    return { currentSeason, levels };
  }

  function buildSponsorView(sponsors, configuration) {
    const currentSponsors = sponsors
      .filter(sponsor =>
        sponsor.active &&
        sponsor.season === configuration.currentSeason
      )
      .sort((a, b) => a.order - b.order);

    const configuredLevels = configuration.levels.map(level => ({
      ...level,
      sponsors: currentSponsors.filter(sponsor => sponsor.level === level.name)
    }));

    const configuredNames = new Set(configuration.levels.map(level => level.name));
    const extraNames = [...new Set(
      currentSponsors
        .map(sponsor => sponsor.level)
        .filter(level => level && !configuredNames.has(level))
    )];

    extraNames.forEach(name => {
      configuredLevels.push({
        name,
        displayOrder: 999,
        rotationSeconds: 5,
        sponsors: currentSponsors.filter(sponsor => sponsor.level === name)
      });
    });

    return configuredLevels.filter(level => level.sponsors.length > 0);
  }

  return { sponsorsFromRows, configurationFromRows, buildSponsorView };
})();
