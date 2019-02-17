$(document).ready(() => {
    $("#app_version_header").html(require('electron').remote.app.getVersion());
    $("#app_version").html(require('electron').remote.app.getVersion());
    $("#node_version").html(process.versions.node);
    $("#electron_version").html(process.versions.electron);
    $("#chromium_version").html(process.versions.chrome);
});