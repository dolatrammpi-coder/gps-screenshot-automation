const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  // 🔐 Login page
  await page.goto("https://ip3.rilapp.com/railways/index.php", {
    waitUntil: "networkidle2"
  });

  await page.type("#username", process.env.LOGIN_USERNAME);
  await page.type("#password", process.env.LOGIN_PASSWORD);

  await Promise.all([
    page.click("button[type=submit]"),
    page.waitForNavigation({ waitUntil: "networkidle2" })
  ]);

  // 📊 Dashboard page
  await page.goto(
    "https://ip3.rilapp.com/railways/dashboard_deviceListOnly.php",
    { waitUntil: "networkidle2" }
  );

  // 📂 Month folder
  const now = new Date();
  const month = now.toISOString().slice(0, 7); // YYYY-MM
  const dir = path.join(process.cwd(), "screenshots", month);
  fs.mkdirSync(dir, { recursive: true });

  const filename =
    "gps_" +
    now.toISOString().replace(/:/g, "-").replace("T", "_").slice(0, 19) +
    ".png";

  const filepath = path.join(dir, filename);

  await page.screenshot({ path: filepath, fullPage: true });
  console.log("Saved:", filepath);

  await browser.close();
})();
