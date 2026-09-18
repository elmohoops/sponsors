# El Modena Sponsors

Responsive sponsor carousel application for the El Modena Vanguards Boys
Basketball website.

The application is hosted with GitHub Pages and embedded into the main
ELMO Hoops Wix website. Sponsor information, the current season, sponsor
visibility, sponsorship levels, and carousel rotation times are
maintained in Google Sheets.

## Live Sites

Main website:

https://www.elmohoops.org/

Sponsors application:

https://elmohoops.github.io/sponsors/

The GitHub Pages application is intended primarily to be displayed
inside the Wix website rather than used as a standalone website.

## Architecture

The ELMO Hoops website uses three primary services.

### Wix

Wix hosts the main public website:

https://www.elmohoops.org/

Wix controls the site navigation, page layout, registration links,
normal website content, and the basketball-court background used behind
the Sponsors application.

Dynamic portions of the website are embedded as GitHub Pages
applications using Wix HTML/iframe elements.

The production Sponsors application has a transparent background so the
Wix basketball-court background remains visible.

### GitHub

GitHub hosts the custom web applications used by the website.

Organization:

https://github.com/elmohoops

Repositories include:

-   `schedule` - Game and event schedule
-   `rosters` - Team rosters and coaching staffs
-   `board` - Booster Board directory
-   `sponsors` - Sponsor carousel

Each application is hosted using GitHub Pages.

### Google

Google provides the data used by the GitHub applications.

The Sponsors application reads from Google Sheets.

This separation allows routine sponsor and season updates to be made in
Google Sheets without modifying application code.

## Sponsor Data

Sponsor information is maintained in one Google Sheet.

The spreadsheet contains two important tabs:

-   `Sponsors - Sponsor`
-   `Sponsors - Configuration`

### Sponsor Tab

The Sponsor tab contains sponsor information.

Columns:

``` text
Season | Order | Active | Level | Name | Logo | Website
```

#### Season

Identifies the basketball season for the sponsor entry.

Example:

`2025-2026`

Historical seasons can remain in the spreadsheet. The website displays
only entries matching the season specified by `CurrentSeason` in the
Configuration tab.

#### Order

Controls the order of sponsors within a sponsorship level.

Use numeric values.

Changing an Order value changes the carousel order without requiring a
code change.

#### Active

Controls whether the sponsor is displayed.

Use:

``` text
TRUE
FALSE
```

Only sponsors with `Active = TRUE` are displayed.

If a sponsorship level has no active sponsors for the current season,
the entire level is omitted.

#### Level

Identifies the sponsor's sponsorship level.

Current levels are:

-   Platinum
-   Gold
-   Silver

Level display order and carousel rotation time are controlled by the
Configuration tab.

#### Name

Sponsor's displayed name.

Display of sponsor names is controlled globally by `ShowSponsorName` in
the Configuration tab.

#### Logo

Relative path to the sponsor's logo file.

Example:

`assets/SP_Longevity.png`

Sponsor logo files are stored in the repository's `assets` directory.

Responsive CSS contains logos with different dimensions and aspect
ratios inside the sponsor cards, so source logo files normally do not
need to be resized solely for website display.

#### Website

Optional sponsor website URL.

When a website is present, the sponsor card links to the sponsor's
website.

### Configuration Tab

The Configuration tab stores application-level settings and
sponsorship-level configuration.

Important settings include:

``` text
CurrentSeason | 2025-2026
ShowSponsorName | TRUE
```

#### CurrentSeason

Determines which season's sponsor records are displayed.

#### ShowSponsorName

Controls whether sponsor names are displayed beneath the sponsor logos.

Use:

``` text
TRUE
FALSE
```

#### Sponsorship Level Configuration

Each sponsorship level has its own display order and automatic rotation
time.

Example structure:

``` text
Level | Display Order | Rotation Seconds
Platinum | 1 | 5
Gold | 2 | 5
Silver | 3 | 5
```

The actual values in the Google Sheet are the source of truth.

Each level rotates independently using its configured rotation time.

## Starting a New Season

The spreadsheet is designed to retain historical sponsor information.

To prepare for a new basketball season:

1.  Add the new season's sponsors to the Sponsor tab.
2.  Enter the appropriate Level, Name, Logo, Website, Order, and Active
    values.
3.  Verify that all new rows use the same Season value.
4.  Update `CurrentSeason` in the Configuration tab.
5.  Verify the Sponsors section on the website in both desktop and
    mobile layouts.

There is normally no need to delete the previous season's sponsor
information.

There is normally no need to modify GitHub code when starting a new
season.

Google's published Sheet data can take a short time to propagate. After
changing configuration values such as `CurrentSeason`, `Active`, or
`ShowSponsorName`, allow time for all browsers to receive the updated
published data before troubleshooting the application.

