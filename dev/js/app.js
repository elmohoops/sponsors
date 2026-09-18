(async () => {
  const { feeds } = window.SPONSOR_CONFIG;
  const { parseCsv } = window.SponsorUtils;
  const { sponsorsFromRows, configurationFromRows, buildSponsorView } = window.SponsorModel;
  const { setStatus, render } = window.SponsorRenderer;

  async function fetchText(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
    return response.text();
  }

  try {
    setStatus("Loading sponsors…");

    const [sponsorCsv, configurationCsv] = await Promise.all([
      fetchText(feeds.sponsors),
      fetchText(feeds.configuration)
    ]);

    const sponsors = sponsorsFromRows(parseCsv(sponsorCsv));
    const configuration = configurationFromRows(parseCsv(configurationCsv));

    if (!configuration.currentSeason) {
      throw new Error("CurrentSeason is missing from Configuration.");
    }

    const levels = buildSponsorView(sponsors, configuration);
    render(configuration, levels);
  } catch (error) {
    console.error("Sponsor app failed to load:", error);
    setStatus("Unable to load sponsor information. Please try again later.", true);
  }
})();
