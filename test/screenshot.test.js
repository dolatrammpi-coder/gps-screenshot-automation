const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

// Test the screenshot naming and directory conventions without launching a
// browser or sending credentials to the external GPS website.
function screenshotMonth(date) {
  return date.toISOString().slice(0, 7);
}

function screenshotFilename(date) {
  return (
    "gps_" +
    date.toISOString().replace(/:/g, "-").replace("T", "_").slice(0, 19) +
    ".png"
  );
}

test("screenshots are grouped by UTC year and month", () => {
  assert.equal(screenshotMonth(new Date("2026-10-22T13:45:12.000Z")), "2026-10");
  assert.equal(screenshotMonth(new Date("2026-01-01T00:00:00.000Z")), "2026-01");
});

test("screenshot filenames use a filesystem-friendly UTC timestamp", () => {
  assert.equal(
    screenshotFilename(new Date("2026-10-22T13:45:12.000Z")),
    "gps_2026-10-22_13-45-12.png"
  );
  assert.match(
    screenshotFilename(new Date("2026-10-22T13:45:12.000Z")),
    /^gps_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.png$/
  );
});

test("screenshot paths stay inside the monthly screenshots directory", () => {
  const date = new Date("2026-10-22T13:45:12.000Z");
  const screenshotsRoot = path.join(os.tmpdir(), "gps-screenshot-test");
  const outputPath = path.join(
    screenshotsRoot,
    screenshotMonth(date),
    screenshotFilename(date)
  );

  assert.equal(path.dirname(outputPath), path.join(screenshotsRoot, "2026-10"));
  assert.equal(path.basename(outputPath), "gps_2026-10-22_13-45-12.png");
  assert.equal(fs.existsSync(outputPath), false, "test should not create screenshot files");
});
