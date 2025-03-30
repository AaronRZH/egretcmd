const fs = require("fs");
const path = require("path");
const utils = require("./utils");

exports.getAllEngineVersions = function () {
  let root = utils.getAppDataPath();
  let configPath = path.join(root, "engine.json");
  if (fs.existsSync(configPath)) {
    let configStr = fs.readFileSync(configPath, "utf8");
    try {
      let config = JSON.parse(configStr);
      return config;
    } catch (e) {}
  }
  let engineRoot = path.join(root, "engine");
  if (!fs.existsSync(engineRoot)) {
    fs.mkdirSync(engineRoot, { recursive: true });
  }
  let dirs = fs.readdirSync(engineRoot);
  let result = {};
  for (let i = 0, len = dirs.length; i < len; i++) {
    let version = dirs[i];
    let pkg = path.join(engineRoot, version, "package.json");
    if (fs.existsSync(pkg)) {
      let content = fs.readFileSync(pkg, "utf8");
      let json;
      try {
        json = JSON.parse(content);
      } catch (e) {
        continue;
      }
      if (json.version === version) {
        result[version] = {
          version: version,
          root: path.join(engineRoot, version).split("\\").join("/"),
        };
      }
    }
  }
  return result;
};
