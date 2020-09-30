const { makeWaves, onResize, windowClose, windowMaximize, windowMinimize, windowDevTools, saveFile, openFile, fontChange, onScroll, scheduleAutoSave, updateSettings, saveSettings, getSettings, autoSaveChange } = require("./js/functions");
const fs = require("fs");

// declare variables
let lastPath = "",
    editor, settingsDialog,
    autoSaveTimeout,
    settings;

init();

// init
function init() {
    settingsDialog = M.Modal.init(document.getElementById("settingsDialog"));

    editor = new Quill("#editor", {
        theme: "snow",
        modules: {
            toolbar: {
                container: "#toolbar"
            }
        }
    });

    makeWaves();
    window.onresize = onResize;
    window.onscroll = onScroll;
    onResize();
    updateSettings();

    document.getElementById("editor").oninput = scheduleAutoSave;
}