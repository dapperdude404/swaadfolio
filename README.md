# Swaadfolio

A personal recipe book by Aryan Singh Studio. The first edition includes eight Indian dishes from eight states. Search by name, ingredient or region, filter by course, bookmark a favourite, and check ingredients off while cooking. You can also add, edit or delete your own recipes and attach a photo.

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

These are regional home-style versions. Each entry in `dist/recipes.js` has a stable ID, country code, region, ingredients and steps. Future editions can add country collections without changing the existing IDs or saved bookmarks. The launch catalogue and personal-recipe form currently use India.

## Checks and credits

Run `node --test tests/catalogue.test.cjs` to verify the launch catalogue, photo files and credit links. Photographs and typeface licences are attributed in [Photo credits](dist/credits.html).

