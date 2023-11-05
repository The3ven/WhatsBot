const { Handler, Exist } = require("../helpers/Files");
const headerString =
  "Transaction,Source,Place,Category,Transaction_Type,Date,Time";
const path = require("path");
const execute = async (client, msg, args, isMe) => {
  let msgMode = msg.to;
  if (!isMe) {
    msgMode = msg.from;
  }

  dataString = msg.body.slice(5).trim();

  let date = "",
    file_date = "",
    time = "";

  const dataArray = dataString.split(",");

  var csvString = dataArray.join(",");
  if (dataArray[2].toLowerCase() == "status") {
    if (
      dataArray.length > 3 &&
      dataArray[3][0].toUpperCase() == "D" &&
      dataArray[4][0].toUpperCase() == "T"
    ) {
      date = dataArray[3].slice(2);
      time = dataArray[4].slice(2);

      if (date.slice(6, 8) != "20") {
        const td2 = date.split("-");
        date = td2[0] + "-" + td2[1] + "-20" + td2[2];
      }

      const tempStr =
        dataArray[0] +
        "," +
        dataArray[1] +
        "," +
        dataArray[2] +
        ",,," +
        dataArray[3].slice(2) +
        "," +
        dataArray[4].slice(2);
      csvString = tempStr;
    }
    // transaction_source_status
    else {
      console.log("Here #3");
      const d = new Date();
      let dt = "",
        mt = "";
      let hr = "",
        mn = "";

      if (d.getDate().toString().length == 1) {
        dt = "0" + d.getDate().toString();
      } else {
        dt = d.getDate.toString();
      }

      if ((d.getMonth() + 1).toString().length == 1) {
        mt = "0" + (d.getMonth() + 1).toString();
      } else {
        mt = (d.getMonth() + 1).toString();
      }

      if (d.getHours().toString().length == 1) {
        hr = "0" + d.getHours().toString();
      } else {
        hr = d.getHours().toString();
      }

      if (d.getMinutes().toString().length == 1) {
        mn = "0" + d.getMinutes().toString();
      } else {
        mn = d.getMinutes().toString();
      }

      date = dt + "-" + mt + "-" + d.getFullYear();
      time = hr + ":" + mn;

      csvString += ",,," + date + "," + time;
    }
  } else if (dataArray.length == 5) {
    // Use present date time
    const d = new Date();
    let dt = "",
      mt = "";
    let hr = "",
      mn = "";

    if (d.getDate().toString().length == 1) {
      dt = "0" + d.getDate().toString();
    } else {
      dt = d.getDate.toString();
    }

    if ((d.getMonth() + 1).toString().length == 1) {
      mt = "0" + (d.getMonth() + 1).toString();
    } else {
      mt = (d.getMonth() + 1).toString();
    }

    if (d.getHours().toString().length == 1) {
      hr = "0" + d.getHours().toString();
    } else {
      hr = d.getHours().toString();
    }

    if (d.getMinutes().toString().length == 1) {
      mn = "0" + d.getMinutes().toString();
    } else {
      mn = d.getMinutes().toString();
    }

    date = dt + "-" + mt + "-" + d.getFullYear();
    time = hr + ":" + mn;

    csvString =
      dataArray[0] +
      "," +
      dataArray[1] +
      "," +
      dataArray[2] +
      "," +
      dataArray[3] +
      "," +
      dataArray[4] +
      "," +
      date +
      "," +
      time;
  } else if (
    dataArray[5][0].toUpperCase() == "D" &&
    dataArray[6][0].toUpperCase() == "T"
  ) {
    date = dataArray[5].slice(2);
    time = dataArray[6].slice(2);

    if (date.slice(6, 8) != "20") {
      const td2 = date.split("-");
      date = td2[0] + "-" + td2[1] + "-20" + td2[2];
    }

    csvString =
      dataArray[0] +
      "," +
      dataArray[1] +
      "," +
      dataArray[2] +
      "," +
      dataArray[3] +
      "," +
      dataArray[4] +
      "," +
      dataArray[5].slice(2) +
      "," +
      dataArray[6].slice(2);
  }

  const td = date.split("-");

  if (td[2].slice(0, 2) == "20") {
    file_date = td[2].slice(2, 4) + td[1] + td[0];
  } else {
    file_date = td[2] + td[1] + td[0];
  }

  const fileName = path.join(
    __dirname,
    "../public/",
    `Transaction_${file_date}.csv`
  );

  if (!Exist(fileName)) {
    try {
      Handler(fileName, headerString, "Write", "");
      await client.sendMessage(
        msgMode,
        `*Created*\nCreated a new transaction file With name of ${fileName}`
      );
    } catch {
      await client.sendMessage(
        msgMode,
        `🙇‍♂️ *Error*\nWhile creating Transactionn file, please try again`
      );
    }
  }
  try {
    Handler(fileName, csvString, "Write", "");
    await client.sendMessage(
      msgMode,
      `*Writing*\nTranscation Writing to ${fileName}`
    );
  } catch {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\nTransaction can not be saved in file please try again\n`
    );
  }

  await client.sendMessage(
    msgMode,
    "*File Saved Total Contant of File : *\n" +
      Handler(fileName, "", "READ", "")
  );
};

module.exports = {
  name: "trns",
  description: "Track as my Spandings",
  command: "!trns",
  commandType: "plugin",
  isDependent: false,
  help: `*Trns*\n\nTrack record of Money Spending Just send the spending data, it will add them to a csv for you.\n\n*!trns Transaction,Source,Place,Category,Transaction_Type,Date,Time*\nor,\nReply a message with *!trns* to add in csv`,
  execute,
};
