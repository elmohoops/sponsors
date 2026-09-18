# Sponsors DEV build — Carousel v0.3

## Carousel behavior
- Keeps Platinum, Gold, and Silver stacked vertically.
- Keeps sponsor cards compact and centered inside each tier.
- Platinum remains the largest card; Gold is medium; Silver is smallest on desktop.
- The entire sponsor card slides horizontally during transitions (850 ms).
- Each tier starts on a random sponsor on every page load.
- Automatic rotation follows the Google Sheet `Order` values and wraps continuously.
- Rotation timing comes from `Configuration > Rotation Seconds` (currently 5 seconds).
- Previous/Next arrow controls let visitors browse sponsors without waiting.
- Manual navigation restarts that tier's rotation timer.
- Previous wraps from the first sponsor to the last; Next wraps from the last to the first.
- Levels with only one sponsor show no arrows and run no timer.
- Each tier rotates independently.
- Respects the browser's reduced-motion preference.

## Existing behavior retained
- Reads Sponsor and Configuration Google Sheet CSV feeds.
- Uses `CurrentSeason` and keeps historical sponsor rows available.
- Filters to current-season rows where `Active = TRUE`.
- Uses configured level display order.
- Tier background treatments are retained.
- DEV-only basketball-court background remains in `dev-assets/court_bg.jpg`.

## Install
Upload the **contents** of this folder into the repository's existing `/dev/` folder.
Keep your existing `/dev/assets/` sponsor logo files; this ZIP intentionally does not replace them.
