var global_config_directive = 'config';
var global_options_directive = 'appSettingsView';

var appSettingsView = require('electron').remote.getGlobal(global_options_directive);
var appConfig = require('electron').remote.getGlobal(global_config_directive);

var SettingsView = {

    bindEvents() {

        $("#reset-defaults").on("click", (e) => {

            e.preventDefault();
            appConfig.currentSettings = appConfig.defaultSettings;
            appConfig.saveConfiguration();
            appConfig.resetDefaultSettings();
            alert("Settings restored to defaults successfully!");

        });

        $("#save-button").on("click", (e) => {
            e.preventDefault();
            if ($(".invalid").length > 0) {
                return;
            }

            saveSettings();
            appSettingsView.window.close();

        });

        $("#close-button").on("click", () => {
            appSettingsView.window.close();
        });

    },

    initializeDefaults() {

        $("#disablegpu").attr("checked", appConfig.get("disablegpu") == true);
        $("#autoHideMenuBar").attr("checked", appConfig.get("autoHideMenuBar") == true);
        $("#globalshortcut").attr("checked", appConfig.get("globalshortcut") == true);
        $("#autostart").attr("checked", appConfig.get("autostart") == true);
        $("#startminimized").attr("checked", appConfig.get("startminimized") == true);
        $("#trayicon").attr("checked", appConfig.get("trayicon") != false);

        bindEvents();
    },

    saveSettings() {

        appConfig.set("disablegpu", $("#disablegpu").is(":checked"));
        appConfig.set("autoHideMenuBar", $("#autoHideMenuBar").is(":checked"));
        appConfig.set("globalshortcut", $("#globalshortcut").is(":checked"));
        appConfig.set("autostart", $("#autostart").is(":checked"));
        appConfig.set("startminimized", $("#startminimized").is(":checked"));
        appConfig.set("trayicon", $("#trayicon").is(":checked"));
        appConfig.saveConfiguration();
        appConfig.applyConfiguration();
    }
};

$(document).ready(() => {
    SettingsView.initializeDefaults();
});