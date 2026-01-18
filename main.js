const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let tabs = [];
let activeTab = 0;

function createTab(url = 'about:home') {
  const view = new BrowserView({
    webPreferences: { contextIsolation: true }
  });

  tabs.push(view);
  switchTab(tabs.length - 1);

  if (url.startsWith('about:')) {
    loadAbout(view, url);
  } else {
    view.webContents.loadURL(url);
  }
}

function switchTab(index) {
  if (!tabs[index]) return;
  if (tabs[activeTab]) mainWindow.removeBrowserView(tabs[activeTab]);
  activeTab = index;
  mainWindow.setBrowserView(tabs[activeTab]);
  resizeView();
}

function resizeView() {
  const { width, height } = mainWindow.getBounds();
  tabs[activeTab].setBounds({
    x: 0,
    y: 210,
    width,
    height: height - 210
  });
  tabs[activeTab].setAutoResize({ width: true, height: true });
}

function loadAbout(view, url) {
  const page = url.replace('about:', '') || 'home';
  const file = path.join(__dirname, 'about', `${page}.html`);
  view.webContents.loadFile(file).catch(() =>
    view.webContents.loadFile(
      path.join(__dirname, 'about', 'about.html')
    )
  );
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    frame: false,
    vibrancy: 'ultra-dark',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('renderer/index.html');
  createTab();

  mainWindow.on('resize', resizeView);
}


ipcMain.on('new-tab', () => createTab());

ipcMain.on('switch-tab', (_, i) => switchTab(i));

ipcMain.on('navigate', (_, { input, engine }) => {
  const view = tabs[activeTab];
  let val = input.trim();

  if (val.startsWith('about:')) {
    loadAbout(view, val);
    return;
  }

  const isURL =
    val.includes('.') &&
    !val.includes(' ') &&
    !val.startsWith('?');

  if (isURL) {
    view.webContents.loadURL(
      val.startsWith('http') ? val : `https://${val}`
    );
  } else {
    const engines = {
      custom: 'https://dqlfwl-8080.csb.app/search?q=',
      mojeek: 'https://www.mojeek.com/search?q='
    };
    view.webContents.loadURL(
      engines[engine] + encodeURIComponent(val)
    );
  }
});

ipcMain.on('back', () => tabs[activeTab].webContents.goBack());
ipcMain.on('forward', () => tabs[activeTab].webContents.goForward());
ipcMain.on('reload', () => tabs[activeTab].webContents.reload());

app.whenReady().then(createWindow);
