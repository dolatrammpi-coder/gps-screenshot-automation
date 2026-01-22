const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  // Login
  await page.goto("https://ip3.rilapp.com/railways/index.php", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  await page.type("#username", process.env.LOGIN_USERNAME);
  await page.type("#password", process.env.LOGIN_PASSWORD);

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  // Dashboard
  await page.goto(
    "https://ip3.rilapp.com/railways/dashboard_deviceListOnly.php",
    { waitUntil: "networkidle2", timeout: 60000 }
  );

  // Folder create
  const dir = path.join(process.cwd(), "screenshots");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const ts = new Date().toISOString().replace(/[:T]/g, "-").split(".")[0];
  const fileName = `gps_${ts}.png`;
  const filePath = path.join(dir, fileName);

  await page.screenshot({ path: filePath, fullPage: true });
  console.log("Saved:", filePath);

  await browser.close();
})();
