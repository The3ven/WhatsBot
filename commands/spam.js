//jshint esversion:8
const { MessageMedia } = require("whatsapp-web.js");

const execute = async (client, msg, args, isMe) => {
  let msgMode = msg.to;
  if (!isMe) {
    msgMode = msg.from;
  }
  msg.delete(true);

  let count = Number(args.shift());
  if (isNaN(count)) {
    await client.sendMessage(msgMode, `🙇‍♂️ *Error*\n\n` + "```Invalid count```");
    return 0;
  }
  if (count > 0) count = parseInt(count);
  else {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n\n` + "```Count can't be zero.```"
    );
    return 0;
  }

  if (msg.hasQuotedMsg) {
    let quotedMsg = await msg.getQuotedMessage();

    if (quotedMsg.hasMedia) {
      let media = await quotedMsg.downloadMedia();
      let sticker = false;
      if (quotedMsg.type == "sticker") sticker = true;

      for (let i = 0; i < count; i++)
        await client.sendMessage(
          msgMode,
          new MessageMedia(media.mimetype, media.data, media.filename),
          { sendMediaAsSticker: sticker }
        );
    } else {
      for (let i = 0; i < count; i++)
        await client.sendMessage(msgMode, quotedMsg.body);
    }
  } else {
    if (args.length) {
      let text = args.join(" ");
      for (let i = 0; i < count; i++) await client.sendMessage(msgMode, text);
    } else {
      await client.sendMessage(
        msgMode,
        "```No text found for spamming!!! Please read !help spam.```"
      );
    }
  }
};

module.exports = {
  name: "Spam",
  description: "spams a certain message for given number of times",
  command: "!spam",
  commandType: "plugin",
  isDependent: false,
  help: `*Spam*\n\nSpam Messages. \n\n*!spam [count text]*\nOR\nreply *!spam [count]* to any message`,
  execute,
};
