var appSettingsView = require('electron').remote.getGlobal('settings');
var config = require('electron').remote.getGlobal('config');


const resetToDefaultsBtnId = "#btn-reset-defaults";
const saveAndCloseBtnId = "#btn-save-and-close";
const closeBtnId = "#btn-close";

const optionId_enableTrayIcon = "enableTrayIcon";
const optionId_autoStartOnLogon = "autoStartOnLogon";
const optionId_startMinimized = "startMinimized";
const optionId_hideMainMenuBar = "hideMainMenuBar";
const optionId_enableGlobalKeyboardShortcuts = "enableGlobalKeyboardShortcuts";
const optionId_disableGPUAcceleration = "disableGPUAcceleration";


$(document).ready(() => {

    SettingsView.loadSettings();
});

var SettingsView = {

    bindToDOMEvents() {

        $(closeBtnId).on("click", () => {
            SettingsView.closeWindow();
        });

        $(resetToDefaultsBtnId).on("click", (e) => {
            e.preventDefault();

            config.resetToDefaults();
        });

        $(saveAndCloseBtnId).on("click", (e) => {
            e.preventDefault();
            if ($(".invalid").length > 0) {
                return;
            }

            SettingsView.saveSettings();
            SettingsView.closeWindow();

        });
    },

    loadSettings() {

     

        $("#disableGPUAcceleration").attr("checked", config.get("disableGPUAcceleration") == true);
        $("#hideMainMenuBar").attr("checked", config.get("hideMainMenuBar") == true);
        $("#enableGlobalKeyboardShortcuts").attr("checked", config.get("enableGlobalKeyboardShortcuts") == true);
        $("#autoStartOnLogon").attr("checked", config.get("autoStartOnLogon") == true);
        $("#startMinimized").attr("checked", config.get("startMinimized") == true);
        $("#enableTrayIcon").attr("checked", config.get("enableTrayIcon") != false);

        
        
        // $('#' + optionId_disableGPUAcceleration).attr("checked",  config.get("\'" + optionId_disableGPUAcceleration + "\'") );
        // $('#' + optionId_hideMainMenuBar).attr("checked", config.get("\'" + optionId_hideMainMenuBar + "\'"));
        // $('#' + optionId_enableGlobalKeyboardShortcuts).attr("checked", config.get("\'" + optionId_enableGlobalKeyboardShortcuts + "\'"));
        // $('#' + optionId_autoStartOnLogon).attr("checked",config.get("\'" + optionId_autoStartOnLogon + "\'"));
        // $('#' + optionId_startMinimized).attr("checked",config.get("\'" +optionId_startMinimized + "\'"));
        // $('#' + optionId_enableTrayIcon).attr("checked", config.get("\'" +optionId_enableTrayIcon + "\'"));

        SettingsView.bindToDOMEvents();
    },

    saveSettings() {
        config.set("disableGPUAcceleration", $("#disableGPUAcceleration").is(":checked"));
        config.set("hideMainMenuBar", $("#hideMainMenuBar").is(":checked"));
        config.set("enableGlobalKeyboardShortcuts", $("#enableGlobalKeyboardShortcuts").is(":checked"));
        config.set("autoStartOnLogon", $("#autoStartOnLogon").is(":checked"));
        config.set("startMinimized", $("#startMinimized").is(":checked"));
        config.set("enableTrayIcon", $("#enableTrayIcon").is(":checked"));


        // config.set(optionId_disableGPUAcceleration, $(optionId_disableGPUAcceleration).is(":checked"));
        // config.set(optionId_hideMainMenuBar, $(optionId_hideMainMenuBar).is(":checked"));
        // config.set(optionId_enableGlobalKeyboardShortcuts, $(optionId_enableGlobalKeyboardShortcuts).is(":checked"));
        // config.set(optionId_autoStartOnLogon, $(optionId_autoStartOnLogon).is(":checked"));
        // config.set(optionId_startMinimized, $(optionId_startMinimized).is(":checked"));
        // config.set(optionId_enableTrayIcon, $(optionId_enableTrayIcon).is(":checked"));

        config.saveSettingsToDisk();
        config.loadAppSettings();
    },

    closeWindow() {
        appSettingsView.closeWindow();
    }
};