## Google Sheets Integration

The application reads anonymously accessible published Google Sheets CSV
data.

Google Sheet publication information and sheet identifiers are
configured in:

`js/config.js`

The application retrieves both the Sponsor and Configuration data.

The spreadsheet must remain published and accessible so the application
can retrieve its data.

The application uses cache-busting requests to reduce stale data. Google
may still temporarily serve an older published snapshot, and some
browsers may take longer than others to reflect a recent Sheet change.

If sponsor information stops loading, check:

1.  The Google Sheet still exists.
2.  The Sponsor and Configuration tabs still exist.
3.  The sheet is still published/accessible as required.
4.  Column headings have not been changed.
5.  `CurrentSeason` matches the Season values in the Sponsor rows.
6.  Active sponsors use `TRUE` in the Active column.

## Repository Structure

Production:

``` text
sponsors/
├── assets/
│   └── sponsor logo files
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── config.js
│   └── sheets.js
├── dev/
├── index.html
└── README.md
```

The `/dev/` folder is used for development and testing before changes
are promoted to production.

DEV may contain a local basketball-court background so the application
can be previewed outside Wix.

The production root must remain transparent. Do not copy the DEV-only
court background into the production root.

## Application Flow

`index.html` loads the Sponsors application.

The JavaScript modules separate responsibilities:

-   `config.js` - Published Google Sheet and sheet configuration
-   `sheets.js` - Retrieves and parses Google Sheets data
-   `app.js` - Application startup, filtering, carousel behavior, and
    rendering

The application:

1.  Retrieves the Configuration and Sponsor data.
2.  Determines the current season from `CurrentSeason`.
3.  Filters sponsors by season and `Active = TRUE`.
4.  Groups sponsors by sponsorship level.
5.  Sorts sponsors using the numeric `Order` field.
6.  Omits sponsorship levels containing no active sponsors.
7.  Randomly selects the initial sponsor for levels containing multiple
    sponsors.
8.  Rotates each level independently using its configured rotation time.
9.  Allows manual previous/next navigation.
10. Resets a level's automatic rotation timer after manual navigation.
11. Displays sponsor names according to `ShowSponsorName`.

## Sponsor Carousel Design

The application uses a responsive carousel layout designed to match the
visual style of the ELMO Hoops website.

The design includes:

-   Platinum, Gold, and Silver sponsorship hierarchy
-   Largest cards for Platinum sponsors
-   Medium cards for Gold sponsors
-   Smaller cards for Silver sponsors
-   Kelly Slab sponsorship headings
-   Gold divider lines between sponsorship levels
-   Tier-specific sponsor card backgrounds
-   Responsive sponsor logo sizing
-   Previous and next carousel arrows
-   Carousel position dots
-   Smooth whole-card slide transitions
-   Transparent production background so the Wix basketball-court
    background remains visible

When a level contains only one sponsor, unnecessary carousel controls
are hidden.

Desktop and mobile layouts are both supported.

## Wix Integration

The Sponsors application is embedded in the ELMO Hoops Wix website.

GitHub Pages URL:

https://elmohoops.github.io/sponsors/

Wix owns the surrounding page and the basketball-court background.

The GitHub production application must therefore remain transparent.

The Wix iframe should be tall enough to display all active sponsorship
levels without an internal scrollbar.

Because sponsorship levels and sponsor-name visibility can affect the
rendered height, verify the Wix iframe on both desktop and mobile after
significant content or layout changes.

## Sponsors Features

The application currently supports:

-   Multiple seasons in one Google Sheet
-   Current-season filtering
-   Active/inactive sponsor control
-   Platinum, Gold, and Silver sponsorship levels
-   Configurable sponsorship-level display order
-   Independent rotation times by sponsorship level
-   Random initial sponsor selection
-   Automatic sponsor rotation
-   Manual previous/next navigation
-   Rotation timer reset after manual navigation
-   Carousel position dots
-   Optional sponsor-name display
-   Clickable sponsor websites
-   Automatic omission of empty sponsorship levels
-   Responsive sponsor logo sizing
-   Responsive desktop and mobile layouts
-   Transparent production background for Wix integration
-   GitHub Pages hosting
-   Wix iframe embedding

## Making Routine Sponsor Changes

Most sponsor changes DO NOT require changes to GitHub.

Use the Google Sheet to:

-   Add sponsors
-   Activate or deactivate sponsors
-   Change sponsor names
-   Change sponsor websites
-   Reorder sponsors
-   Assign sponsorship levels
-   Prepare the next season
-   Change the current season
-   Show or hide sponsor names
-   Adjust carousel rotation times

GitHub should normally only be changed when modifying application
appearance, behavior, configuration, logo assets, or functionality.

A new or changed sponsor logo does require adding or replacing the
corresponding image file in the repository's `assets` directory.

