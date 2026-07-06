const { test, expect } = require("@playwright/test");
const { PAGE } = require("./helpers");

// End-to-end tests of the rendered greeting: the flow and content your partner
// actually sees.

test("shows the start screen and hides the greeting until tapped", async ({ page }) => {
  await page.goto(PAGE);
  await expect(page.locator("#start")).toBeVisible();
  await expect(page.locator("#main")).toBeHidden();
});

test("tapping open reveals the greeting with no console errors", async ({ page }) => {
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto(PAGE);
  await page.locator("#start").click();

  await expect(page.locator("#main")).toBeVisible();
  await expect(page.locator("#title")).toContainText("Monthsary");
  await expect(page.locator("#counter .pill")).toHaveCount(3);
  expect(errors).toEqual([]);
});

test("title and counter reflect the auto-computed monthsary", async ({ page }) => {
  await page.goto(PAGE);
  await page.locator("#start").click();

  const months = await page.evaluate(() => window.MSARY.monthCount());
  const ordinal = await page.evaluate((m) => window.MSARY.ordinal(m), months);

  await expect(page.locator("#title")).toContainText(`Happy ${ordinal} Monthsary`);
  await expect(page.locator("#counter .pill").first().locator("b")).toHaveText(String(months));
});

test("journal renders one photo print and one note per configured entry", async ({ page }) => {
  await page.goto(PAGE);
  await page.locator("#start").click();

  const count = await page.evaluate(() => window.MSARY.CONFIG.JOURNAL.length);
  await expect(page.locator("#entries .entry")).toHaveCount(count);
  await expect(page.locator("#entries .polaroid")).toHaveCount(count);
  await expect(page.locator("#entries .note")).toHaveCount(count);
});

test("journal entries without a photo show the placeholder frame", async ({ page }) => {
  await page.goto(PAGE);
  await page.locator("#start").click();

  const withoutPhoto = await page.evaluate(
    () => window.MSARY.CONFIG.JOURNAL.filter((e) => !e.src).length
  );
  await expect(page.locator("#entries .photo .ph")).toHaveCount(withoutPhoto);
});

test("journal escapes special characters and never injects markup", async ({ page }) => {
  await page.goto(PAGE);
  await page.locator("#start").click();

  await page.evaluate(() => {
    window.MSARY.CONFIG.JOURNAL = [
      { src: "", caption: "you & me", note: "I <3 you <img src=x onerror=alert(1)>" },
    ];
    window.MSARY.buildJournal();
  });

  await expect(page.locator("#entries .caption")).toHaveText("you & me");
  await expect(page.locator("#entries .note")).toHaveText("I <3 you <img src=x onerror=alert(1)>");
  await expect(page.locator("#entries .note img")).toHaveCount(0);
});

test("start screen is operable via the Space key", async ({ page }) => {
  await page.goto(PAGE);
  await page.locator("#start").focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#main")).toBeVisible();
});

test("counter renders integers (never NaN) even with a bad anniversary", async ({ page }) => {
  await page.goto(PAGE);
  await page.locator("#start").click();
  await page.evaluate(() => {
    window.MSARY.CONFIG.ANNIVERSARY = "oops-not-a-date";
    window.MSARY.buildCounter();
  });
  const values = await page.locator("#counter .pill b").allTextContents();
  expect(values).toEqual(["0", "0", "0"]);
});

test("reduced motion suppresses the falling-hearts animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(PAGE);
  await page.locator("#start").click();
  await page.waitForTimeout(500);
  await expect(page.locator(".heart")).toHaveCount(0);
});

test("no horizontal scroll on a phone-sized viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(PAGE);
  await page.locator("#start").click();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
