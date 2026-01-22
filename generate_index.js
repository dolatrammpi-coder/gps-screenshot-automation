const fs = require("fs");
const path = require("path");

const screenshotsDir = path.join(__dirname, "screenshots");
const indexPath = path.join(__dirname, "index.html");

if (!fs.existsSync(screenshotsDir)) {
  console.log("No screenshots folder yet");
  process.exit(0);
}

const files = fs
  .readdirSync(screenshotsDir)
  .filter(f => f.endsWith(".png"))
  .sort()
  .reverse(); // latest first

let imagesHtml = "";

for (const file of files) {
  imagesHtml += `
  <div class="item">
    <img src="screenshots/${file}">
    <div class="time">${file.replace("gps_", "").replace(".png","")}</div>
  </div>`;
}

let html = fs.readFileSync(indexPath, "utf8");
html = html.replace(
  /<!-- AUTO-GENERATED: DO NOT EDIT -->[\\s\\S]*?{{IMAGES}}/,
  `<!-- AUTO-GENERATED: DO NOT EDIT -->\n${imagesHtml}\n{{IMAGES}}`
);

fs.writeFileSync(indexPath, html);
console.log("index.html updated");
