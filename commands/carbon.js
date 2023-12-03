//jshint esversion:8

//TODO: fix it
const { MessageMedia } = require("whatsapp-web.js");
const axios = require("axios");

async function carbon(text) {
  let link = `https://carbon.now.sh/embed/?code=${text.replace(
    / /gi,
    "+"
  )}&theme=3024-night&backgroundColor=rgba(36, 75, 115)`;
  // console.log("link : ", link);
  let respoimage = await axios
    .get(link, { responseType: "arraybuffer" })
    .catch(function (error) {
      return "error";
    });

  return {
    mimetype: "image/png",
    data: Buffer.from(respoimage.data).toString("base64"),
    filename: "carbon",
  };
}

const execute = async (client, msg, args, isMe) => {
  let msgMode = msg.to;
  if (!isMe) {
    msgMode = msg.from;
  }
  let data;

  msg.delete(true);
  if (msg.hasQuotedMsg) {
    let quotedMsg = await msg.getQuotedMessage();
    data = await carbon(quotedMsg.body);
    msg = quotedMsg;
  } else {
    data = await carbon(args.join(" "));
  }
  // console.log("data : ", data);
  if (data == "error") {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n\n` +
        "```Something Unexpected Happened to create the Carbon.```"
    );
  } else {
    await client.sendMessage(
      msgMode,
      new MessageMedia(data.mimetype, data.data, data.filename),
      {
        caption:
          `Carbon for 👇\n` + "```" + msg.body.replace("!carbon ", "") + "```",
      }
    );
  }
};

module.exports = {
  name: "Carbon",
  description: "Creates a carbon.now.sh image from text",
  command: "!carbon",
  commandType: "plugin",
  isDependent: false,
  help: `*Carbon*\n\nGenerate beautiful image with carbon.now.sh. Just send the text it will generate an image for you.\n\n*!carbon [Text]*\nor,\nReply a message with *!carbon* to Create`,
  execute,
};
