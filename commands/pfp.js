
const fs = require("fs");
const { dir_files } = require("../helpers/dir_lister");
const { PFP_DIR } = require("../config");
const path = require("path");
const { pfp_changer } = require("../helpers/pfp_changer");


function shuffleArray(array) {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


const execute = async (client, msg, isMe) => {
    let msgMode = msg.to;
    if (!isMe) {
        msgMode = msg.from;
    }
    msg.delete(true);
    // console.log(PFP_DIR);
    if (!fs.existsSync(PFP_DIR)) {
        await client.sendMessage(
            msgMode,
            `🙇‍♂️ *Error*\n\n` + "```Please Check your Profile picture directory```"
        );
    }
    let pictures = dir_files(PFP_DIR);
    shuffleArray(pictures);
    pfp_path = path.join(PFP_DIR, pictures.pop());
    pfp_changer(client, pfp_path, msgMode);
}


module.exports = {
    name: "pfp", //name of the module
    description: "Change Profile picture", // short description of what this command does
    command: "!pfp", //command with prefix. Ex command: '!test'
    commandType: "admin", // admin|info|plugin
    isDependent: false, //whether this command is related/dependent to some other command
    help: "command can change profile picture of you whatsapp account ", // a string descring how to use this command Ex = help : 'To use this command type !test arguments'
    execute,
};