
import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from 'url';
import path from 'path';

// ✅ Define `__dirname` manually in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import './ipcHandlers.js';


let mainWindow;
let gallerySetupWindow;



app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        frame: false,
        icon: path.join(__dirname, 'icons', 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('public/index.html');


    ipcMain.on('open-gallery-setup', () => {
        if (!gallerySetupWindow) { // Prevent multiple popups
            gallerySetupWindow = new BrowserWindow({
                width: 600,
                height: 400,
                // parent: mainWindow, // Make it a child of the main window
                modal: false, // Keeps it on top of the main window
                resizable: false, // Prevents resizing
                minimizable: false, // Can't be minimized
                closable: true, // Can be closed
                frame: false,
                icon: path.join(__dirname, 'icons', 'icon.png'),
                webPreferences: {
                    contextIsolation: true,
                    preload: path.join(__dirname, 'preload.js')
                }
            });

            gallerySetupWindow.loadFile('public/popups/gallery-setup.html'); // ✅ Load a separate HTML file

            gallerySetupWindow.on('closed', () => {
                gallerySetupWindow = null; // Reset when closed
            });
        }
    });











});

// ✅ Close database connection on app exit
app.on('window-all-closed', () => {
    app.quit();
});


ipcMain.on('mainWindow-minimize', (event) => {
    mainWindow.minimize();
});

ipcMain.on('mainWindow-maximize', (event) => {
    let win = mainWindow;
    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
});

ipcMain.on('mainWindow-close', (event) => {
    mainWindow.close();
});

ipcMain.on('gallerySetupWindow-close', (event) => {
    gallerySetupWindow.close();
});










