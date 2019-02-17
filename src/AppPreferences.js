
const AutoLaunch = require("auto-launch");
const fileSystem = require('fs');
const { app, BrowserWindow, Tray, Menu, globalShortcut, dialog, clipboard, shell } = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const url = require('url');
const settingsFile = path.join(app.getPath('userData'), "/settings.json");

let win = undefined;
let currentSettings = {};

const optionId_enableTrayIcon = "enableTrayIcon";
const optionId_autoStartOnLogon = "autoStartOnLogon";
const optionId_startMinimized = "startMinimized";
const optionId_hideMainMenuBar = "hideMainMenuBar";
const optionId_enableGlobalKeyboardShortcuts = "enableGlobalKeyboardShortcuts";
const optionId_disableGPUAcceleration = "disableGPUAcceleration";

let defaultSettings = {
    optionId_enableTrayIcon: true,
    optionId_autoStartOnLogon: true,
    optionId_startMinimized: false,
    optionId_hideMainMenuBar: false,
    optionId_enableGlobalKeyboardShortcuts: true,
    optionId_disableGPUAcceleration: false
};


class AppPreferences {


    constructor(win){

        this.win = win;
        
    }


    showAppSettings(){
    
        if (optionsWindow){
            optionsWindow.show();
            optionsWindow.focus();
        }
        else
        {
            settings.createNewSettingsWindow();
        }
    }

    createNewSettingsWindow(){

        optionsWindow = new BrowserWindow({
            width: 550,
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

        optionsWindow.webContents.on("new-window", (e, url) => {
            shell.openExternal(url);
            e.preventDefault();
        });

        optionsWindow.on("close", () => {
            optionsWindow = undefined;
        });

        optionsWindow.show();
        optionsWindow.setMenu(null);
        optionsWindow.setMenuBarVisibility(false);
        optionsWindow.webContents.openDevTools();
    }



    addSelfToSystemStartup() {

        startupScript = new AutoLaunch({ name: app.getName() });

        startupScript.isEnabled().then(function(enabled) {
            if (!enabled) {
                startupScript.enable();
            }
        });

    }

    removeSelfFromStartup() {

        startupScript = new AutoLaunch({ name: app.getName() });

        startupScript.isEnabled().then(function(enabled) {
            if (enabled) {
                startupScript.disable();

            }
        });

    }

    loadAppSettings() {

        try {
            var data = fileSystem.readFileSync(settingsFile);

            if (data != "" && data != "{}" && data != "[]") {
                currentSettings = JSON.parse(data);

            } else {
                currentSettings = defaultSettings;
               }
               
            
        } catch (e) {
            currentSettings = defaultSettings;

        }

        removeSelfFromStartup();

        if (!getConfig(optionId_startMinimized)) {
            win.show();

        }

        if (getConfig(optionId_disableGPUAcceleration)) {

            app.disableHardwareAcceleration();
        }


        if (getConfig(optionId_enableTrayIcon) != false && app.tray === undefined) {
            createTrayIcon();
        }

        if (getConfig(optionId_autoStartOnLogon)) {
            config.addSelfToSystemStartup();

        } else {
            config.removeSelfFromStartup();

        }

        if (getConfig(optionId_enableGlobalKeyboardShortcuts)) {

            registerGlobalKeyboardShortcuts();
        }

        win.setMenuBarVisibility(getConfig(optionId_hideMainMenuBar) != true);

    }

    resetToDefaults() {

        config.currentSettings = config.defaultSettings;
        saveSettingsToDisk();
        loadAppSettings();
    }

    saveSettingsToDisk() {

        var user_options = JSON.stringify(config.currentSettings);
        fileSystem.writeFileSync(settingsFile, user_options);

    }

    getConfig(key) {
        return currentSettings[key];
    }

    setConfig(key, value) {
        config.currentSettings[key] = value;
    }
}

module.exports = AppPreferences;