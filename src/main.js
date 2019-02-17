    const { app, BrowserWindow, Tray, Menu, globalShortcut, dialog, clipboard, shell } = require('electron');
    const windowStateKeeper = require('electron-window-state');
    const path = require('path');
    const url = require('url');

    const shortcuts = require('./shortcuts');
    const prefs = require('./AppPreferences');
    

    let win = undefined;
    let tray = undefined;
    let aboutWindow = undefined;
    let gOauthWindow = undefined;
    let shortcutsInstance = undefined;
   
    const mainUrl = 'https://todoist.com/app';

    function handlePageRedirect(e, url) {
        // there may be some popups on the same page
        if (url == win.webContents.getURL()) {
            return true;
        }

        // when user is logged in there is link
        // asks to update the page. It should be opened
        // in the app and not in the external browser
        if (url === mainUrl) {
            win.reload();
            return true;
        }

        /**
         * In case of google's oauth login
         * let's create another window and listen for
         * its "close" event.
         * As soon as that event fired we can refresh our
         * main window.
         */
        if (/google.+?oauth/.test(url)) {
            e.preventDefault();
            gOauthWindow = new BrowserWindow();
            gOauthWindow.loadURL(url);
            gOauthWindow.on('close', () => {
                win.reload();
            });
            return true;
        }


        e.preventDefault();
        shell.openExternal(url);
    }



    function createTrayIcon() {

        tray = new Tray(path.join(__dirname, 'icons/icon_tray.png'));

        trayContextMenu = Menu.buildFromTemplate([{
                label: 'Open',
                click: bringAppToFocus
            },
            {
                type: 'separator'
            },
            {
                label: 'Options',
                click: prefs.showAppSettings
            }, {
                type: 'separator'
            }, {
                label: 'About',
                click: AboutApp.showWindow
            },
            {
                label: 'Quit',
                click: () => {
                    app.isQuiting = true;
                    app.quit();
                }
            }
        ]);

        tray.on('click', bringAppToFocus);

        tray.setToolTip('Todoist');
        tray.setContextMenu(trayContextMenu);
    }

    function bringAppToFocus() {
        win.show();
        win.focus();
    }

    function createAppWindow() {

        let mainWindowState = windowStateKeeper({
            defaultWidth: 800,
            defaultHeight: 600
        });

        // use mainWindowState to restore previous
        // size/position of window
        win = new BrowserWindow({
            x: mainWindowState.x,
            y: mainWindowState.y,
            width: mainWindowState.width,
            height: mainWindowState.height,
            title: 'Todoist',
            icon: path.join(__dirname, 'icons/icon_tray.png')
        });

        // and load the index.html of the app.
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        }));

        // react on close and minimize
        win.on('minimize', function(event) {
            event.preventDefault();
            win.hide();
        });

        win.on('close', function(event) {
            if (!app.isQuiting) {
                event.preventDefault();
                win.hide();
            }

            unregisterGlobalKeyboardShortcuts();

            return false;
        });

        win.on('hide', function() {
            win.currentWindowState = 'hidden';
        });

        win.on('show', function() {
            win.currentWindowState = 'shown';
        });

        win.webContents.on('new-window', handlePageRedirect);
        // manage size/position of the window
        // so it can be restored next time
        mainWindowState.manage(win);

        createMainMenu(win);
    }

    function createMainMenu(win) {

        var mainMenuTemplateItems = [{

                label: 'File',
                submenu: [{
                        label: 'Options',
                        accelerator: 'Ctrl+S',
                        click: prefs.showAppSettings

                    },
                    {
                        label: 'Reset App Data',
                        click: resetAppData
                    },
                    {
                        type: 'separator'
                    },

                    {
                        label: 'Quit',
                        accelerator: 'Ctrl+Q',
                        click: () => {
                            app.isQuiting = true;
                            app.quit();
                        }
                    }
                ]
            },


            {
                label: 'Edit',
                submenu: [{
                    label: 'Undo',
                    accelerator: 'Ctrl+Z',
                    role: 'undo'
                }, {
                    label: 'Redo',
                    accelerator: 'Shift+Ctrl+Z',
                    role: 'redo'
                }, {
                    type: 'separator'
                }, {
                    label: 'Cut',
                    accelerator: 'Ctrl+X',
                    role: 'cut'
                }, {
                    label: 'Copy',
                    accelerator: 'Ctrl+C',
                    role: 'copy'
                }, {
                    label: 'Copy Current URL',
                    accelerator: 'Ctrl+L',
                    click: clipboard.writeText(win.webContents.getURL())
                }, {
                    label: 'Paste',
                    accelerator: 'Ctrl+V',
                    role: 'paste'
                }, {
                    label: 'Paste and Match Style',
                    accelerator: 'Ctrl+Shift+V',
                    role: 'pasteandmatchstyle'
                }, {
                    label: 'Select All',
                    accelerator: 'Ctrl+A',
                    role: 'selectall'
                }, {
                    type: 'separator'
                }]
            }, {
                label: 'View',
                submenu: [{
                    label: 'Go Back',
                    accelerator: 'Ctrl+[',
                    click: win.webContents.goBack()
                }, {
                    label: 'Go Forward',
                    accelerator: 'Ctrl+]',
                    click: win.webContents.goForward()
                }, {
                    label: 'Reload page',
                    accelerator: 'Ctrl+R',
                    click: win.reload()
                }, {
                    type: 'separator'
                }, {
                    label: 'Toggle Full Screen',
                    accelerator: 'F11',
                    click: win.setFullScreen(win.isFullScreen())
                }]
            }, {
                label: 'Window',
                role: 'window',
                submenu: [{
                    label: 'Minimize',
                    accelerator: 'Ctrl+M',
                    role: 'minimize'
                }, {
                    label: 'Close',
                    accelerator: "esc",
                    role: 'close'
                }]
            },
            {
                label: 'Help',
                submenu: [{
                    label: `About`,
                    click: AboutApp.showWindow
                }]

            }

        ];
        win.menu = Menu.buildFromTemplate(mainMenuTemplateItems);
        Menu.setApplicationMenu(win.menu);

    }


    function resetAppData() {
        try{

            dialog.showMessageBox(win, {
                type: 'warning',
                buttons: ['Yes', 'Cancel'],
                defaultId: 2,
                title: 'Confirmation',
                message: 'This action will reset the current app data and will require you to sign in again the next time you open Todoist. Doing this may help fix certain issues (if any) but isn\'t recommended otherwise. Do you want to proceed?'
            }, function(response) {
    
                if (response === 0) {
                    var session = win.webContents.session;
    
                    session.clearStorageData(function() {
                        session.clearCache(function() {
                            app.isQuiting = true;
                            app.quit();
                        });
                    });
                }
    
            });


        }
        catch(e){
            console.log(e);
        }
      
    }

    function initializeApp(){

        createAppWindow();
        let config = new prefs(win);
        config.loadAppSettings();
    }

    function main() {
        app.on('ready', initializeApp);
        app.commandLine.appendSwitch('high-dpi-support', 1);
        app.commandLine.appendSwitch('force-device-scale-factor', 1);
       
    }

    global.AboutApp = {

        showWindow(){

            if (aboutWindow){
                aboutWindow.show();
                aboutWindow.focus();
            }
            else
            {
                AboutApp.createNewAboutWindow();
            }
        },

        createNewAboutWindow(){
            
            aboutWindow = new BrowserWindow({
                width: 560,
                height: 650,
                resizable: false,
                center: true,
                icon: path.join(__dirname, 'icons/icon_tray.png'),
                webPreferences: {
                    nodeIntegration: true,
                }
    
            });
    
            aboutWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'extras/AboutApp.html'),
                protocol: 'file:',
                slashes: true
            }));
    
            aboutWindow.webContents.on("new-window", (e, url) => {
                shell.openExternal(url);
                e.preventDefault();
            });
    
            aboutWindow.on("close", () => {
                aboutWindow = undefined;
            });
    
    
            aboutWindow.show();
            aboutWindow.setMenu(null);
            aboutWindow.setMenuBarVisibility(false);
        }
      
    };



   
    function registerGlobalKeyboardShortcuts() {
        shortcutsInstance = new shortcuts(win);
        shortcutsInstance.registerAllShortcuts();

    }

    function unregisterGlobalKeyboardShortcuts() {

        if (shortcutsInstance != undefined) {
            shortcutsInstance.unregisterAllShortcuts();
        }

    }


    main();