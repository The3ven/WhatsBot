const { MessageMedia } = require("whatsapp-web.js");

const execute = async (client, msg, args, isMe) => {
  let msgMode = msg.to;
  if (!isMe) {
    msgMode = msg.from;
  }
  msg.delete(true);
  let count = Number(args.shift());
  let delay = Number(args.shift());
  if (isNaN(count)) {
    await client.sendMessage(msgMode, `🙇‍♂️ *Error*\n\n` + "```Invalid count```");
    return 0;
  }
  if (isNaN(count)) {
    await client.sendMessage(msgMode, `🙇‍♂️ *Error*\n\n` + "```Invalid delay```");
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
  if (delay > 0) delay = parseInt(delay);
  else {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n\n` + "```Delay can't be zero.```"
    );
    return 0;
  }

  if (msg.hasQuotedMsg) {
    let quotedMsg = await msg.getQuotedMessage();
    if (quotedMsg.hasMedia) {
      let media = await quotedMsg.downloadMedia();
      let sticker = false;
      if (quotedMsg.type == "sticker") sticker = true;

      // for (let i = 0; i < count; i++)
      await sendwithdelayMedia(client, delay, count, msgMode, media, sticker);
      // await client.sendMessage(
      //     msgMode,

      // );
    } else {
      // for (let i = 0; i < count; i++)
      await sendwithdelay(client, delay, count, msgMode, quotedMsg.body);
      // await client.sendMessage(msgMode, quotedMsg.body);
    }
  } else {
    if (args.length) {
      let text = args.join(" ");
      // for (let i = 0; i < count; i++) await client.sendMessage(msgMode, text);
      await sendwithdelay(client, delay, count, msgMode, text);
    } else {
      await client.sendMessage(
        msgMode,
        "```No text found for spamming!!! Please read !help spam.```"
      );
    }
  }
};

// const sendwithdelay = async (client, d, count, to, data) => {
//     for (let c = 1; c <= count; c++) {
//         console.log(`Count : ${c}`);
//         setTimeout(async () => {
//             await client.sendMessage(to, data);
//             if (c + 1 == count) {
//                 await client.sendMessage(to, `*Spam End!*`);
//             }
//         }, d * c);
//     }
// }

const sendwithdelay = async (client, d, count, to, data) => {
  const sendMessageWithDelay = (delay) =>
    new Promise((resolve) => {
      setTimeout(async () => {
        await client.sendMessage(to, data);
        // console.log("delay : ",delay);
        // console.timeEnd(timetaken);
        resolve();
      }, delay);
    });
  await client.sendMessage(to, data);
  // var timetaken = "Time taken by sendwithdelay function";
  for (let c = 1; c < count; c++) {
    // console.log(`Count: ${c}`);
    // console.time(timetaken);
    await sendMessageWithDelay(d);
    if (c === count - 1) {
      await client.sendMessage(to, "*Spam End!*");
      break;
    }
  }
};

const sendwithdelayMedia = async (client, d, count, to, media, sticker) => {
  const sendMediaWithDelay = (delay) =>
    new Promise((resolve) => {
      setTimeout(async () => {
        await client.sendMessage(
          to,
          new MessageMedia(media.mimetype, media.data, media.filename),
          { sendMediaAsSticker: sticker }
        );
        resolve();
      }, delay);
    });
  await client.sendMessage(
    to,
    new MessageMedia(media.mimetype, media.data, media.filename),
    { sendMediaAsSticker: sticker }
  );
  for (let c = 1; c < count; c++) {
    await sendMediaWithDelay(d);
    if (c === count - 1) {
      await client.sendMessage(to, `*Spam End!*`);
      break;
    }
  }
};

module.exports = {
  name: "Dspam",
  description:
    "spams a certain message with provided for given number of times",
  command: "!dspam",
  commandType: "plugin",
  isDependent: false,
  help: `*Dspam*\n\nSpam Messages with delay. \n\n*!dspam [count delay text]*\nOR\nreply *!spam [count delay]* to any message`,
  execute,
};
