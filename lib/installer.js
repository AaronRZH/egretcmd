const utils = require("./utils");
const path = require("path");
const fs = require("fs");

exports.installEngine = function (version, engineRoot) {
  if (!fs.existsSync(engineRoot)) {
    console.log("找不到引擎目录");
    process.exit(1);
  }
  let pkg = path.join(engineRoot, "package.json");
  if (fs.existsSync(pkg)) {
    let content = fs.readFileSync(pkg, "utf8");
    let json;
    try {
      json = JSON.parse(content);
    } catch (e) {}
    if (json.version !== version) {
      console.log("引擎版本不匹配");
      process.exit(1);
    }
  }
  let root = utils.getAppDataPath();
  let engineConfigPath = path.join(root, "engine.json");
  let engineConfig;
  if (!fs.existsSync(engineConfigPath)) {
    engineConfig = {};
  }
  engineConfig[version] = {
    version,
    root: engineRoot,
  };
  fs.writeFileSync(engineConfigPath, JSON.stringify(engineConfig, null, 4));
};
