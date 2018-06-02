var settings = require('electron').remote.getGlobal('settings');
var config = require('electron').remote.getGlobal('config');

var SettingsView = {
    bindEvents() {
        $this = this;
        $("#reset-defaults").on("click", (e) => {
            e.preventDefault();
            config.currentSettings = config.defaultSettings;
            config.saveConfiguration();
            config.resetDefaultSettings();

        });

        $("#save-button").on("click", (e) => {
            e.preventDefault();
            if ($(".invalid").length > 0) {
                return;
            }
            $this.saveSettings();
            settings.window.close();
        });

        $("#close-button").on("click", () => {
            settings.window.close();
        });

    },

    init() {
        $("#disablegpu").attr("checked", config.get("disablegpu") == true);
        $("#autoHideMenuBar").attr("checked", config.get("autoHideMenuBar") == true);
        $("#globalshortcut").attr("checked", config.get("globalshortcut") == true);
        $("#autostart").attr("checked", config.get("autostart") == true);
        $("#startminimized").attr("checked", config.get("startminimized") == true);
        $("#trayicon").attr("checked", config.get("trayicon") != false);

        this.bindEvents();
    },

    saveSettings() {
        config.set("disablegpu", $("#disablegpu").is(":checked"));
        config.set("autoHideMenuBar", $("#autoHideMenuBar").is(":checked"));
        config.set("globalshortcut", $("#globalshortcut").is(":checked"));
        config.set("autostart", $("#autostart").is(":checked"));
        config.set("startminimized", $("#startminimized").is(":checked"));
        config.set("trayicon", $("#trayicon").is(":checked"));
        config.saveConfiguration();
        config.applyConfiguration();
    }
};

$(document).ready(() => {
    SettingsView.init();
});