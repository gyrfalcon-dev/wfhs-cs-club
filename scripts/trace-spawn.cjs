const childProcess = require("child_process");

const { spawn, spawnSync, exec, execFile } = childProcess;

const wrap = (original, name) => (...args) => {
  try {
    const cp = original.apply(childProcess, args);
    if (cp && typeof cp.on === "function") {
      cp.on("error", (error) => {
        console.error(`${name} CHILD ERROR`, args, error);
      });
    }
    return cp;
  } catch (error) {
    console.error(`${name} ERROR`, args, error);
    throw error;
  }
};

childProcess.spawn = wrap(spawn, "spawn");
childProcess.spawnSync = wrap(spawnSync, "spawnSync");
childProcess.exec = wrap(exec, "exec");
childProcess.execFile = wrap(execFile, "execFile");
