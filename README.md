# Swaadfolio

A personal recipe book by Aryan Singh Studio. The collection includes twelve Indian dishes from regional kitchens. Search by name, ingredient, Hinglish name or region, filter by course, bookmark a favourite, and check ingredients off while cooking. Curated ingredients show Hinglish names and selected ingredient photographs. You can also add, edit or delete your own recipes and attach a photo.


> **Quick discovery:** Indian recipe book web app with regional dishes, Hinglish ingredients, favorites and local-first editing.
>
> **Start here:** [Explore the Indian recipe catalogue](#indian-edition) · [Photo credits](dist/credits.html) · [Contribution guide](CONTRIBUTING.md) · [Report a bug](https://github.com/dapperdude404/swaadfolio/issues/new?template=bug_report.yml) · [Discovery & social preview](DISCOVERY_PACK.md).
>
> **Scope:** Curated launch collection has 12 Indian recipes. Personal recipes and bookmarks stay in browser storage and may be lost if site data is cleared.

## Run locally

From the project directory, run `python3 -m http.server 8000 --directory dist` (on Windows, `py -m http.server 8000 --directory dist`). Open [localhost:8000](http://localhost:8000). There is no dependency installation or build step.

The complete static app is in `dist/`. All photos and fonts ship with the app. Personal recipes, photos and bookmarks are stored in the current browser on the current origin. Clearing site data removes them. The curated recipes are always available with the app.

## Indian edition

| Region | Recipe |
| --- | --- |
| Karnataka | Rava Dosa |
| Maharashtra | Kanda Poha |
| Gujarat | Khaman Dhokla |
| Uttar Pradesh | Lucknowi Matar Pulao |
| West Bengal | Aloo Posto |
| Tamil Nadu | Tomato Rasam |
| Kerala | Paal Payasam |
| Punjab | Paneer Butter Masala |
| North India | Dal Tadka |
| Punjab | Chana Masala |
| North India | Aloo Gobi |
| North India | Besan Chilla |

These are regional home-style versions. Each entry in `dist/recipes.js` has a stable ID, country code, region, ingredients and steps. Future editions can add country collections without changing the existing IDs or saved bookmarks. The launch catalogue and personal-recipe form currently use India.

## Checks and credits

Run `node --test tests/catalogue.test.cjs` to verify the catalogue, photo files and credit links. Photographs and typeface licences are attributed in [Photo credits](dist/credits.html).

