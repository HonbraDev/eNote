const { settings } = require("cluster");

const remote = require("electron").remote,
    { dialog } = remote,
    currentWindow = remote.getCurrentWindow(),
    fs = require("fs");

module.exports.makeWaves = () => {
    document.querySelectorAll(".ql-formats, .ql-picker-options").forEach(elem => {
        elem.querySelectorAll("button, .ql-picker-item").forEach(elem => {
            elem.classList.add("waves-effect");
        });
    });
};

module.exports.onResize = () => {
    document.getElementById("editor").style.marginTop = document.getElementById("top-controls").offsetHeight + document.querySelector(".ql-toolbar").offsetHeight + 10 + "px";
    document.getElementById("toolbar").style.top = document.getElementById("top-controls").offsetHeight + "px";
};

module.exports.windowClose = () => {
    currentWindow.close();
};

module.exports.windowMaximize = () =>  {
    if (process.platform === "darwin") {
        currentWindow.isFullScreen() ?
            currentWindow.setFullScreen(false) :
            currentWindow.setFullScreen(true)
    } else {
        currentWindow.isMaximized() ?
            currentWindow.unmaximize() :
            currentWindow.maximize();
    }
};

module.exports.windowMinimize = () => {
    currentWindow.minimize();
};

module.exports.windowDevTools = () => {
    currentWindow.webContents.openDevTools();
};

module.exports.saveFile = async() => {
    try {
        if (lastPath) {
            var files = {
                filePath: lastPath
            };
        } else {
            var files = await dialog.showSaveDialog({
                filters: [
                    { name: "JSON", extensions: ["json"] }
                ]
            });
            lastPath = files.filePath;
        }
        if (files.filePath) {
            fs.writeFileSync(files.filePath, JSON.stringify(editor.getContents()));
            new M.Toast({ html: "File saved" });
        } else {
            new M.Toast({ html: "No file selected" });
        }
    } catch (e) {
        new M.Toast({ html: "An error occured" });
        console.error(e);
    }
};

module.exports.openFile = async() => {
    try {
        var files = await dialog.showOpenDialog({
            filters: [
                { name: "JSON", extensions: ["json"] }
            ]
        });
        lastPath = files.filePaths[0];
        if (files.filePaths[0]) {
            var file = fs.readFileSync(files.filePaths[0], "utf8");
            try {
                editor.setContents(JSON.parse(file));
            } catch (e) {
                new M.Toast({ html: "Selected file is corrupted" });
            }
        } else {
            new M.Toast({ html: "No file selected" });
        }
    } catch (e) {
        new M.Toast({ html: "An error occured" });
        console.error(e);
    }
};

module.exports.fontChange = () => {
    document.querySelector("label[for=font-slider]").textContent = `Font size - ${document.getElementById("font-slider").value / 4}`;
    document.getElementById("fontsize").innerHTML = `
    .ql-editor {
        font-size: ${document.getElementById("font-slider").value / 4}rem;
    }`;
};

module.exports.onScroll = () => {
    if (document.body.scrollTop > 1 || document.documentElement.scrollTop > 1) {
        document.getElementById("fixed").classList.add("scrolled");
    } else {
        document.getElementById("fixed").classList.remove("scrolled");
    }
};