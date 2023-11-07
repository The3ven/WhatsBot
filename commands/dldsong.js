//jshint esversion:8
const { MessageMedia } = require("whatsapp-web.js");
const { download } = require("../helpers/song");

const execute = async (client, msg, args, isMe) => {
  let msgMode = msgMode;
  if (!isMe) {
    msgMode = msg.from;
  }
  if (msg.hasQuotedMsg) {
    msg.delete(true);
    let quotedMsg = await msg.getQuotedMessage();
    let getdata = await download(args[0], quotedMsg.id.id);
    if (getdata.status) {
      try {
        await client.sendMessage(
          msgMode,
          new MessageMedia(
            getdata.content.image.mimetype,
            getdata.content.image.data,
            getdata.content.image.filename
          ),
          { caption: getdata.content.text }
        );
        try {
          await client.sendMessage(
            msgMode,
            new MessageMedia.fromUrl(getdata.content.url)
          );
        } catch {
          await client.sendMessage(
            msgMode,
            `🙇‍♂️ *Error*\n\n` + "```We are not able to send song mp3```"
          );
        }
      } catch {
        await client.sendMessage(
          msgMode,
          `🙇‍♂️ *Error*\n\n` + "```We are not able to send song info```"
        );
      }
    } else {
      await client.sendMessage(msgMode, getdata.content);
    }
  } else {
    await client.sendMessage(
      msgMode,
      "```Search for the song with !song and then reply to the query result with this command```"
    );
  }
};

module.exports = {
  name: "Download Song",
  description: "Download selected song from the list",
  command: "!dldsong",
  commandType: "plugin",
  isDependent: true,
  help: "use !help song to learn about this command",
  execute,
};
