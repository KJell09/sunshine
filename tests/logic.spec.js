const { test, expect } = require("@playwright/test");
const { PAGE } = require("./helpers");

// Unit tests for the pure date/ordinal helpers. Because the logic lives inline
// in index.html (so the page stays a single self-contained file), we load the
// page once and call the functions exposed on window.MSARY, injecting a fixed
// "now" so the assertions are deterministic regardless of the real date.

test.beforeEach(async ({ page }) => {
  await page.goto(PAGE);
});

test("ordinal produces correct English suffixes", async ({ page }) => {
  const result = await page.evaluate(() =>
    [1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 100, 101, 111].map(window.MSARY.ordinal)
  );
  expect(result).toEqual([
    "1st", "2nd", "3rd", "4th", "11th", "12th", "13th",
    "21st", "22nd", "23rd", "100th", "101st", "111th",
  ]);
});

test("monthsElapsed counts only completed months", async ({ page }) => {
  const call = (start, now) =>
    page.evaluate(([s, n]) => window.MSARY.monthsElapsed(s, new Date(n)), [start, now]);

  const anniv = "2026-04-19";
  expect(await call(anniv, "2026-04-19T12:00:00")).toBe(0); // day zero
  expect(await call(anniv, "2026-05-18T12:00:00")).toBe(0); // day before first monthsary
  expect(await call(anniv, "2026-05-19T12:00:00")).toBe(1); // exactly one month
  expect(await call(anniv, "2026-07-06T12:00:00")).toBe(2); // mid third month
  expect(await call(anniv, "2027-04-19T12:00:00")).toBe(12); // one year
});

test("monthsElapsed never goes negative for a future anniversary", async ({ page }) => {
  const result = await page.evaluate(() =>
    window.MSARY.monthsElapsed("2030-01-01", new Date("2026-01-01T12:00:00"))
  );
  expect(result).toBe(0);
});

test("date helpers return 0 for an invalid anniversary", async ({ page }) => {
  const result = await page.evaluate((now) => ({
    days: window.MSARY.daysSince("not-a-date", new Date(now)),
    months: window.MSARY.monthsElapsed("2026-13-99", new Date(now)),
  }), "2026-07-06T12:00:00");
  expect(result).toEqual({ days: 0, months: 0 });
});

test("monthCount coerces MONTHS to a non-negative integer", async ({ page }) => {
  const result = await page.evaluate((now) => {
    const C = window.MSARY.CONFIG;
    const original = C.MONTHS;
    const out = {};
    C.MONTHS = "5";   out.numericString = window.MSARY.monthCount(new Date(now));
    C.MONTHS = 3;     out.number = window.MSARY.monthCount(new Date(now));
    C.MONTHS = "abc"; out.garbage = window.MSARY.monthCount(new Date(now));
    C.MONTHS = -4;    out.negative = window.MSARY.monthCount(new Date(now));
    C.MONTHS = original;
    return out;
  }, "2026-07-06T12:00:00");
  expect(result).toEqual({ numericString: 5, number: 3, garbage: 0, negative: 0 });
});

test("daysSince counts whole elapsed days and clamps at zero", async ({ page }) => {
  const call = (start, now) =>
    page.evaluate(([s, n]) => window.MSARY.daysSince(s, new Date(n)), [start, now]);

  const anniv = "2026-04-19";
  expect(await call(anniv, "2026-04-19T12:00:00")).toBe(0);
  expect(await call(anniv, "2026-04-29T12:00:00")).toBe(10);
  expect(await call(anniv, "2026-01-01T12:00:00")).toBe(0); // future anniversary
});
