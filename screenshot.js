const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  // Login page
  await page.goto(
    "https://ip3.rilapp.com/railways/index.php",
    { waitUntil: "networkidle2", timeout: 60000 }
  );

  await page.type("#username", process.env.LOGIN_USERNAME, { delay: 50 });
  await page.type("#password", process.env.LOGIN_PASSWORD, { delay: 50 });

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" })
  ]);

  // Dashboard page
  await page.goto(
    "https://ip3.rilapp.com/railways/dashboard_deviceListOnly.php",
    { waitUntil: "networkidle2", timeout: 60000 }
  );

  const time = new Date()
    .toISOString()
    .replace(/:/g, "-")
    .replace("T", "_")
    .split(".")[0];

  const file = `gps_screenshot_${time}.png`;

  await page.screenshot({ path: file, fullPage: true });

  console.log("Saved:", file);

  await browser.close();
})();
