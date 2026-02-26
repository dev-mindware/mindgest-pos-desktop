import path from "path";
import { app, BrowserWindow } from "electron";
import serve from "electron-serve";

const isProd: boolean = process.env.NODE_ENV === "production";

console.log("--- Electron Main Process Log ---");
console.log("Environment:", isProd ? "production" : "development");

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

async function createWindow() {
  console.log("Attempting to create window...");
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Nextron passes the port as the first argument in development
  const port = process.argv[2];
  const entryPath = "pos/counter";
  const url = isProd
    ? `app://./${entryPath}`
    : `http://localhost:${port}/${entryPath}`;

  console.log(`Target URL: ${url}`);

  try {
    await mainWindow.loadURL(url);
    console.log("Window loaded successfully");
  } catch (err) {
    console.error("CRITICAL: Failed to load URL:", err);
  }

  if (!isProd) {
    mainWindow.webContents.openDevTools();
  }
}

app.on("ready", () => {
  console.log("Main process READY EVENT triggered");
  createWindow();
});

app.on("window-all-closed", () => {
  console.log("Shutdown: All windows closed");
  app.quit();
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});
