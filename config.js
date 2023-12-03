// Add values if you are not using env vars
const fs = require("fs");
require("dotenv").config();
const path = require("path");

if (process.env.USE_CHROME === "true") {
  const isWin = process.platform === "win32";
  const islinux = process.platform === "linux";
  if (isWin) {
    const ChromePaths = [
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    ];
    for (const chrome_path of ChromePaths) {
      if (fs.existsSync(chrome_path)) {
        process.env.CHROME_EXECUTABLE_PATH = chrome_path;
      }
    }
  } else if (islinux) {
    const chromeBins = ["google-chrome", "google-chrome-stable"];
    const dirs = ["/usr/bin", "/bin"];
    for (const dir of dirs) {
      for (const bin of chromeBins) {
        const binPath = path.join(dir, bin);
        if (fs.existsSync(binPath)) {
          process.env.CHROME_EXECUTABLE_PATH = binPath;
        }
      }
    }
  }
}

module.exports = {
  session_key: process.env.SESSION_KEY,
  timezone:
    process.env.TIMEZONE || Intl.DateTimeFormat().resolvedOptions().timeZone,
  pmpermit_enabled: process.env.PMPERMIT_ENABLED || "true",
  mongodb_url: process.env.MONGODB_URL || process.env.MONGO_URL || "",
  default_tr_lang: process.env.DEFAULT_TR_LANG || "en",
  enable_delete_alert: process.env.ENABLE_DELETE_ALERT || "true",
  ocr_space_api_key: process.env.OCR_SPACE_API_KEY || "",
  server_mode: process.env.SERVER_MODE || "false",
  CHROME_EXEC: process.env.CHROME_EXECUTABLE_PATH || "",
  HOLIDAY_API_KEY: process.env.CALENDARIFIC_API_KEY || "",
  HOST_ENV: process.platform || "",
};
