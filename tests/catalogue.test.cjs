const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const site = path.join(__dirname, "..", "dist");
const data = fs.readFileSync(path.join(site, "recipes.js"), "utf8");
const recipes = vm.runInNewContext(data + "\nSwaadfolioRecipes");
const credits = fs.readFileSync(path.join(site, "credits.html"), "utf8");

test("the Indian launch has eight unique recipes from eight states", () => {
  assert.equal(recipes.length, 8);
  assert.equal(new Set(recipes.map(r => r.id)).size, 8);
  assert.equal(new Set(recipes.map(r => r.region)).size, 8);
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

test("the kitchen pick opens a real recipe and all eight photos ship with credits", () => {
  const home = fs.readFileSync(path.join(site, "index.html"), "utf8");
  const hero = home.match(/href="#recipe\/([^"]+)"/);
  assert.ok(hero && recipes.some(r => r.id === hero[1]));
  for (const r of recipes) {
    const bytes = fs.readFileSync(path.join(site, "assets", r.id + ".webp"));
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  }
  assert.equal((credits.match(/commons\.wikimedia\.org\/wiki\/File:/g) || []).length, 8);
});
