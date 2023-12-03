//jshint esversion:8
const { MessageMedia } = require("whatsapp-web.js");
const { spawn } = require("child_process");
const { dir_files } = require("../helpers/dir_lister");
const { checkArray } = require("../helpers/array_checker");
const fs = require("fs");
const path = require("path");
const config = require("../config");

const execute = async (client, msg, args, isMe) => {
  let msgMode = msg.to;
  if (!isMe) {
    msgMode = msg.from;
  }
  msg.delete(true);
  let link = "";
  let download_dir = path.join(__dirname, "../bin");
  let current_files = dir_files(download_dir);
  let song_name = "";
  if (msg.hasQuotedMsg) {
    let quotedMsg = await msg.getQuotedMessage();
    link = quotedMsg.body;
  } else {
    link = args;
  }

  current_files.forEach((file) => {
    // console.log(file);
    // console.log(typeof(file));
    if (file.indexOf(".mp3") !== -1 || file.indexOf(".webm") !== -1) {
      fs.unlinkSync(path.join(download_dir, file));
      // console.log(file, " ✔ Deleted!");
    }
  });

  current_files = dir_files(download_dir);

  if (link.length > 0) {
    let tmp_link = "";
    link = link.toString();
    var rx =
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    tmp_link = link.match(rx);
    link = "http://www.youtube.com/watch?v=" + tmp_link[1];
    process.env.YTDL_LINK = link;
    let downloader_script = "";
    if (config.HOST_ENV === "win32") {
      downloader_script = spawn("cmd.exe", ["/c", "cd bin && ytm.bat"]);
    }
    if (config.HOST_ENV === "linux") {
      downloader_script = spawn("bin/ytm.sh");
    }
    downloader_script.stdout.on("data", async (data) => {
      await client.sendMessage(msgMode, "*YTDL~:* ```" + data + "```");
    });

    downloader_script.stderr.on("data", async (data) => {
      await client.sendMessage(msgMode, "*YTDL~:* ```" + data + "```");
    });

    downloader_script.on("exit", async (code, signal) => {
      if (code) {
        await client.sendMessage(
          msgMode,
          "*YTDL~:* ```" + `Child exited with code ${code}` + "```"
        );
      }
      if (signal) {
        await client.sendMessage(
          msgMode,
          "*YTDL~:* ```" + `Child exited with Signal ${signal}` + "```"
        );
      }
      await client.sendMessage(msgMode, "*YTDL~:* ```DOWNLOAD DONE ✅```");
      try {
        let new_files = dir_files(download_dir);
        song_name = checkArray(current_files, new_files).toString();
        let tmp_song_name;
        if (song_name.indexOf("[") != -1) {
          tmp_song_name = song_name.substring(0, song_name.indexOf("[") - 1);
          tmp_song_name += ".mp3";
        }
        await client.sendMessage(
          msgMode,
          "*YTDL~:* ```Sending " +
            tmp_song_name +
            "```\n\nDownloaded By : *FIRE7LY_BOT*"
        );
      } catch (err) {
        await client.sendMessage(
          msgMode,
          `🙇‍♂️ *Error*\n\n` +
            "```Something Unexpected Happened while fetching the YouTube video```"
        );
      }
      try {
        let song_path = path.join(download_dir, "/", song_name);
        await client.sendMessage(msgMode, MessageMedia.fromFilePath(song_path));
        fs.unlinkSync(song_path);
      } catch (err) {
        await client.sendMessage(
          msgMode,
          `🙇‍♂️ *Error*\n\n` +
            "```Something Unexpected Happened while sending the song```"
        );
      }
    });
  } else {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\nYou must provide at least one URL.\n` +
        "```*!ytm [Youtube-Link]*\nor,\nReply a youtube link with *!ytm*```"
    );
  }
};

module.exports = {
  name: "YTM",
  description: "Download mp3 from a Youtube Link using yt-dlp",
  command: "!ytm",
  commandType: "plugin",
  isDependent: false,
  help: `*Youtube Music*\n\nDownload mp3 from a Youtube Link with this command.\n\n*!ytm [Youtube-Link]*\nor,\nReply a youtube link with *!ytm*`,
  execute,
};
