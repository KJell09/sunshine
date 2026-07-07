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

test("elapsed breaks the time together into years / months / days", async ({ page }) => {
  const call = (start, now) =>
    page.evaluate(([s, n]) => window.MSARY.elapsed(s, new Date(n)), [start, now]);

  const anniv = "2026-04-19";
  expect(await call(anniv, "2026-04-19T12:00:00")).toEqual({ years: 0, months: 0, days: 0 }); // day zero
  expect(await call(anniv, "2026-07-07T12:00:00")).toEqual({ years: 0, months: 2, days: 18 });
  expect(await call(anniv, "2027-04-19T12:00:00")).toEqual({ years: 1, months: 0, days: 0 }); // first anniversary
  expect(await call(anniv, "2027-04-18T12:00:00")).toEqual({ years: 0, months: 11, days: 30 }); // day before
});

test("elapsed clamps a future or invalid anniversary to zero", async ({ page }) => {
  const call = (start, now) =>
    page.evaluate(([s, n]) => window.MSARY.elapsed(s, new Date(n)), [start, now]);
  expect(await call("2030-01-01", "2026-01-01T12:00:00")).toEqual({ years: 0, months: 0, days: 0 });
  expect(await call("not-a-date", "2026-07-07T12:00:00")).toEqual({ years: 0, months: 0, days: 0 });
});

test("anniversaryNumber uses the configured year and coerces bad values to 1", async ({ page }) => {
  const result = await page.evaluate((now) => {
    const C = window.MSARY.CONFIG;
    const original = C.ANNIVERSARY_YEAR;
    const out = {};
    C.ANNIVERSARY_YEAR = 1;       out.one = window.MSARY.anniversaryNumber(new Date(now));
    C.ANNIVERSARY_YEAR = 5;       out.five = window.MSARY.anniversaryNumber(new Date(now));
    C.ANNIVERSARY_YEAR = "abc";   out.garbage = window.MSARY.anniversaryNumber(new Date(now));
    C.ANNIVERSARY_YEAR = 0;       out.zero = window.MSARY.anniversaryNumber(new Date(now));
    C.ANNIVERSARY_YEAR = "auto";  out.auto = window.MSARY.anniversaryNumber(new Date("2029-04-19T12:00:00"));
    C.ANNIVERSARY_YEAR = original;
    return out;
  }, "2026-07-07T12:00:00");
  expect(result).toEqual({ one: 1, five: 5, garbage: 1, zero: 1, auto: 3 });
});

test("daysSince counts whole elapsed days and clamps at zero", async ({ page }) => {
  const call = (start, now) =>
    page.evaluate(([s, n]) => window.MSARY.daysSince(s, new Date(n)), [start, now]);

  const anniv = "2026-04-19";
  expect(await call(anniv, "2026-04-19T12:00:00")).toBe(0);
  expect(await call(anniv, "2026-04-29T12:00:00")).toBe(10);
  expect(await call(anniv, "2026-01-01T12:00:00")).toBe(0); // future anniversary
  expect(await call("not-a-date", "2026-07-07T12:00:00")).toBe(0);
});
