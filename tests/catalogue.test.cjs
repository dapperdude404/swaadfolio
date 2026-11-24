const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const site = path.join(__dirname, "..", "dist");
const data = fs.readFileSync(path.join(site, "recipes.js"), "utf8");
const recipes = vm.runInNewContext(data + "\nSwaadfolioRecipes");
const credits = fs.readFileSync(path.join(site, "credits.html"), "utf8");

test("the Indian collection has fourteen unique recipes", () => {
  assert.equal(recipes.length, 14);
  assert.equal(new Set(recipes.map(r => r.id)).size, recipes.length);
  assert.ok(recipes.every(r => r.country === "IN"));
});

test("every recipe has measured ingredients, method, timing and servings", () => {
  for (const r of recipes) {
    assert.ok(r.name && r.region && r.course && r.description, r.id);
    assert.ok(r.minutes > 0 && r.servings > 0, r.id);
    assert.ok(r.ingredients.length >= 3 && r.steps.length >= 3, r.id);
    assert.ok(r.ingredients.every(s => s.trim()) && r.steps.every(s => s.trim()), r.id);
  }
});

test("the kitchen pick opens a real recipe and all recipe photos ship with credits", () => {
  const home = fs.readFileSync(path.join(site, "index.html"), "utf8");
  const hero = home.match(/href="#recipe\/([^"]+)"/);
  assert.ok(hero && recipes.some(r => r.id === hero[1]));
  for (const r of recipes) {
    const bytes = fs.readFileSync(path.join(site, "assets", r.id + ".webp"));
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  }
  assert.ok((credits.match(/commons\.wikimedia\.org\/wiki\/File:/g) || []).length >= recipes.length);
});

test("ingredient guides match the recipe lists and have valid photos", () => {
  const guideSource = fs.readFileSync(path.join(site, "ingredient-guide.js"), "utf8");
  const guide = vm.runInNewContext(guideSource + "\nSwaadfolioIngredientGuide");
  for (const recipe of recipes) {
    assert.equal(guide[recipe.id].length, recipe.ingredients.length, recipe.id);
    for (const item of guide[recipe.id]) {
      const [name, photo] = item.split("|");
      assert.ok(name.trim(), recipe.id);
      if (photo) assert.ok(fs.statSync(path.join(site, "assets", "ingredients", photo + ".jpg")).isFile(), photo);
    }
  }
  assert.deepEqual(
    Array.from(guide["besan-chilla"], item => item.split("|")[0]),
    ["Besan", "Paani", "Pyaaz", "Tamatar", "Hari mirch", "Hara dhaniya", "Jeera", "Haldi", "Namak", "Tel"]
  );
  assert.ok(guide["besan-chilla"].every(item => item.includes("|")), "Every besan chilla ingredient has a photo");
});

test("new beginner recipes have photos for every ingredient", () => {
  const guide = vm.runInNewContext(fs.readFileSync(path.join(site, "ingredient-guide.js"), "utf8") + "\nSwaadfolioIngredientGuide");
  for (const id of ["jeera-aloo", "tomato-chutney"]) {
    assert.ok(recipes.some(r => r.id === id));
    assert.ok(guide[id].every(item => item.includes("|")), id);
  }
});
