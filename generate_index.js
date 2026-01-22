const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "screenshots");
const indexPath = path.join(__dirname, "index.html");

if (!fs.existsSync(baseDir)) process.exit(0);

const months = fs.readdirSync(baseDir).sort().reverse();

let latestHtml = "";
let archiveHtml = "";

for (const month of months) {
  const monthDir = path.join(baseDir, month);
  if (!fs.statSync(monthDir).isDirectory()) continue;

  const files = fs
    .readdirSync(monthDir)
    .filter(f => f.endsWith(".png"))
    .sort()
    .reverse();

  if (!files.length) continue;

  if (!latestHtml) {
    latestHtml = `<img src="screenshots/${month}/${files[0]}">`;
  }

  archiveHtml += `<div class="month"><h3>${month}</h3>`;
  for (const f of files) {
    archiveHtml += `<img src="screenshots/${month}/${f}">`;
  }
  archiveHtml += `</div>`;
}

let html = fs.readFileSync(indexPath, "utf8");

html = html.replace(
  /<div id="latest">[\s\S]*?<\/div>/,
  `<div id="latest">${latestHtml}</div>`
);

html = html.replace(
  /<!-- AUTO-START -->[\s\S]*?<!-- AUTO-END -->/,
  `<!-- AUTO-START -->\n${archiveHtml}\n<!-- AUTO-END -->`
);

fs.writeFileSync(indexPath, html);
console.log("index.html updated");
