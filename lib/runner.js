const fs = require("fs");
const path = require("path");
const utils = require("./utils");
const launcherapi = require("./launcherapi");
const installer = require("./installer");


const supportCommands = [
    "install",
    "list",
    "build",
    "publish",
    "clean",
    "make",
    "info",
    "startserver",
    "help",
];

exports.runCommand = function (projectRoot) {
    let command = process.argv[2];
    if (!supportCommands.includes(command)) {
        console.log("仅支持 " + supportCommands.join(",") + " 命令");
        process.exit(1);
    }
    if (command === "list") {
        const data = launcherapi.getAllEngineVersions();
        for (let version in data) {
            console.log("Egret Engine " + version, data[version].root);
        }
        process.exit(0);
    }
    if (command === "install") {
        const engineVersion = process.argv[3];
        const engineRoot = process.argv[4];
        if (!engineVersion || !engineRoot) {
            console.log("请输入引擎版本和引擎路径");
            process.exit(1);
        }
        installer.installEngine(engineVersion, engineRoot);
        process.exit(0);
    }
    let pkgFilePath = path.join(projectRoot, "egretProperties.json");
    if (!fs.existsSync(pkgFilePath)) {
        console.log("项目根目录下未找到 egretProperties.json 文件");
        process.exit(1);
    }
    let propertiesStr = fs.readFileSync(pkgFilePath, "utf8");
    let json;
    try {
        json = JSON.parse(propertiesStr);
    } catch (e) {
        console.log("解析 egretProperties.json 出错");
        process.exit(1);
    }
    let compileVersion = json.compilerVersion;
    const engines = launcherapi.getAllEngineVersions();
    const targetEngine = engines[compileVersion];
    if (!targetEngine) {
        console.log("请先安装【" + compileVersion + "】引擎");
        process.exit(1);
    }
    const targetPath = targetEngine.root;
    if (!fs.existsSync(targetPath)) {
        console.log("引擎路径不存在");
        process.exit(1);
    }
    process.env.EGRET_PATH = targetPath;
    require(targetPath + "/tools/Entry.js").executeCommandLine(
        process.argv.slice(2)
    );
};
