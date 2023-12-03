//jshint esversion:8
const execute = async (client, msg, args, isMe) => {
  let msgMode = msg.to;
  if (!isMe) {
    msgMode = msg.from;
  }
  // console.log(args);
  let Status_msg = args.join(" ");
  try {
    await client
      .setStatus(Status_msg + " ~: By WhatsBot")
      .then(
        await client.sendMessage(
          msgMode,
          "```Status Successfully Updated " + `_${Status_msg}_` + "```"
        )
      );
  } catch (e) {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n\n` + "```Something unexpected while updating status```"
    );
  }

  // console.log(Status_msg);
};

module.exports = {
  name: "about", //name of the module
  description: "Sets the user's about message", // short description of what this command does
  command: "!about", //command with prefix. Ex command: '!test'
  commandType: "admin", // admin|info|plugin
  isDependent: false, //whether this command is related/dependent to some other command
  help: "set about type !about All is well", // a string descring how to use this command Ex = help : 'To use this command type !test arguments'
  execute,
};
