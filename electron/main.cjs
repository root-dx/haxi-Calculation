const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const isDev = !app.isPackaged;
const isMac = process.platform === 'darwin';

const WINDOW_SIZE = {
  default: { width: 800, height: 720, minHeight: 600 },
  success: { width: 880, height: 860, minHeight: 760 },
};

let mainWindow = null;

function applyWindowMode(mode) {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const nextMode = mode === 'success' ? 'success' : 'default';
  const target = WINDOW_SIZE[nextMode];

  mainWindow.setMinimumSize(640, target.minHeight);

  if (isMac) {
    const [currentWidth] = mainWindow.getSize();
    const nextWidth = Math.max(currentWidth, target.width);
    mainWindow.setSize(nextWidth, target.height, true);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: WINDOW_SIZE.default.width,
    height: WINDOW_SIZE.default.height,
    minWidth: 640,
    minHeight: WINDOW_SIZE.default.minHeight,
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: '哈希计算工具',
    icon: path.join(__dirname, '../build/icon.ico'),
    frame: false,  // 隐藏原生标题栏，使用自定义标题栏
    autoHideMenuBar: true,
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  app.whenReady().then(() => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 流式计算 SHA-256，支持大文件（如 2GB）
async function hashFileSHA256(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath, { highWaterMark: 2 * 1024 * 1024 }); // 2MB chunks
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

// SM3 在 Node 侧不实现，由渲染进程用 hash-wasm 处理

ipcMain.handle('hash-file', async (_, { filePath, algorithm }) => {
  if (algorithm === 'SHA-256') {
    return hashFileSHA256(filePath);
  }
  if (algorithm === 'SM3') {
    return null; // 由渲染进程计算
  }
  throw new Error('不支持的算法');
});

ipcMain.handle('is-electron', () => true);
ipcMain.handle('set-window-mode', (_, mode) => {
  applyWindowMode(mode);
});

// 窗口控制 API
ipcMain.handle('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('is-window-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});
