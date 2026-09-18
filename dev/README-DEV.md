# Sponsors DEV build — Carousel v0.2

## Carousel behavior
- Displays one sponsor at a time for each configured level.
- Each level starts on a random sponsor on every page load.
- Rotation then follows the Google Sheet `Order` values and wraps continuously.
- Each level rotates independently.
- Rotation timing comes from `Configuration > Rotation Seconds`.
- Levels with only one sponsor remain static.
- Uses a subtle fade/slide transition.
- Respects the browser's reduced-motion preference.

## Existing behavior retained
- Reads Sponsor and Configuration Google Sheet CSV feeds.
- Uses `CurrentSeason`.
- Filters to current-season rows where `Active = TRUE`.
- Uses configured level display order.
- Platinum remains larger than Gold and Silver.
- Tier background treatments are retained.
- DEV-only basketball-court background remains in `dev-assets/court_bg.jpg`.

## Install
Upload the **contents** of this folder into the repository's existing `/dev/` folder.
Keep your existing `/dev/assets/` sponsor logo files; this ZIP intentionally does not replace them.
