$(document).ready(() => {
    $("#appversion").html(require('electron').remote.app.getVersion());
    $("#nodeversion").html(process.versions.node);
    $("#electronversion").html(process.versions.electron);
    $("#chromeversion").html(process.versions.chrome);
});