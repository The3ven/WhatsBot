const fs = require('fs');
const { PFP_DIR } = require("../config");

function watchDirectory(directory, callback) {
    fs.watch(directory, (eventType, filename) => {
        if (eventType === 'rename') {
            // Check if the file still exists after the rename event
            fs.access(`${directory}/${filename}`, fs.constants.F_OK, (err) => {
                if (!err) {
                    callback({ filename, exists: true });
                } else {
                    callback({ filename, exists: false });
                }
            });
        }
    });
}

watchDirectory(PFP_DIR, (result) => {
    process.stdout.write(JSON.stringify(result) + '\n');
});
