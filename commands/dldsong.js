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
      // Send song info to chat
      let song_path = path.join(
        __dirname,
        "../public",
        `${getdata.content.songdata[1]}.mp4`
      );
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
      } catch (e) {
        // Send error to chat
        await client.sendMessage(
          msgMode,
          `🙇‍♂️ *Error*\n\n` +
            "```We are not able to send song info```\n" +
            `${e}`
        );
        console.log(`e ${e}`);
      }
      try {
        // Download song from song info Json response
        let split_url = getdata.content.songdata[0].split("/");
        let url = "/" + split_url.pop();
        let baseUrl = "https://aac.saavncdn.com/" + split_url.pop();
        console.log(url);
        console.log(baseUrl);
        const downloader = axios.create({
          baseURL: baseUrl,
          timeout: 20000,
          responseType: "stream",
        });
        const response = await downloader.get(url, {
          onDownloadProgress: (progressEvent) => {
            const total = parseFloat(progressEvent.total);
            const current = progressEvent.loaded;
            const percentCompleted = Math.floor((current / total) * 100);
            console.log("Download progress:", percentCompleted);
            // Send progress update to the chat
            // await client.sendMessage(
            //   msgMode,
            //   `Download progress: ${percentCompleted}%`
            // );
          },
        });
        const writer = fs.createWriteStream(song_path);
        await new Promise((resolve, reject) => {
          response.data
            .on("end", resolve)
            .on("error", (error) => {
              console.error("Error during download:", error);
              reject(error);
            })
            .pipe(writer);
        });
        console.log("Download Done");
        await client.sendMessage(msgMode, MessageMedia.fromFilePath(song_path));
      } catch (e) {
        await client.sendMessage(
          msgMode,
          `🙇‍♂️ *Error*\n\n` +
            "```We are not able to download mp3 song```\n" +
            `${e}`
        );
        console.log(`e ${e}`);
      }
      Exist(song_path)
        ? fs.unlinkSync(song_path)
        : console.log("song dosen`t  exist");
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

// async function dldsong(data) {
//   // console.log(JSON.stringify(data));
//   let song_path = path.join(__dirname, "../public", `${data[1]}.mp4`);
//   if (!Exist(song_path)) {
//     let split_url = data[0].split("/");
//     let url = "/" + split_url.pop();
//     console.log(url);
//     let baseUrl = "https://aac.saavncdn.com/" + split_url.pop();
//     console.log(baseUrl);
//     try {
//       const client = axios.create({
//         baseURL: baseUrl,
//         timeout: 20000,
//         responseType: "stream",
//       });

//       let result = await client
//         .get(url, {
//           onDownloadProgress: async (progressEvent) => {
//             // console.log(progressEvent);
//             const total = parseFloat(progressEvent.total);
//             const current = progressEvent.loaded;
//             let percentCompleted = Math.floor((current / total) * 100);
//             console.log("completed: ", percentCompleted);
//           },
//         })
//         .then((res) => {
//           return res.data;
//         });
//       new Promise(async (resolve, reject) => {
//         const writer = fs.createWriteStream(song_path);
//         await result.pipe(writer);
//         writer.on("finish", resolve);
//         writer.on("error", reject);
//       });
//       // Exist(song_path) ? (return song_path) : (return null)
//     } catch (e) {
//       console.log(`e ${e}`);
//       return null;
//     }
//   } else {
//     return song_path;
//   }
// }

module.exports = {
  name: "Download Song",
  description: "Download selected song from the list",
  command: "!dldsong",
  commandType: "plugin",
  isDependent: true,
  help: "use !help song to learn about this command",
  execute,
};
