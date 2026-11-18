const { MessageMedia } = require("whatsapp-web.js");

async function pfp_changer(client, path, msgMode) {
    try {
        await client.setProfilePicture(MessageMedia.fromFilePath(path))
            .then(
                await client.sendMessage(
                    msgMode,
                    "```Profile Picture Successfully Updated```"
                )
            )
    } catch (e) {
        await client.sendMessage(
            msgMode,
            `🙇‍♂️ *Error*\n\n` + "```Something unexpected while updating Profile Picture```"
        );
    }
}

module.exports = {
    pfp_changer,
}