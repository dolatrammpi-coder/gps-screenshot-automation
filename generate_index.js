const fs = require("fs");
const path = require("path");

const screenshotsDir = path.join(__dirname, "screenshots");
const indexPath = path.join(__dirname, "index.html");

if (!fs.existsSync(screenshotsDir)) {
  console.log("No screenshots folder");
  process.exit(0);
}

const files = fs
  .readdirSync(screenshotsDir)
  .filter(f => f.endsWith(".png"))
  .sort()
  .reverse();

let imagesHtml = "";

for (const file of files) {
  imagesHtml += `
  <div class="item">
    <img src="screenshots/${file}">
    <div class="time">${file}</div>
  </div>
`;
}

let html = fs.readFileSync(indexPath, "utf8");

// 🔥 SIMPLE & SAFE replace
const start = "<!-- AUTO-START -->";
const end = "<!-- AUTO-END -->";

if (!html.includes(start) || !html.includes(end)) {
  console.error("AUTO markers not found in index.html");
  process.exit(1);
}

const before = html.split(start)[0];
const after = html.split(end)[1];

html =
  before +
  start +
  "\n" +
  imagesHtml +
  "\n" +
  end +
  after;

fs.writeFileSync(indexPath, html);
console.log("index.html regenerated");
