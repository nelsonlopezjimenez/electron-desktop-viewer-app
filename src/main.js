//@ts-check
// Modules to control application life and create native browser window
const { app, Menu, BrowserWindow, ipcMain , dialog} = require('electron/main')
const { shell, MenuItem, BaseWindow } = require('electron')
const path = require('node:path')
const fs = require("node:fs");

/**
 * @type {Menu}
 */
const appMenu = new Menu()

ipcMain.on('new-window', (event, { url, width, height }) => {
  const win = new BrowserWindow({ width, height })
  win.loadURL(url)
})

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
     
    }
  })

  appMenu.append(new MenuItem({label: 'About', click: () => {
    dialog.showMessageBox(mainWindow, {
      title: "About",
      type: "info",
      message: "Author: Rocky Connor <Incarcerated CA>"
    })
  }}))
  
  Menu.setApplicationMenu(appMenu)

//  appMenu.items[0].click = (event, focusedWindow, focusedWebContent) => {
//     console.log(event, focusedWindow, focusedWebContent)
//   }

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open external links in the default browser
  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle("find-the-files", (event) => {
  return findAll("C:/websites/edu.gcfglobal.org");
})

/**
 * findAll recursively searches through the websites dir at the
 * root and returns an array of filepaths to the index.html files
 * in all subdirectories
 * @param {string} dir
 * @returns {string[]}
 */
const findAll = (dir) => {
  let indexFiles = [];
  recursiveSearcher(dir, (dirent) => {
    indexFiles.push({name: path.basename(dirent.parentPath), path: path.join(dirent.parentPath, dirent.name),});
  });
  return indexFiles;
};

/**
 * @callback Processor
 * @param {fs.Dirent} dirent
 */

/**
 * recursiveSearcher
 *
 * Recursively navigates through given directory and passes the first index.html
 * file to the callback function for further processing.
 * NOTE: remember to give your recursive functions a callback to process the data.
 * @param {string} dir
 * @param {Processor} cb
 */
const recursiveSearcher = (dir, cb) => {
  const dirArr = fs.readdirSync(dir, { withFileTypes: true });
  const indexFilter = dirArr.filter((ent) => ent.name === "tutorial.html");
  for (const dirent of dirArr) {
    if (
      (dirent.isDirectory() || dirent.isSymbolicLink()) &&
      indexFilter.length === 0
    ) {
      recursiveSearcher(path.join(dirent.parentPath, dirent.name), cb);
    } else if (dirent.isFile()) {
      if (
        path.extname(path.join(dirent.parentPath, dirent.name)) === ".html" &&
        dirent.name === "tutorial.html"
      ) {
        cb(dirent);
      }
    }
  }
};