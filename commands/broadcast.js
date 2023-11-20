//jshint esversion:8
const execute = async (client, msg, args, isMe) => {
  let msgMode = msg.to;
  if (!isMe) {
    msgMode = msg.from;
  }
  let brodcast_msg;
  let numbers;
  console.log(args);
  try {
    numbers = args.pop().toString().split(",");
    brodcast_msg = args.join(" ");
    if (isNaN(numbers)) {
      await client.sendMessage(
        msgMode,
        `🙇‍♂️ *Error*\n Seems like you forget to provide number(s) to broadcast messege`
      );
    }
  } catch {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n Invalid command\nPlease use !help broadcast to check usage of this command`
    );
  }
  if (!isNaN(numbers)) {
    numbers.forEach(async (number) => {
      console.log("numbers : ", number);
      const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
      const final_number = `91${sanitized_number.substring(
        sanitized_number.length - 10
      )}`; // add 91 before the number here 91 is country code of India

      const number_details = await client.getNumberId(final_number); // get mobile number details

      if (number_details) {
        try {
          await client.sendMessage(number_details._serialized, brodcast_msg);
          await client.sendMessage(
            msgMode,
            `${brodcast_msg} successfully sended to ${final_number}`
          );
        } catch {
          await client.sendMessage(
            msgMode,
            `🙇‍♂️ *Error*\n while sending ${brodcast_msg} to ${final_number}`
          );
        }
      } else {
        await client.sendMessage(
          msgMode,
          `🙇‍♂️ *Error*\n${final_number} Mobile number is not registered`
        );
      }
    });
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
