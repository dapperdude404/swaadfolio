<div align="center">

<img src="dist/assets/mark.svg" alt="Swaadfolio logo" width="76">

# Swaadfolio
### A little more joy, a little more aaram in the kitchen. 🍲

**An Indian recipe book for curious cooks, first-timers and family favourites.**

[Explore the recipe book](https://swaadfolio.leafyhutch64.chatgpt.site) · [See the dishes](#on-the-menu) · [Run it locally](#get-started) · [Contribute](CONTRIBUTING.md)

<sub>Created by Aryan Singh Studio · The hosted preview is private and requires the owner's ChatGPT sign-in.</sub>

</div>

---

<img src="dist/assets/paneer-butter-masala.webp" alt="Paneer butter masala served with roti" width="100%">

## Your kitchen, your pace

Whether it's your first chilla or a family favourite, Swaadfolio keeps the ingredients and steps easy to follow. The Indian collection currently has **14 home-style recipes** from different regions.

| 🥄 Find your next dish | 🌿 Recognise ingredients | 👩‍🍳 Cook with confidence |
| --- | --- | --- |
| Search dishes, ingredients, Hinglish names or regions. Filter by course. | See English and Hinglish names such as **onion / pyaaz**. Selected ingredients also have photos. | Use **Beginner cooking mode** to move through a recipe one step at a time. Check off ingredients as you go. |

### Make it yours

- 🔖 **Save favourites** to come back to later.
- 📖 **Build your own cookbook** by adding, editing or deleting personal Indian recipes and attaching a photo.
- 🍽️ **Try smart portions for Besan Chilla:** choose 1–6 servings to adjust its ingredient amounts and the water quantity in its method. Amounts are estimates; cooking times and pan size may change.
- 📱 **Cook on your phone or computer** with a responsive web layout.

> **Your recipes stay on this device.** Personal recipes, photos and bookmarks are stored in the current browser and origin. Clearing browser site data can remove them; they do not currently sync between devices.

## On the menu

| Region | A taste of Swaadfolio |
| --- | --- |
| Karnataka | Rava Dosa |
| Maharashtra | Kanda Poha |
| Gujarat | Khaman Dhokla |
| Uttar Pradesh | Lucknowi Matar Pulao |
| West Bengal | Aloo Posto |
| Tamil Nadu | Tomato Rasam |
| Kerala | Paal Payasam |
| Punjab | Paneer Butter Masala · Chana Masala |
| North India | Dal Tadka · Aloo Gobi · Besan Chilla · Jeera Aloo |
| Indian home-style | Tomato Chutney |

These recipes are home-style versions. Ingredient photo coverage and portion scaling are still being expanded. Recipes and photographs are not a claim of professional kitchen testing.

## Get started

The hosted link above is owner-private. To explore your own copy, run this static app locally:

```bash
git clone https://github.com/dapperdude404/swaadfolio.git
cd swaadfolio
python3 -m http.server 8000 --directory dist
```

On Windows, use `py -m http.server 8000 --directory dist`. Open [localhost:8000](http://localhost:8000). No package installation or build step is required.

## Made for sharing ideas

Swaadfolio begins with Indian regional cooking. Future ideas include more recipes, wider smart-portion coverage and an Android app; these are plans, not released features.

Want to help? Read the [contribution guide](CONTRIBUTING.md), [report a bug](https://github.com/dapperdude404/swaadfolio/issues/new?template=bug_report.yml), or browse the [discovery notes](DISCOVERY_PACK.md).

## Project checks & credits

Run the catalogue checks with:

```bash
node --test tests/catalogue.test.cjs
```

Food and ingredient photographs and typeface licences are credited in [Photo credits](dist/credits.html). Built with HTML, CSS and JavaScript.

<div align="center">

**Made with care by Aryan Singh Studio**  
*Har recipe, ek nayi kahani.*

</div>
