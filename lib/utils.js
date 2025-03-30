const os = require("os");

exports.getAppDataPath = function () {
  switch (process.platform) {
    case "darwin":
      let home =
        process.env.HOME ||
        "/Users/" + (process.env.NAME || process.env.LOGNAME);
      return home + "/Library/Application Support/Egret";
    case "win32":
      return (
        process.env.AppData + "/Egret" ||
        process.env.USERPROFILE + "/AppData/Roaming/Egret"
      );
    case "linux":
      return os.homedir() + "/" + ".egret";
    default:
      throw new Error();
  }
};
