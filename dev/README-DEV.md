# Sponsors DEV build

Initial Sponsor app milestone.

## Included
- Reads the published Sponsor and Configuration Google Sheet CSV feeds.
- Reads `CurrentSeason` from Configuration.
- Filters Sponsor rows to the current season and `Active = TRUE`.
- Uses Configuration to order Platinum, Gold, and Silver levels.
- Displays static sponsor cards (no carousel yet).
- Platinum has a larger visual treatment.
- Level backgrounds are intentionally different for visual testing.
- Uses the Wix basketball-court image from `dev-assets/court_bg.jpg`.
- The court image is DEV-only by design.

## Logo files
The Google Sheet currently contains paths such as:

`assets/SP_Longevity.png`

Copy the existing sponsor logo files into this package's `assets/` folder using the exact filenames in the Sheet.

Until those files are added, the app will still show each sponsor's name.

## Install
Upload the **contents** of this folder into the repository's existing `/dev/` folder.
