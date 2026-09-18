window.SponsorUtils = (() => {
  function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          value += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        row.push(value);
        value = "";
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        if (char === "\r" && next === "\n") i += 1;
        row.push(value);
        if (row.some(cell => cell.trim() !== "")) rows.push(row);
        row = [];
        value = "";
      } else {
        value += char;
      }
    }

    row.push(value);
    if (row.some(cell => cell.trim() !== "")) rows.push(row);
    return rows;
  }

  function toBoolean(value) {
    return String(value).trim().toLowerCase() === "true";
  }

  function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizeHeader(value) {
    return String(value).trim().toLowerCase();
  }

  return { parseCsv, toBoolean, toNumber, normalizeHeader };
})();
