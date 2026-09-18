# Sponsors DEV build — Carousel timer/slide fix

## Changes in this build
- Restores a true whole-card horizontal slide instead of a hard sponsor swap.
- Slows the card transition to 900 ms.
- Manual Previous/Next navigation immediately cancels that tier's existing countdown.
- After the manual slide finishes, that tier receives its full configured `Rotation Seconds` before rotating again.
- Platinum, Gold, and Silver timers remain fully independent.
- Automatic rotation also waits the full configured interval after each completed slide.
- Adds explicit image centering so the Silver logo and other sponsor logos remain centered in their cards.
- Uses the existing DEV court image at `dev-assets/court_bg.jpg`; no new/generated court image is included.
- Keeps `ShowSponsorName` controlled by the Configuration sheet.
- Keeps random first sponsor selection on each page load.

## Install
Replace the repository's existing `/dev/` folder contents with the contents of this `/dev/` folder, then allow GitHub Pages to redeploy.


## 9/18 visual refinement
- Sponsor level headings use Kelly Slab at 48px on desktop.
- Added gold divider line beneath each level heading.
- Increased vertical spacing between sponsor levels.
- Existing carousel behavior and sponsor data logic are unchanged.
