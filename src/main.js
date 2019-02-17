    const { app, BrowserWindow, Tray, Menu, globalShortcut, dialog, clipboard, shell } = require('electron');
    const windowStateKeeper = require('electron-window-state');
    const path = require('path');
    const url = require('url');
    const AutoLaunch = require("auto-launch");
    const fileSystem = require('fs');
    const shortcuts = require('./shortcuts');

    let win = {};
    let tray = null;
    let gOauthWindow = undefined;
    let config = {};
    let shortcutsInstance = {};
    const mainUrl = 'https://todoist.com/app';







    function handlePageRedirect(e, url) {
        // there may be some popups on the same page
        if (url == app.webContents.getURL()) {
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



    function createTrayIcon(win) {

        tray = new Tray(path.join(__dirname, 'icons/icon_tray.png'));

        win.trayContextMenu = Menu.buildFromTemplate([{
                label: 'Open',
                click: bringAppToFocus()
            },
            {
                type: 'separator'
            },
            {
                label: 'Options',
                click: showOptionsWindow()
            }, {
                type: 'separator'
            }, {
                label: 'About',
                click: showAboutAppWindow()
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

    function bringAppToFocus(win) {
        win.window.show();
        win.window.focus();
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
            autoHideMenuBar: config.get("autoHideMenuBar") == true,
            icon: path.join(__dirname, 'icons/icon_tray.png')
        });

        // and load the index.html of the app.
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        }));

        createMainMenu();




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


    }

    function createMainMenu(win) {

        var mainMenuTemplateItems = [{

                label: 'File',
                submenu: [{
                        label: 'Options',
                        accelerator: 'Ctrl+S',
                        click: showOptionsWindow()

                    },
                    {
                        label: 'Reset App Data',
                        click: resetAppData()
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
                    click: clipboard.writeText(win.window.webContents.getURL())
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
                    click: win.window.webContents.goBack()
                }, {
                    label: 'Go Forward',
                    accelerator: 'Ctrl+]',
                    click: win.window.webContents.goForward()
                }, {
                    label: 'Reload page',
                    accelerator: 'Ctrl+R',
                    click: win.window.reload()
                }, {
                    type: 'separator'
                }, {
                    label: 'Toggle Full Screen',
                    accelerator: 'F11',
                    click: win.window.setFullScreen(!win.window.isFullScreen())
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
                    click: showAboutAppWindow()
                }]

            }

        ];
        win.menu = Menu.buildFromTemplate(mainMenuTemplateItems);
        Menu.setApplicationMenu(win.menu);

    }


    function resetAppData() {
        dialog.showMessageBox(win.window, {
            type: 'warning',
            buttons: ['Yes', 'Cancel'],
            defaultId: 2,
            title: 'Confirmation',
            message: 'This action will reset Todoist configuration by clearing its data (Cache, Cookies, Session data). Doing this may fix any issues but will also Sign you out from Todoist and a Sign In will be required next time you open Todoist. Are you sure you want to proceed?'
        }, function(response) {

            if (response === 0) {
                var session = win.window.webContents.session;

                session.clearStorageData(function() {
                    session.clearCache(function() {
                        win.window.loadURL(mainUrl);
                    });
                });
            }

        });
    }





    function main() {
        app.on('ready', createAppWindow);
        loadAppSettings();
        app.commandLine.appendSwitch('high-dpi-support', 1);
        app.commandLine.appendSwitch('force-device-scale-factor', 1);
    }


    function showAboutAppWindow() {

        if (aboutWindow) {

            aboutWindow.window.show();
            aboutWindow.window.focus();
        } else {

            aboutWindow = new BrowserWindow({
                width: 558,
                height: 648,
                resizable: false,
                center: true,
                frame: true,
                icon: path.join(__dirname, 'icons/icon_tray.png'),
                webPreferences: {
                    nodeIntegration: true,
                }

            });

            aboutWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'extras/about.html'),
                protocol: 'file:',
                slashes: true
            }));

            aboutWindow.window.webContents.on("new-window", (e, url) => {
                shell.openExternal(url);
                e.preventDefault();
            });

            aboutWindow.window.on("close", () => {
                aboutWindow = null;
            });


        }

        aboutWindow.window.show();
        aboutWindow.setMenu(null);
        aboutWindow.setMenuBarVisibility(false);

    }


    function showOptionsWindow() {

        if (optionsWindow) {

            optionsWindow.window.show();
            optionsWindow.window.focus();
        } else {

            optionsWindow = new BrowserWindow({
                width: 489,
                height: 450,
                resizable: false,
                center: true,
                frame: true,
                icon: path.join(__dirname, 'icons/icon_tray.png'),
                webPreferences: {
                    nodeIntegration: true,
                }

            });

            optionsWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'extras/UserSettings.html'),
                protocol: 'file:',
                slashes: true
            }));

            optionsWindow.window.webContents.on("new-window", (e, url) => {
                shell.openExternal(url);
                e.preventDefault();
            });

            optionsWindow.window.on("close", () => {
                optionsWindow = null;
            });


        }

        optionsWindow.window.show();
        optionsWindow.setMenu(null);
        optionsWindow.setMenuBarVisibility(false);

    }

    function registerGlobalKeyboardShortcuts() {
        shortcutsInstance = new shortcuts(app);
        shortcutsInstance.registerAllShortcuts();

    }

    function unregisterGlobalKeyboardShortcuts() {

        if (shortcutsInstance != undefined) {
            shortcutsInstance.unregisterAllShortcuts();
        }

    }



    global.config = {

        settingsFile: path.join(app.getPath('userData'), "/settings.json"),
        startupScript: new AutoLaunch({ name: app.getName() }),

        configKeys: {
            optionId_enableTrayIcon: "enableTrayIcon",
            optionId_autoStartOnLogon: "autoStartOnLogon",
            optionId_startMinimized: "startMinimized",
            optionId_hideMainMenuBar: "hideMainMenuBar",
            optionId_enableGlobalKeyboardShortcuts: "enableGlobalKeyboardShortcuts",
            optionId_disableGPUAcceleration: "disableGPUAcceleration",
        },

        defaultSettings: {
            optionId_enableTrayIcon: true,
            optionId_autoStartOnLogon: false,
            optionId_startMinimized: false,
            optionId_hideMainMenuBar: true,
            optionId_enableGlobalKeyboardShortcuts: true,
            optionId_disableGPUAcceleration: false

        },


        addSelfToSystemStartup() {

            startupScript.isEnabled().then(function(enabled) {
                if (!enabled) {
                    startupScript.enable();
                }
            });

        },

        removeSelfFromStartup() {

            startupScript.isEnabled().then(function(enabled) {
                if (enabled) {
                    startupScript.disable();

                }
            });

        },

        currentSettings: {},



        loadAppSettings() {

            try {
                var data = fileSystem.readFileSync(settingsFile);

                if (data != "" && data != "{}" && data != "[]") {
                    currentSettings = JSON.parse(data);

                } else {
                    console.log("Couldn't find valid configuration, loading defaults.");
                    currentSettings = defaultSettings;

                }
            } catch (e) {
                currentSettings = defaultSettings;

            }


            if (!config.get(configKeys.optionId_startMinimized)) {
                app.window.show();

            }

            if (config.get(configKeys.optionId_disableGPUAcceleration)) {

                app.disableHardwareAcceleration();
            }


            if (config.get(configKeys.optionId_enableTrayIcon) != false && app.tray === undefined) {
                createTrayIcon();
            }

            if (config.get(configKeys.optionId_autoStartOnLogon)) {
                addSelfToSystemStartup();

            } else {
                removeSelfFromStartup();

            }

            if (config.get(configKeys.optionId_enableGlobalKeyboardShortcuts)) {

                registerGlobalKeyboardShortcuts();
            }

            app.window.setMenuBarVisibility(config.get(configKeys.optionId_hideMainMenuBar) != true);
            app.window.setAutoHideMenuBar(config.get(configKeys.optionId_hideMainMenuBar));
        },

        resetToDefaults() {

            currentSettings = defaultSettings;
            saveSettingsToDisk();
            loadAppConfig();
        },

        saveSettingsToDisk() {

            var user_options = JSON.stringify(config.currentSettings);
            fileSystem.writeFileSync(settingsFile, user_options);

        },

        get(key) {
            return config.currentSettings[key];
        },

        set(key, value) {
            config.currentSettings[key] = value;
        }


    };





    main();