## Development and Production

Development work should normally be performed in:

`/dev/`

Test changes there before promoting them to the repository root.

The DEV version may use a local court background to approximate the Wix
page during standalone testing.

Production is intentionally different:

-   The production background is transparent.
-   Wix supplies the basketball-court background.
-   DEV-only background assets should not be promoted to the production
    root.

When promoting a tested DEV build, preserve this production-only
transparency.

## Deploying Code Changes

Recommended workflow:

1.  Make the required change in `/dev/`.
2.  Test the DEV application directly through GitHub Pages.
3.  Verify Sponsor and Configuration data load correctly.
4.  Verify automatic carousel rotation.
5.  Verify manual carousel navigation.
6.  Verify desktop behavior.
7.  Verify mobile behavior.
8.  Promote the tested files to the production root while preserving the
    transparent production background.
9.  Commit the tested production changes to `main`.
10. Allow GitHub Pages to redeploy.
11. Verify the production GitHub Pages application.
12. Verify the Sponsors section on ELMOHoops.org.

For significant stable releases, create a Git tag/release.

## Troubleshooting

### Sponsor information does not load

Check that:

-   The Google Sheet is published and accessible.
-   The published Sheet configuration in `js/config.js` is correct.
-   The Sponsor and Configuration sheet identifiers are correct.
-   Expected column headings have not changed.

### Recent Google Sheet changes do not appear immediately

The published Google Sheet can temporarily return cached data.

The application includes cache-busting requests, but Google publication
updates can still take time to propagate and browser behavior can vary.

Wait a short period and refresh again before treating this as an
application defect.

### No sponsors appear

Check that:

-   `CurrentSeason` is set correctly.
-   Sponsor rows exist for that Season.
-   Season values match `CurrentSeason` exactly.
-   The Active field is `TRUE`.
-   The Sponsor tab's column headings have not changed.

### One sponsorship level does not appear

Check whether that level has at least one active sponsor for the current
season.

Levels with no active sponsors are intentionally omitted.

### Sponsor names do not appear

Check `ShowSponsorName` in the Configuration tab.

`TRUE` displays sponsor names.

`FALSE` hides sponsor names.

Allow time for published Google Sheet changes to propagate.

### Sponsors appear in the wrong order

Check the numeric `Order` values in the Google Sheet.

Also verify the level `Display Order` values in the Configuration tab.

### Carousel rotates too quickly or too slowly

Check `Rotation Seconds` for that sponsorship level in the Configuration
tab.

Each level has an independent rotation time.

### Sponsor logo is missing

Check that:

-   The Logo value in the Google Sheet matches the correct relative file
    path.
-   The image exists in the production `assets` directory.
-   Filename capitalization matches exactly.

### Sponsor logo is too large or clipped

Logo sizing should normally be corrected in the application's responsive
CSS rather than by resizing the original sponsor artwork.

Check the applicable logo containment rules in `css/styles.css`.

### Wix basketball-court background does not appear

Verify that the production application's page background is transparent.

Also verify that Wix is supplying the expected page background behind
the iframe.

Do not add the DEV court background to production.

### Application formatting is missing

Verify that GitHub Pages is publishing from the expected branch/root and
that the CSS and JavaScript files still exist at the expected relative
paths.

## Ownership and Future Website Managers

The application is owned by the `elmohoops` GitHub Organization rather
than an individual volunteer's GitHub account.

Future website managers should use their own GitHub accounts and be
granted appropriate access to the `elmohoops` organization.

Do not share a common GitHub username/password between website managers.

The outgoing Website Manager should ensure that the incoming Website
Manager has access to:

-   ELMO Hoops Wix website
-   ELMO Hoops GitHub organization
-   ELMO Hoops Google account and Sponsors spreadsheet
-   Any other program accounts required to maintain the website

## Related Applications

### Schedule

Repository:

https://github.com/elmohoops/schedule

GitHub Pages:

https://elmohoops.github.io/schedule/

Schedule information is maintained in Google Calendar.

### Rosters

Repository:

https://github.com/elmohoops/rosters

GitHub Pages:

https://elmohoops.github.io/rosters/

Roster and coaching information is maintained in Google Sheets.

### Booster Board

Repository:

https://github.com/elmohoops/board

GitHub Pages:

https://elmohoops.github.io/board/

Booster Board information is maintained in Google Sheets.

## Maintenance Philosophy

The system is intentionally designed so that normal basketball-season
maintenance does not require programming knowledge.

Routine content belongs in:

-   Google Calendar for schedules
-   Google Sheets for sponsors, rosters, coaches, and Booster Board
    information
-   Wix for normal website content

GitHub contains the code that presents the dynamic Google data on the
Wix website.

When possible, keep this separation intact.
