//jshint esversion:8
const { MessageMedia } = require("whatsapp-web.js");
const { download } = require("../helpers/song");
const path = require("path");
const { Exist } = require("../helpers/Files");
const axios = require("axios");
const fs = require("fs");

const execute = async (client, msg, args, isMe) => {
  let msgMode = msg.to;
  if (!isMe) {
    msgMode = msg.from;
  }
  if (msg.hasQuotedMsg) {
    msg.delete(true);
    let quotedMsg = await msg.getQuotedMessage();
    let quotedMsgid = quotedMsg.id.id;
    // console.log("quotedMsg : ", JSON.stringify(quotedMsg));
    // console.log("quotedMsgid : ", JSON.stringify(quotedMsgid));

    let getdata = await download(args[0], quotedMsgid);
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
        if (getdata.content.songPath !== null) {
          try {
            const song_path = await dldsong(getdata.content.songdata);
            // const song_path = `D:\\Working Projects\\WhatsBot\\public\\Kun Faaya Kun.mp4`
            // console.log("song_path : ", typeof song_path);
            if (song_path !== null) {
              // try {
              await client.sendMessage(
                msgMode,
                MessageMedia.fromFilePath(song_path)
              );
              Exist(song_path)
                ? fs.unlinkSync(song_path)
                : console.log("Dosent song exist");
              // console.log(
              //   "Download url  :",
              //   JSON.stringify(getdata.content.songdata)
              // );
              // } catch (e) {
              //   await client.sendMessage(
              //     msgMode,
              //     `🙇‍♂️ *Error*\n\n` +
              //       "```We are not able to send mp3 song```" +
              //       `\n\n${e}`
              //   );
              // }
            }
          } catch (err) {
            console.log(err);
          }
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

async function dldsong(data) {
  // console.log(JSON.stringify(data));
  let song_path = path.join(__dirname, "../public", `${data[1]}.mp4`);
  // console.log("Song NAme : ", song_path);
  if (!Exist(song_path)) {
    try {
      const response = await axios({
        method: "get",
        url: data[0],
        responseType: "stream",
      });

      await new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(song_path);
        response.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
      // console.log("Download completed");
      return song_path;
    } catch (error) {
      // console.log(error);
      return null;
    }
  } else {
    return song_path;
  }
}

module.exports = {
  name: "Download Song",
  description: "Download selected song from the list",
  command: "!dldsong",
  commandType: "plugin",
  isDependent: true,
  help: "use !help song to learn about this command",
  execute,
};
