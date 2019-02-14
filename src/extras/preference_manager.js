const path = require('path');

class PreferenceManager {



    constructor(app) {

        var settingsFile = path.join(app.getPath('userData'), "/settings.json");

        global.config = {

            defaultSettings: {
                width: 752,
                height: 622,
                disablegpu: false,
                autoHideMenuBar: true,
                globalshortcut: true,
                autostart: false,
                startminimized: false,
                trayicon: true,
                maximized: false
            },

            currentSettings: {},

            loadConfiguration() {



                try {
                    var data = fileSystem.readFileSync(settingsFile);
                    if (data != "" && data != "{}" && data != "[]") {
                        config.currentSettings = JSON.parse(data);

                    } else {
                        console.log("Couldn't find valid configuration, loading defaults.")
                        config.currentSettings = config.defaultSettings;

                    }
                } catch (e) {
                    config.currentSettings = config.defaultSettings;

                }
                // First time configuration - eg. before app init
                if (config.get("disablegpu") == true) {

                    app.disableHardwareAcceleration();
                }
            },

            applyConfiguration() {

                if (config.get("maximized") && config.get("startminimized") != true) {
                    app.window.maximize();
                }

                if (config.get("trayicon") != false && app.tray == undefined) {
                    todoist.createTray();
                } else if (config.get("trayicon") == false && app.tray != undefined) {

                    app.tray.destroy();
                    app.tray = undefined;
                }

                if (config.get("autostart") == true) {
                    startupScript.isEnabled().then(function(enabled) {
                        if (!enabled) {
                            startupScript.enable();

                        }
                    });
                } else {
                    startupScript.isEnabled().then(function(enabled) {
                        if (enabled) {
                            startupScript.disable();

                        }
                    });
                }
                app.window.setMenuBarVisibility(config.get("autoHideMenuBar") != true);
                app.window.setAutoHideMenuBar(config.get("autoHideMenuBar") == true);
            },

            resetDefaultSettings() {

                settings.window.close();
                settings.loadConfiguration();

            },

            saveConfiguration() {

                fileSystem.writeFileSync(settingsFile, JSON.stringify(config.currentSettings), 'utf-8');
            },

            get(key) {
                return config.currentSettings[key];
            },

            set(key, value) {
                config.currentSettings[key] = value;
            },

            unSet(key) {
                if (config.currentSettings.hasOwnProperty(key)) {
                    delete config.currentSettings[key];
                }
            }
        };



    }






}




global.settings = {
    init() {
        // if there is already one instance of the window created show that one
        if (settings.window) {
            settings.window.show();
        } else {
            settings.openWindow();

        }
    },

    openWindow() {
        settings.window = new BrowserWindow({
            "width": 489,
            "height": 450,
            "resizable": true,
            "center": true,
            "frame": true,
            "title": "Options",
            icon: path.join(__dirname, '/assets/icons/icon_tray.png'),
            "webPreferences": {
                "nodeIntegration": true,
            }
        });
        settings.window.setMenu(null);
        settings.window.setMenuBarVisibility(false);
        settings.window.loadURL("file://" + __dirname + "/assets/html/settings.html");
        settings.window.show();

        settings.window.on("close", () => {
            settings.window = null;
        });
    }
};





module.exports = PreferenceManager;