const { makeWaves, onResize, windowClose, windowMaximize, windowMinimize, windowDevTools, saveFile, openFile, fontChange, onScroll } = require("./js/functions.js");

// declare variables
let lastPath = "",
    editor, settings;

init();

// init
function init() {
    settings = M.Modal.init(document.getElementById("settings"));

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
    fontChange();
}