const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

// ===== Google Drive Auth =====
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GDRIVE_KEY),
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

async function uploadToDrive(filePath, fileName) {
  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [process.env.GDRIVE_FOLDER_ID],
    },
    media: {
      mimeType: "image/png",
      body: fs.createReadStream(filePath),
    },
  });
  console.log("Uploaded to Drive:", res.data.id);
}

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

  await page.type("#username", process.env.LOGIN_USERNAME, { delay: 50 });
  await page.type("#password", process.env.LOGIN_PASSWORD, { delay: 50 });

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
  const filePath = path.join(__dirname, fileName);

  await page.screenshot({ path: filePath, fullPage: true });
  console.log("Saved:", fileName);

  // Upload
  await uploadToDrive(filePath, fileName);

  fs.unlinkSync(filePath);
  await browser.close();
})();
