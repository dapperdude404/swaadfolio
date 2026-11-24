# Language coverage

Swaadfolio has a public website and a language selector. The language preference is saved only in the current browser when storage is available. No translation service receives your recipes.

| Pack | Available content | Remaining English content |
| --- | --- | --- |
| English | Original recipes and interface | — |
| Hinglish (`hi-Latn`) | All 14 curated methods and kitchen notes; main navigation, filters and cooking controls | Ingredient quantities, descriptions, forms and some interface messages |
| Spanish (`es`) | Main navigation, filters and cooking controls | Recipe instructions, ingredients, descriptions, forms and some messages |
| French (`fr`) | Main navigation, filters and cooking controls | Recipe instructions, ingredients, descriptions, forms and some messages |

Ingredient aliases in Hinglish remain visible in every language. Personal recipes stay in the language their author entered. Unsupported recipe translations fall back to English; they are never automatically invented. A notice beside the selector explains each pack's coverage.

## Extending packs

- Add curated Hinglish methods and notes by stable recipe ID in `dist/locales/hinglish.js`. Keep steps in the original order, preserving quantities, cooking times, temperatures, cautions and technique.
- Add interface labels to `dist/locales/ui.js`; entries are ordered Hinglish, French, Spanish. Update the coverage notice if support changes.
- Keep serving scaling consistent with the original method. Besan Chilla alone currently supports smart portions.
- Run `node --test tests/*.test.cjs` and check switching languages in normal and Beginner cooking modes. Check returning to English, stored preference after reload, portion changes and ingredient checkboxes.
- Translation tests detect missing steps and changed numbers, but do not replace a human review of meaning.

These are starter packs, not full international translations. Additional countries' cuisines and an Android app are separate future work.
