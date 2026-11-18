const { spawn } = require('child_process');
const { pfp_changer } = require("./pfp_changer");
const { PFP_DIR } = require("../config");
const path = require("path");


async function pfp_on_change_fun(client) {

    const fileMonitorProcess = spawn('node', ['./helpers/file_monitor.js']);
    // Spawn the file monitoring process as a child process

    // Listen for any output from the child process
    fileMonitorProcess.stdout.on('data', (data) => {
        const result = JSON.parse(data);
        if (result.exists) {
            pfp_changer(client, path.join(PFP_DIR, result.filename), client.info.wid._serialized);
        }
        console.log(`File ${result.filename} ${result.exists ? "created" : "deleted"}`);
    });

    fileMonitorProcess.stderr.on('data', async (data) => {
        await client.sendMessage(client.info.wid._serialized, `File monitor error: ${data}`);
        // console.error(`File monitor error: ${data}`);
    });

    // Handle process exit
    fileMonitorProcess.on('close', async (code) => {
        await client.sendMessage(client.info.wid._serialized, `File monitor process exited with code ${code}`);
        // console.log(`File monitor process exited with code ${code}`);
    });
};

module.exports = {
    pfp_on_change_fun,
}