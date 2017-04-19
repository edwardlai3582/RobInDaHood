const electron = require('electron');
const path = require('path');
const url = require('url');
// Module to control application life.
const app = electron.app;
const appId = "com.electron.robindahood";

let errMessage = "err neh"
let resMessage = "res neh"

app.setAppUserModelId(appId);
const Menu = electron.Menu;
const Tray = electron.Tray;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const notifier = require('node-notifier');

const template = [
  {
    role: 'help',
    submenu: [
      {
        role: 'toggledevtools'
      },
      {
        role: 'reload'
      }
    ]
  }
]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

//  Example of IPC Renderer, http://electron.atom.io/docs/api/ipc-main/

const {ipcMain} = require('electron');
ipcMain.on('asynchronous-message', (event, arg) => {
  notifier.notify({
    title: 'pong',
    message: 'pong',
    sound: true, // Only Notification Center or Windows Toasters
    wait: true,
    appName: appId
    //install: appId
  }, function (err, response, metadata) {
    // Response is response from notification
    console.log('Error:', err);
    errMessage = err;
    resMessage = response;
    event.sender.send('asynchronous-reply', [errMessage, resMessage, metadata, app.getName()]);
  });
});


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray = null;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1024,
      height: 720,
      minWidth: 600,
      webPreferences : {
        webSecurity  : false
      },
      icon: path.join(__dirname, '/../icon.ico')
    });

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
            pathname: path.join(__dirname, '/../built_by_create_react_app/index.html'),
            protocol: 'file:',
            slashes: true
        });
    mainWindow.loadURL(startUrl);

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    })

    mainWindow.on('minimize', function(event) {
      event.preventDefault()
      mainWindow.hide();
    });

    mainWindow.on('close', function (event) {
      return false;
    });

}

const createTray = () => {
  tray = new Tray(path.join(__dirname, '/../icon.ico'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: function(){
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: function(){
        app.quit();
      }
    }
  ])
  tray.setToolTip('ROBINDAHOOD');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    tray.popUpContextMenu();
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
  console.log("APP START");
  createWindow();
  createTray();

  // String
notifier.notify('Message');

// Object
notifier.notify({
  'title': 'My notification',
  'message': 'Hello, there!'
});

});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
