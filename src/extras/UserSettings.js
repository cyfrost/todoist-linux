var global_config_directive = 'config';
var global_options_directive = 'appSettingsView';

var appSettingsView = require('electron').remote.getGlobal(global_options_directive);
var appConfig = require('electron').remote.getGlobal(global_config_directive);

const resetToDefaultsBtnId = "#btn-reset-defaults";
const saveAndCloseBtnId = "#btn-save-and-close";
const closeBtnId = "#btn-close";

const optionId_enableTrayIcon = "#enableTrayIcon";
const optionId_autoStartOnLogon = "#autoStartOnLogon";
const optionId_startMinimized = "#startMinimized";
const optionId_hideMainMenuBar = "#hideMainMenuBar";
const optionId_enableGlobalKeyboardShortcuts = "#enableGlobalKeyboardShortcuts";
const optionId_disableGPUAcceleration = "#disableGPUAcceleration";


var SettingsView = {

    bindToDOMEvents() {

        $(closeBtnId).on("click", () => {
            closeWindow();
        });

        $(resetToDefaultsBtnId).on("click", (e) => {
            e.preventDefault();

            appConfig.resetToDefaults();

            $(optionId_disableGPUAcceleration).attr("checked", appConfig.defaultSettings.optionId_disableGPUAcceleration);
            $(optionId_hideMainMenuBar).attr("checked", appConfig.defaultSettings.optionId_hideMainMenuBar);
            $(optionId_enableGlobalKeyboardShortcuts).attr("checked", appConfig.defaultSettings.optionId_enableGlobalKeyboardShortcuts);
            $(optionId_autoStartOnLogon).attr("checked", appConfig.defaultSettings.optionId_autoStartOnLogon);
            $(optionId_startMinimized).attr("checked", appConfig.defaultSettings.optionId_startMinimized);
            $(optionId_enableTrayIcon).attr("checked", appConfig.defaultSettings.optionId_enableTrayIcon);

            alert("Settings restored to defaults successfully!");
        });

        $(saveAndCloseBtnId).on("click", (e) => {
            e.preventDefault();
            if ($(".invalid").length > 0) {
                return;
            }

            saveSettings();
            closeWindow();

        });
    },

    loadSettings() {

        $(optionId_disableGPUAcceleration).attr("checked", appConfig.get(optionId_disableGPUAcceleration));
        $(optionId_hideMainMenuBar).attr("checked", appConfig.get(optionId_hideMainMenuBar));
        $(optionId_enableGlobalKeyboardShortcuts).attr("checked", appConfig.get(optionId_enableGlobalKeyboardShortcuts));
        $(optionId_autoStartOnLogon).attr("checked", appConfig.get(optionId_autoStartOnLogon));
        $(optionId_startMinimized).attr("checked", appConfig.get(optionId_startMinimized));
        $(optionId_enableTrayIcon).attr("checked", appConfig.get(optionId_enableTrayIcon));

        bindToDOMEvents();
    },

    saveSettings() {

        appConfig.set(optionId_disableGPUAcceleration, $(optionId_disableGPUAcceleration).is(":checked"));
        appConfig.set(optionId_hideMainMenuBar, $(optionId_hideMainMenuBar).is(":checked"));
        appConfig.set(optionId_enableGlobalKeyboardShortcuts, $(optionId_enableGlobalKeyboardShortcuts).is(":checked"));
        appConfig.set(optionId_autoStartOnLogon, $(optionId_autoStartOnLogon).is(":checked"));
        appConfig.set(optionId_startMinimized, $(optionId_startMinimized).is(":checked"));
        appConfig.set(optionId_enableTrayIcon, $(optionId_enableTrayIcon).is(":checked"));

        appConfig.saveSettingsToDisk();
        appConfig.applySettings();
    },

    closeWindow() {
        appSettingsView.window.close();
    }
};

$(document).ready(() => {

    SettingsView.loadSettings();

});