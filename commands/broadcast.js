//jshint esversion:8
let last_msg = "";
const { whatsapp_number_verifayer } = require("../helpers/lamp");

const execute = async (client, msg, args, isMe) => {
  let msgMode = msg.to;
  if (!isMe) {
    msgMode = msg.from;
  }
  let broadcast_msg;
  let numbers;

  try {
    let last_args = args.pop().toString();
    if (last_args === "force") {
      last_msg = "";
      numbers = args.pop().toString().split(",");
    } else {
      numbers = last_args.split(",");
    }
    broadcast_msg = args.join(" ");
    if (isNaN(numbers[0])) {
      await client.sendMessage(
        msgMode,
        `🙇‍♂️ *Error*\n Seems like you forget to provide number(s) to broadcast messege`
      );
      return;
    }
  } catch {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n Invalid command arguments\nPlease use !help broadcast to check usage of this command`
    );
  }

  if (last_msg !== broadcast_msg) {
    numbers.forEach(async (number) => {
      let whatsapp_number = await whatsapp_number_verifayer(client, number);
      if (whatsapp_number) {
        try {
          await client.sendMessage(whatsapp_number._serialized, broadcast_msg);
          await client.sendMessage(
            msgMode,
            `${broadcast_msg} successfully sended to ${whatsapp_number.user}`
          );
          last_msg = broadcast_msg;
        } catch {
          await client.sendMessage(
            msgMode,
            `🙇‍♂️ *Error*\n while sending ${broadcast_msg} to ${whatsapp_number.user}`
          );
        }
      } else {
        await client.sendMessage(
          msgMode,
          `🙇‍♂️ *Error*\n${number} Mobile number is not registered`
        );
      }
    });
  } else {
    await client.sendMessage(
      msgMode,
      `⚠️ *Warning!*\nMessege broadcast done already, same messege can not be broadcast again`
    );
  }
};

module.exports = {
  name: "Broadcast",
  description: "Broadcast a messege to multiple user",
  command: "!broadcast",
  commandType: "admin",
  isDependent: false,
  help: "Send a messege to multiple users Eg : !broadcast [msg] num1,num2,numn",
  execute,
};
