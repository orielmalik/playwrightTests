const { test, expect } = require('@playwright/test');
const { getSelectors } = require('../Utils/SelectorsUtils');
const map=require('../Utils/checker.json');
let initial='https://.com/#/';
const names=[];

// פונקציה להשהיית זמן
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadButton(name, page, type) {
  const arr = [];
  const first = await page.content;
  const group = await page.getByRole(type, {name: name});
  let i = 0;
  if (group.count() > 1) {
    while (i < group.count) {
      arr.push(group.nth(i).click());
      const last = await page.content;
      await expect(last).toEqual(first());
      i++;
    }
    await Promise.all(arr);
  } else {
    await group.first().click();
    const la = await page.content;
    await expect(la).toEqual(first());
  }
}

test.describe("checkHomePage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(initial);
    await expect(page).toHaveURL(initial);
  });

  test("stayAtHome", async ({ page }) => {
    await page.getByText("HOME");
    await expect(page).toHaveURL(initial);
  });

  test("check btns", async ({ page }) => {
    await loadButton("TRY IT", page, "button");
    await loadButton("EXPLORE OUR TOOLS", page, "button");
  });

  test.afterEach(async ({ page }) => {
    await page.goto(initial);
    await sleep(16000); // השהיה של 16 שניות אחרי כל קבוצת בדיקות
  });
});

test.describe("PDF QUIZ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(initial);
    await page.getByText("PDF QUIZ").first().click();
    await expect(page).toHaveURL(initial + "pdf-quiz");
  });

  test("PDF UPLOAD", async ({ page }) => {
    await page.getByRole('button', { name: "UPLOAD PDF FILE" }).click();
    const uploadButton = page.getByRole('button', { name: 'Upload PDF File' });

    await uploadButton.click();
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles("./More/Oriel Malik CV  .pdf");
    await expect(page).toHaveURL(initial + "pdf-quiz");
    const element = page.locator('#root > div > div.MuiBox-root.css-e42i7k > div > div > div.MuiBox-root.css-59wmmk > div > div > p');
    const text = await element.textContent();
    expect(text).toMatch(/^File:.*\.pdf$/);

    await expect(page).toHaveURL(initial + "pdf-quiz");
    await page.getByRole('button', { name: "SUBMIT" }).first().click();
  });

  test.afterEach(async ({ page }) => {
    page.goto(initial);
    await sleep(16000); // השהיה של 16 שניות אחרי כל קבוצת בדיקות
  });
});

test.describe("KEYWORDS", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(initial + "keywords");
  });

  ['hk', '', 'gaya', '#a'].forEach(word => {
    test("FILL  " + word.toString(), async ({ page }) => {
      const txtb = await page.getByRole('textbox', { name: "Enter your word here" });
      const p1 = page.locator('p.MuiTypography-root.MuiTypography-body1.css-fyswvn');
      await txtb.fill(word.toString());
      const txt = p1.textContent();
      await page.getByRole('button', { name: "GENERATE" }).click();

      await expect(page.getByText("Explanation:")).toBeDefined();
      await expect(p1.textContent()).not.toEqual(txt);
    });
  });

  test.afterEach(async ({ page }) => {
    await sleep(16000); // השהיה של 16 שניות אחרי כל קבוצת בדיקות
  });
});

test.describe("SCHEMA BUILDER", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(initial + "schema-builder");
  });

  ["animal", "", "json", "{name:burger}", "[]"].forEach(word => {
    test("INPUT " + word.toString(), async ({ page }) => {
      await page.getByRole('textbox', { name: "Enter scheme query here" }).fill(word.toString());
      await page.getByRole('button', { name: "GENERATE" }).click();
      const lineLocator = (await page.locator('div.cm-activeLine.cm-line').textContent()).replace(" ", "");
      await expect(lineLocator).not.toEqual("");
    });
  });

  test.afterEach(async ({ page }) => {
    await sleep(16000); // השהיה של 16 שניות אחרי כל קבוצת בדיקות
  });
});
