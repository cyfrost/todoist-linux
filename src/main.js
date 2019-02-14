    const { app, BrowserWindow, Tray, Menu, globalShortcut, dialog, clipboard, shell } = require('electron');
    const windowStateKeeper = require('electron-window-state');
    const path = require('path');
    const url = require('url');
    const AutoLaunch = require("auto-launch");
    const fileSystem = require('fs');
    const mainUrl = 'https://todoist.com/app';
    const shortcuts = require('./shortcuts');




    function handleRedirect(e, url) {
        // there may be some popups on the same page
        if (url == win.webContents.getURL()) {
            return true;
        }

        // when user is logged in there is link
        // asks to update the page. It should be opened
        // in the app and not in the external browser
        if (url == 'https://todoist.com/app') {
            win.reload();
            return true;
        }

        e.preventDefault()
        shell.openExternal(url)
    }



    function createTray(win) {
        tray = new Tray(path.join(__dirname, 'icons/icon.png'));
        const contextMenu = Menu.buildFromTemplate([{
                label: 'Show',
                click: function() {
                    win.show();
                }
            },
            {
                label: 'Quit',
                click: function() {
                    app.isQuiting = true;
                    app.quit();
                }
            }
        ]);
        tray.setToolTip('Todoist');
        tray.setContextMenu(contextMenu);
    }



    function createWindow() {
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
            icon: path.join(__dirname, 'icons/icon.png')
        });

        win.setMenu(null);

        // and load the index.html of the app.
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        }));

        win['currentWindowState'] = 'shown';

        createTray(win);
        shortcutsInstance = new shortcuts(win);
        shortcutsInstance.registerAllShortcuts();

        // react on close and minimzie
        win.on('minimize', function(event) {
            event.preventDefault();
            win.hide();
        });

        win.on('close', function(event) {
            if (!app.isQuiting) {
                event.preventDefault();
                win.hide();
            }

            return false;
        });

        win.on('hide', function() {
            win['currentWindowState'] = 'hidden';
        });

        win.on('show', function() {
            win['currentWindowState'] = 'shown';
        });

        win.webContents.on('new-window', handleRedirect)
            // manage size/positio of the window
            // so it can be restore next time
        mainWindowState.manage(win);
    }



    function addSelfToSystemStartup() {
        var startupScript = new AutoLaunch({
            name: app.getName(),
        });

    }


    function todoist global() {


        global.todoist = {

            init() {
                todoist.tray = undefined;
                todoist.createMenu();
                todoist.clearCache();
                todoist.openWindow();
                config.applyConfiguration();

            },

            createMenu() {

                var template = [{

                        label: 'File',
                        submenu: [{
                                label: 'Options',
                                accelerator: 'CmdOrCtrl+S',
                                click: function() {
                                    settings.init();
                                }

                            },
                            {
                                label: 'Clear App Data',
                                click: function click() {
                                    todoist.clearAppData();
                                }
                            },
                            {
                                type: 'separator'
                            },

                            {
                                label: 'Quit',
                                accelerator: 'CmdOrCtrl+Q',
                                click: function() {
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
                            accelerator: 'CmdOrCtrl+Z',
                            role: 'undo'
                        }, {
                            label: 'Redo',
                            accelerator: 'Shift+CmdOrCtrl+Z',
                            role: 'redo'
                        }, {
                            type: 'separator'
                        }, {
                            label: 'Cut',
                            accelerator: 'CmdOrCtrl+X',
                            role: 'cut'
                        }, {
                            label: 'Copy',
                            accelerator: 'CmdOrCtrl+C',
                            role: 'copy'
                        }, {
                            label: 'Copy Current URL',
                            accelerator: 'CmdOrCtrl+L',
                            click: function click() {
                                clipboard.writeText(todoist.window.webContents.getURL());
                            }
                        }, {
                            label: 'Paste',
                            accelerator: 'CmdOrCtrl+V',
                            role: 'paste'
                        }, {
                            label: 'Paste and Match Style',
                            accelerator: 'CmdOrCtrl+Shift+V',
                            role: 'pasteandmatchstyle'
                        }, {
                            label: 'Select All',
                            accelerator: 'CmdOrCtrl+A',
                            role: 'selectall'
                        }, {
                            type: 'separator'
                        }]
                    }, {
                        label: 'View',
                        submenu: [{
                            label: 'Back',
                            accelerator: 'CmdOrCtrl+[',
                            click: function click() {
                                todoist.window.webContents.goBack();
                            }
                        }, {
                            label: 'Forward',
                            accelerator: 'CmdOrCtrl+]',
                            click: function click() {
                                todoist.window.webContents.goForward();
                            }
                        }, {
                            label: 'Reload',
                            accelerator: 'CmdOrCtrl+R',
                            click: function click(item) {
                                todoist.window.reload();
                            }
                        }, {
                            type: 'separator'
                        }, {
                            label: 'Toggle Full Screen',
                            accelerator: 'F11',
                            click: function click(item, focusedWindow) {
                                todoist.window.setFullScreen(!todoist.window.isFullScreen());
                            }
                        }]
                    }, {
                        label: 'Window',
                        role: 'window',
                        submenu: [{
                            label: 'Minimize',
                            accelerator: 'CmdOrCtrl+M',
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
                            click: function click() {
                                about.init();
                            }

                        }]

                    }




                ];
                todoist.menu = Menu.buildFromTemplate(template);
                Menu.setApplicationMenu(todoist.menu);
            },


            clearCache() {
                try {
                    fileSystem.unlinkSync(app.getPath('userData') + '/Application Cache/Index');
                } catch (e) {}
            },

            createTray() {
                todoist.tray = new Tray(path.join(__dirname, '/assets/icons/icon_tray.png'));
                todoist.trayContextMenu = Menu.buildFromTemplate([{
                        label: 'Show',
                        click: function() {
                            todoist.window.show();
                            todoist.window.focus();
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Reset app',
                        click: function() {
                            todoist.clearAppData();
                            config.currentSettings = config.defaultSettings;
                            config.saveConfiguration();
                            if (settings.window) {
                                settings.window.close();
                            }
                            if (about.window) {
                                about.window.close();
                            }
                            todoist.window.reload();
                            todoist.window.show();
                            todoist.window.focus();
                        }
                    },
                    {
                        label: 'Options',
                        click: function() {

                            settings.init();
                        }
                    }, {
                        type: 'separator'
                    }, {
                        label: 'About',
                        click: function() {
                            about.init();
                        }
                    },
                    {
                        label: 'Quit',
                        click: function() {
                            app.isQuiting = true;
                            app.quit();
                        }
                    }
                ]);

                todoist.tray.on('click', () => {
                    todoist.window.show();
                    todoist.window.focus();
                });

                todoist.tray.setToolTip('Todoist');
                todoist.tray.setContextMenu(todoist.trayContextMenu);

            },


            openWindow() {
                // Create the browser window.
                todoist.window = new BrowserWindow({
                    "y": config.get("posY"),
                    "x": config.get("posX"),
                    "width": config.get("width"),
                    "height": config.get("height"),
                    "minWidth": 480,
                    "minHeight": 480,
                    "title": "Todoist",
                    "show": false,
                    "autoHideMenuBar": config.get("autoHideMenuBar") == true,
                    "icon": path.join(__dirname, '/assets/icons/icon.png')
                });

                todoist.window.loadURL(mainUrl);

                if (config.get("startminimized") != true) {
                    todoist.window.show();
                }

                todoist.window.on('move', (e, evt) => {
                    config.set("posX", todoist.window.getBounds().x);
                    config.set("posY", todoist.window.getBounds().y);
                    config.set("width", todoist.window.getBounds().width);
                    config.set("height", todoist.window.getBounds().height);
                    config.saveConfiguration();
                });

                todoist.window.on('resize', (e, evt) => {
                    config.set("posX", todoist.window.getBounds().x);
                    config.set("posY", todoist.window.getBounds().y);
                    config.set("width", todoist.window.getBounds().width);
                    config.set("height", todoist.window.getBounds().height);
                    config.saveConfiguration();
                });

                todoist.window.on('close', (e) => {
                    if (settings.window) {
                        settings.window.close();
                        settings.window = null;
                    }

                    if (todoist.tray == undefined) {
                        app.quit();
                    } else if (todoist.window.forceClose !== true) {
                        e.preventDefault();
                        todoist.window.hide();
                    }
                });


                app.on('before-quit', () => {
                    todoist.window.forceClose = true;
                });

                // react on close and minimzie
                todoist.window.on('minimize', function(event) {
                    event.preventDefault();
                    todoist.window.hide();
                });

                todoist.window.on('close', function(event) {
                    if (!app.isQuiting) {
                        event.preventDefault();
                        todoist.window.hide();
                    }

                    return false;
                });

                todoist.window.on('hide', function() {
                    currentWindowState = 'hidden';
                });

                todoist.window.on('show', function() {
                    currentWindowState = 'shown';
                });

                todoist.window.webContents.on('new-window', todoist.handleRedirect);


            },
            clearAppData() {
                dialog.showMessageBox(todoist.window, {
                    type: 'warning',
                    buttons: ['Yes', 'Cancel'],
                    defaultId: 1,
                    title: 'Clear cache confirmation',
                    message: 'This will clear all data (cookies, local storage etc) from this app. Are you sure you wish to proceed?'
                }, function(response) {
                    if (response !== 0) {
                        return;
                    }
                    var session = todoist.window.webContents.session;

                    session.clearStorageData(function() {
                        session.clearCache(function() {
                            todoist.window.loadURL(mainUrl);
                        });
                    });
                });
            },

            setupShortcuts() {

                if (config.get("globalshortcut") == false) {
                    return;
                }

                globalShortcut.register('CmdOrCtrl+Alt+T', function() {
                        if (todoist.window.isFocused())
                            todoist.window.hide();
                        else
                            todoist.window.show();
                    })
                    // quick add task
                globalShortcut.register('CmdOrCtrl+Alt+A', () => {
                    // open quick add popup
                    todoist.window.webContents.sendInputEvent({
                        type: "char",
                        keyCode: 'q'
                    });
                    todoist.window.show();
                });

            },

            handleRedirect(e, url) {
                if (url != todoist.window.webContents.getURL()) {
                    e.preventDefault()
                    shell.openExternal(url)
                }
            }
        };





    }



    function prefloader() {

        import the prefloader js here and init config
        global.config.init();

    }


    function main() {



        let win = {};
        let tray = null;

        app.on('ready', () => {

            todoist.init();
            todoist.setupShortcuts();
            createWindow();


        });

        app.commandLine.appendSwitch('high-dpi-support', 1);
        app.commandLine.appendSwitch('force-device-scale-factor', 1);

    }


    function about() {


        global.about = {
            init() {
                // if there is already one instance of the window created show that one
                if (about.window) {
                    about.window.show();
                } else {
                    about.openWindow();
                    about.window.setMenu(null);
                    about.window.setMenuBarVisibility(false);
                }
            },

            openWindow() {
                about.window = new BrowserWindow({
                    "width": 558,
                    "height": 648,
                    "resizable": true,
                    "center": true,
                    "frame": true,
                    icon: path.join(__dirname, '/assets/icons/icon_tray.png'),
                    "webPreferences": {
                        "nodeIntegration": true,
                    }

                });

                about.window.loadURL("file://" + __dirname + "/assets//html/about.html");
                about.window.show();
                about.window.webContents.on("new-window", (e, url) => {
                    shell.openExternal(url);
                    e.preventDefault();
                });

                about.window.on("close", () => {
                    about.window = null;
                });
            }
        };


    }



    main();