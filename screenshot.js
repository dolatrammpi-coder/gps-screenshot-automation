const puppeteer = require("puppeteer");
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

  const ts = new Date().toISOString().replace(/[:T]/g, "-").split(".")[0];
  const fileName = `gps_screenshot_${ts}.png`;
  const filePath = path.join(process.cwd(), fileName);

  await page.screenshot({ path: filePath, fullPage: true });
  console.log("Saved:", fileName);

  await browser.close();
})();
