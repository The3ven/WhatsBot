const fs = require("fs");
const execute = async (client, msg, args, isMe) => {
  let month = "";
  let msgMode = msg.to;
  if (!isMe) {
    msgMode = msg.from;
  }
  const Company_holiday_list_json = "../public/Company_Holiday.json";
  if (!fs.existsSync(Company_holiday_list_json)) {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n\n` +
        "```Company_holiday_list_json  dosen`t exist please add it and try again later```"
    );
    return;
  }
  const Company_holiday_list = require(Company_holiday_list);
  if (args.length > 0) {
    month = args[0];
  }
  try {
    await client.sendMessage(msgMode, holiday_fetcher(month));
  } catch (e) {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n\n` +
        "```Something Unexpected Happened while fetching Holiday calander```" +
        `${e}`
    );
  }
};
const month_data = (month) => {
  let array = [];
  if (Company_holiday_list.hasOwnProperty(month)) {
    try {
      const holidays = Company_holiday_list[month];
      holidays.forEach((holiday) => {
        array.push(
          `- ${holiday.name} (${holiday.date.day}/${holiday.date.month}/${
            holiday.date.year
          }) - ${holiday.type.join(", ")} - ${holiday.weekday}`
        );
      });
    } catch (e) {
      console.log(e);
    }
    return array;
  }
};

const holiday_fetcher = (month) => {
  let data = "";
  if (String(month).length > 0 && month !== undefined && month !== "") {
    data = `*${month}*\n`;
    month_data(month).forEach((holiday) => {
      data += holiday + "\n";
    });
    // console.log(data, "\n");
    return data;
  }
  for (const month in Company_holiday_list) {
    data += `*${month}*\n`;
    month_data(month).forEach((holiday) => {
      data += holiday + "\n";
    });
  }
  // console.log(data, "\n");
  return data;
};

module.exports = {
  name: "Nowork",
  description: "Send about not work day", // short description of what this command does
  command: "!nowork", //command with prefix. Ex command: '!test'
  commandType: "plugin", // admin|info|plugin
  isDependent: false, //whether this command is related/dependent to some other command
  help: "can tell about holiday of a comapany calander default is month holidays\n\n*!holiday* [month]\nEx: !holiday [January]",
  execute,
};
