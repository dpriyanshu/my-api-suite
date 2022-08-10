const util = require("util");
const exec = util.promisify(require("child_process").exec);
var globalEnv = "";
var Utils = {
  globalEnvFile: "tests/global/postman_globals.json",
  globalCmd: function () {
    console.log("global");
  },
  getRunCmdWithDataFile: function (
    collectionPath,
    dataFilePath,
    envFilePath,
    requestFolder,
    isHTMLReport
  ) {
    if (isHTMLReport) {
      return `newman run ${collectionPath} -e ${envFilePath} -g ${this.globalEnvFile}  -d ${dataFilePath} --folder ${requestFolder} -r htmlextra --env-var env=${globalEnv}`;
    } else {
      return `newman run ${collectionPath} -e ${envFilePath} -g ${this.globalEnvFile}  -d ${dataFilePath} --folder ${requestFolder} --env-var env=${globalEnv}`;
    }
  },
  getRunCmdWithoutDataFile: function (
    collectionPath,
    envFilePath,
    requestFolder,
    isHTMLReport
  ) {
    if (isHTMLReport) {
      console.log(
        `newman run ${collectionPath} -e ${envFilePath} -g ${this.globalEnvFile}  --folder ${requestFolder} -r htmlextra --env-var env=${globalEnv}`
      );
      return `newman run ${collectionPath} -e ${envFilePath} -g ${this.globalEnvFile}  --folder ${requestFolder} -r htmlextra --env-var env=${globalEnv}`;
    } else {
      return `newman run ${collectionPath} -e ${envFilePath} -g ${this.globalEnvFile}  --folder ${requestFolder} --env-var env=${globalEnv}`;
    }
  },

  executeCmd: async function (cmd) {
    try {
      const { stdout, stderr } = await exec(cmd);
      if (stderr) {
        console.log("stderr:", stderr);
      }
      console.log("stdout:", stdout);
    } catch (e) {
      if (e.stderr != "") {
        console.log(e.stderr);
      } else {
        console.log(e.stdout);
      }
    }
  },
  setEnv: async function (env) {
    globalEnv = env;
  },
  getEnv: async function () {
    return globalEnv.toString();
  },
};

module.exports = Utils;
