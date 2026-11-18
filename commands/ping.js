//jshint esversion:6

const { Ping_wrapper } = require("../helpers/pingWrapper");

const execute = async (client, msg, args, isMe) => {
  let msgMode = msg.to;
  if (!isMe) {
    msgMode = msg.from;
  }
  msg.delete(true);
  let resp = await Ping_wrapper();
  if (resp === "Undefined") {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n Seems like somthing wrong when checking ping ${e}`
    );
  }
  await client.sendMessage(
    msgMode,
    `pong ~ ${resp}`
  );
};

module.exports = {
  name: "Ping",
  description: "responds with pong",
  command: "!ping",
  commandType: "info",
  isDependent: false,
  help: undefined,
  execute,
};
