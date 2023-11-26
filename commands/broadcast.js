//jshint esversion:8
let last_msg = "";
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
      `🙇‍♂️ *Error*\n Invalid command\nPlease use !help broadcast to check usage of this command`
    );
  }

  if (last_msg !== broadcast_msg) {
    numbers.forEach(async (number) => {
      // console.log("numbers : ", number);
      const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
      const final_number = `91${sanitized_number.substring(
        sanitized_number.length - 10
      )}`; // add 91 before the number here 91 is country code of India

      const number_details = await client.getNumberId(final_number); // get mobile number details

      if (number_details) {
        try {
          await client.sendMessage(number_details._serialized, broadcast_msg);
          await client.sendMessage(
            msgMode,
            `${broadcast_msg} successfully sended to ${final_number}`
          );
          last_msg = broadcast_msg;
        } catch {
          await client.sendMessage(
            msgMode,
            `🙇‍♂️ *Error*\n while sending ${broadcast_msg} to ${final_number}`
          );
        }
      } else {
        await client.sendMessage(
          msgMode,
          `🙇‍♂️ *Error*\n${final_number} Mobile number is not registered`
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
