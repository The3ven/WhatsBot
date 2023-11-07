//jshint esversion:11
const { Client, LocalAuth, ChatTypes } = require("whatsapp-web.js");
const pmpermit = require("./helpers/pmpermit");
const config = require("./config");
if (config.server_mode == "true") {
  var express = require("express");
  var app = express();
}
const fs = require("fs");
const logger = require("./logger");
const { afkHandler } = require("./helpers/afkWrapper");

const client = new Client({
  puppeteer: { headless: true, args: ["--no-sandbox"] },
  authStrategy: new LocalAuth({ clientId: "whatsbot" }),
});

client.commands = new Map();

fs.readdir("./commands", (err, files) => {
  if (err) return console.error(e);
  files.forEach((commandFile) => {
    if (commandFile.endsWith(".js")) {
      let commandName = commandFile.replace(".js", "");
      const command = require(`./commands/${commandName}`);
      client.commands.set(commandName, command);
    }
  });
});

client.initialize();

client.on("auth_failure", () => {
  console.error(
    "There is a problem in authentication, Kindly set the env var again and restart the app"
  );
});

client.on("ready", async () => {
  console.log("Bot has been started");
  try {
    await logger(client, "Bot has been started");
  } catch (err) {
    console.log(err);
  }
});

client.on("message", async (msg) => {
  if (!msg.author && config.pmpermit_enabled === "true") {
    // Pm check for pmpermit module
    var checkIfAllowed = await pmpermit.handler(msg.from.split("@")[0]); // get status
    if (!checkIfAllowed.permit) {
      // if not permitted
      if (checkIfAllowed.block) {
        await msg.reply(checkIfAllowed.msg);
        setTimeout(async () => {
          await (await msg.getContact()).block();
        }, 3000);
      } else if (!checkIfAllowed.block) {
        msg.reply(checkIfAllowed.msg);
      }
    } else {
      await checkAndApplyAfkMode();
    }
  }

  if (!msg.author && config.pmpermit_enabled !== "true") {
    await checkAndApplyAfkMode();
  }

  async function checkAndApplyAfkMode() {
    const contact = await msg.getContact();
    const afkData = await afkHandler(contact?.name || contact?.pushname);
    if (afkData?.notify) {
      //if user is afk
      const { reason, timediff } = afkData;
      let lastseen = "";
      lastseen += timediff[0] ? `${timediff[0]} days ` : "";
      lastseen += timediff[1] ? `${timediff[1]} hrs ` : "";
      lastseen += timediff[2] ? `${timediff[2]} min ` : "";
      lastseen += `${timediff[3]} sec ago`;
      await msg.reply(
        `${afkData.msg}\n\n😊😊😊\n\nI am currently offline...\n\n*Reason*: ${reason}\n*Last Seen*:${lastseen}`
      );
    }
  }
});

client.on("message_create", async (msg) => {
  // auto pmpermit
  var otherChat = await (await msg.getChat()).getContact();
  try {
    if (config.pmpermit_enabled == "true") {
      if (
        msg.fromMe &&
        msg.type !== "notification_template" &&
        otherChat.isUser &&
        !(await pmpermit.isPermitted(otherChat.number)) &&
        !otherChat.isMe &&
        !msg.body.startsWith("!") &&
        !msg.body.endsWith("_Powered by WhatsBot_")
      ) {
        await pmpermit.permit(otherChat.number);
        await msg.reply(
          `You are automatically permitted for message !\n\n_Powered by WhatsBot_`
        );
      }
    }
  } catch (ignore) {}
  console.log("msg.body : ", JSON.stringify(msg));
  if (msg.fromMe && msg.body.startsWith("!")) {
    let args = msg.body.slice(1).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    // console.log({ command, args });
    // console.log(`msg.to : ${msg.to}`);
    // console.log(`msg.from : ${msg.from}`);
    if (client.commands.has(command)) {
      try {
        await client.commands.get(command).execute(client, msg, args, true);
      } catch (error) {
        console.log(error);
      }
    } else {
      await client.sendMessage(
        msg.to,
        "No such command found. Type !help to get the list of available commands"
      );
    }
  } else if (msg.body.startsWith("!")) {
    // console.log(`msg.to : ${msg.to}`);
    // console.log(`msg.from : ${msg.from}`);
    let args = msg.body.slice(1).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    // console.log(`otherChat.number : ${JSON.stringify(otherChat)}`);
    // console.log(`otherChat.number : ${JSON.stringify(await msg.getContact())}`);
    // console.log(`otherChat.number : ${JSON.stringify(await msg.isGroup)}`);
    // console.log(`pmpermit.isPermitted : ${await pmpermit.isPermitted((await msg.getContact()).number)}`);
    if (!(await pmpermit.isPermitted((await msg.getContact()).number))) {
      await client.sendMessage(
        msg.from,
        "You are Not permitted to use me!\nplease request my owner to permit you first"
      );
      return;
    }
    // console.log(`otherChat : ${otherChat}`);
    if (!(await msg.getContact()).isMyContact) {
      await client.sendMessage(
        msg.from,
        "You are not in Contact list, try back later"
      );
      return;
    }
    // console.log({ command, args });
    if (client.commands.has(command)) {
      if (client.commands.get(command).commandType === "admin") {
        await client.sendMessage(msg.from, "You Can`t Use Admin Commands");
        return;
      }
      try {
        await client.commands.get(command).execute(client, msg, args, false);
      } catch (error) {
        console.log(error);
      }
    } else {
      await client.sendMessage(
        msg.from,
        "No such command found. Type !help to get the list of available commands"
      );
    }
  }
});

client.on("message_revoke_everyone", async (after, before) => {
  if (before) {
    if (
      before.fromMe !== true &&
      before.hasMedia !== true &&
      before.author == undefined &&
      config.enable_delete_alert == "true"
    ) {
      client.sendMessage(
        before.from,
        "_You deleted this message_ 👇👇\n\n" + before.body
      );
    }
  }
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

if (config.server_mode == "true") {
  app.get("/", (req, res) => {
    res.send(
      '<h1>This server is powered by Whatsbot<br><a href="https://github.com/tuhinpal/WhatsBot">https://github.com/tuhinpal/WhatsBot</a></h1>'
    );
  });

  app.use(
    "/public",
    express.static("public"),
    require("serve-index")("public", { icons: true })
  ); // public directory will be publicly available

  app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening at Port: ${process.env.PORT || 8080}`);
  });
}
