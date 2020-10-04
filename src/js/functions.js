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

module.exports.saveFile = async customPath => {
    try {
        if (customPath) {
            var files = {
                filePath: customPath
            };
        } else {
            var files = await dialog.showSaveDialog({
                filters: [
                    { name: "JSON", extensions: ["json"] }
                ]
            });
        }
        lastPath = files.filePath;
        updateFileName(files.filePath.split("/")[files.filePath.split("/").length - 1]);
        if (files.filePath) {
            fs.writeFileSync(files.filePath, JSON.stringify(editor.getContents()));
            toast({ html: "File saved" });
        } else {
            toast({ html: "No file selected" });
        }
    } catch (e) {
        toast({ html: "An error occured" });
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
                updateFileName(files.filePaths[0].split("/")[files.filePaths[0].split("/").length - 1]);
            } catch (e) {
                toast({ html: "Selected file is corrupted" });
            }
        } else {
            toast({ html: "No file selected" });
        }
    } catch (e) {
        toast({ html: "An error occured" });
        console.error(e);
    }
};

module.exports.fontChange = () => {
    settings = getSettings();
    settings.fontSize = document.getElementById("font-slider").value / 4;
    saveSettings(settings);
};

module.exports.onScroll = () => {
    if (document.body.scrollTop > 1 || document.documentElement.scrollTop > 1) {
        document.getElementById("fixed").classList.add("scrolled");
    } else {
        document.getElementById("fixed").classList.remove("scrolled");
    }
};

module.exports.scheduleAutoSave = () => {
    if (lastPath) {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => saveFile(lastPath), 3000);
    }
};

module.exports.updateSettings = () => {
    settings = getSettings();
    document.querySelector("label[for=font-slider]").textContent = `Font size - ${settings.fontSize}`;
    document.getElementById("fontsize").innerHTML = `
    .ql-editor {
        font-size: ${settings.fontSize}rem;
    }`;
    document.getElementById("font-slider").value = settings.fontSize * 4;

    document.getElementById("autosave-slider").value = settings.autoSaveFrequency / 1000;
    document.querySelector("label[for=autosave-slider]").textContent = `AutoSave Frequency - ${settings.autoSaveFrequency / 1000}s`;
    console.log(settings);
};

module.exports.getSettings = () => {
    return JSON.parse(fs.readFileSync(__dirname + "/../settings.json", "utf8"));
};

module.exports.saveSettings = s => {
    fs.writeFileSync(__dirname + "/../settings.json", JSON.stringify(s));
    updateSettings();
};

module.exports.autoSaveChange = () =>  {
    settings = getSettings();
    settings.autoSaveFrequency = document.getElementById("autosave-slider").value * 1000;
    saveSettings(settings);
};

module.exports.toast = (props) => {
    return new M.Toast({ html: props.html, displayLength: 750 });
};

module.exports.updateFileName = name => {
    document.getElementById("fileName").textContent = name;
};