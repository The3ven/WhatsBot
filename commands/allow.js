//jshint esversion:8
const config = require("../config");
const pmpermit = require("../helpers/pmpermit");

const execute = async (client, msg, isMe) => {
  let msgMode = msg.to;
  if (!isMe) {
    msgMode = msg.from;
  }
  if (config.pmpermit_enabled == "true" && !msgMode.includes("-")) {
    await pmpermit.permit(msgMode.split("@")[0]);
    msg.reply(
      "*✅ Allowed*\n\nYou are allowed for PM\n\n _Powered by WhatsBot_"
    );
  }
};

module.exports = {
  name: "Allow for PM",
  description: "Allow personal messaging for a conatct",
  command: "!allow",
  commandType: "admin",
  isDependent: false,
  help: `_You can allow him for pm by these commands_ 👇\n*!allow* - Allow an user for PM\n*!nopm* - Disallow an allowed user for PM`, // a string descring how to use this command Ex = help : 'To use this command type !test arguments'
  execute,
};
