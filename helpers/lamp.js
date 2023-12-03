/* -------------------------------------------------------------------------- */
/*              A Place Where jinn lives And All the megic begins             */
/* -------------------------------------------------------------------------- */
var luxon = require("luxon");

const whatsapp_number_verifayer = async (client, number) => {
  const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
  const final_number = `91${sanitized_number.substring(
    sanitized_number.length - 10
  )}`; // add 91 before the number here 91 is country code of India

  const number_details = await client.getNumberId(final_number); // get mobile number details
  if (number_details) return number_details;
  return null;
};

const dmy_formatter = (str) => {
  let dmy_arr = [];
  // console.log("str : ", str);
  let dx_S = str.indexOf("S"),
    idx_Min = str.indexOf("M"),
    idx_H = str.indexOf("H"),
    idx_D = str.indexOf("D"),
    idx_Mon = str.indexOf("M", idx_Min + 1),
    idx_Month = str.indexOf("MONTH"),
    idx_Y = str.indexOf("Y");
  // if (idx_Month !== idx_Min && idx_Month !== idx_Mon && idx_Month > 0) {
  //     idx_Mon = idx_Month
  // }
  /* -------------------------------------------------------------------------- */
  /*                               loging indexes                               */
  /* -------------------------------------------------------------------------- */
  // console.log("dx_S : ", dx_S);
  // console.log("idx_Min : ", idx_Min);
  // console.log("idx_H : ", idx_H);
  // console.log("idx_Mon : ", idx_Mon);
  // console.log("idx_Month : ", idx_Month);
  // console.log("idx_Y : ", idx_Y);
  /* -------------------------------------------------------------------------- */
  if (idx_Mon === -1 && idx_Month !== -1) {
    idx_Mon = idx_Month;
  }
  /* ---------------------------------------------------------------------------------------------- */
  /*     Handle if "MONTH" is passed then it hould not be passes its value into hour and minutes    */
  /* ---------------------------------------------------------------------------------------------- */
  if (idx_Month + 4 === idx_H) {
    idx_H = -1;
  }
  if (idx_Month === idx_Min) {
    idx_Min = -1;
  }
  /* ---------------------------------------------------------------------------------------------- */
  if (dx_S >= 0) {
    dmy_arr.push(parser(str, dx_S));
  } else {
    dmy_arr.push("");
  }
  if (idx_Min >= 0) {
    console.log("parser(str, idx_Min) : ", parser(str, idx_Min));
    dmy_arr.push(parser(str, idx_Min));
  } else {
    dmy_arr.push("");
  }
  if (idx_H >= 0) {
    dmy_arr.push(parser(str, idx_H));
  } else {
    dmy_arr.push("");
  }
  if (idx_D >= 0) {
    dmy_arr.push(parser(str, idx_D));
  } else {
    dmy_arr.push("");
  }
  if (idx_Mon >= 0) {
    dmy_arr.push(parser(str, idx_Mon));
  } else {
    dmy_arr.push("");
  }
  if (idx_Y >= 0) {
    dmy_arr.push(parser(str, idx_Y));
  } else {
    dmy_arr.push("");
  }
  return {
    sec: dmy_arr[0],
    min: dmy_arr[1],
    hour: dmy_arr[2],
    day: dmy_arr[3],
    month: dmy_arr[4],
    year: dmy_arr[5],
  };
};

const future_date_time_finder = (future_time) => {
  const DateTime = luxon.DateTime;
  const today = DateTime.local();
  const addYear = function (date, addition) {
    return date.plus({ years: addition });
  };

  const addMonth = function (date, addition) {
    return date.plus({ months: addition }).startOf("month");
  };

  const addDay = function (date, addition) {
    return date.plus({ days: addition }).startOf("day");
  };

  const addHour = function (date, addition) {
    var prev = date;
    date = date.plus({ hours: addition }).startOf("hour");
    if (date <= prev) {
      date = date.plus({ hours: addition });
    }
    return date;
  };

  const addMinute = function (date, addition) {
    var prev = date;
    date = date.plus({ minutes: addition }).startOf("minute");
    if (date < prev) {
      date = date.plus({ hours: addition });
    }
    return date;
  };

  const addSecond = function (date, addition) {
    var prev = date;
    date = date.plus({ seconds: addition }).startOf("second");
    if (date < prev) {
      date = date.plus({ hours: addition });
    }
    return date;
  };

  /* -------------------------------------------------------------------------- */
  /*       Setup Funcion for make a future date on based of user argument       */
  /* -------------------------------------------------------------------------- */

  // console.log("today : ", today);
  let future_date_time = today;
  // console.log("future_time : ", future_time);
  Number(future_time.year) > 0
    ? (future_date_time = addYear(future_date_time, future_time.year))
    : "";
  // console.log("future_date_time After addYear : ", future_date_time);
  Number(future_time.month) > 0
    ? (future_date_time = addMonth(future_date_time, future_time.month))
    : "";
  // console.log("future_date_time After addMonth : ", future_date_time);
  Number(future_time.day) > 0
    ? (future_date_time = addDay(future_date_time, future_time.day))
    : "";
  // console.log("future_date_time After addDay : ", future_date_time);
  Number(future_time.hour) > 0
    ? (future_date_time = addHour(future_date_time, future_time.hour))
    : "";
  // console.log("future_date_time After addHour : ", future_date_time);
  Number(future_time.min) > 0
    ? (future_date_time = addMinute(future_date_time, future_time.min))
    : "";
  // console.log("future_date_time After addMinute : ", future_date_time);
  Number(future_time.sec) > 0
    ? (future_date_time = addSecond(future_date_time, future_time.sec))
    : "";
  // console.log("future_date_time After addSecond : ", future_date_time);
  const [dateTimePart, offsetPart] = future_date_time
    .toString()
    .split(/([+-]\d{2}:\d{2})/);
  // console.log("dateTimePart : ", dateTimePart);
  // console.log("offsetPart : ", offsetPart);
  return dateTimePart.toString();
};

// const parser = (str, idx) => {
//     let value = str.substring(idx + 1, idx + 3);
//     if (isNaN(value[0])) return null;
//     isNaN(value[1]) ? (value = value[0]) : "";
//     return value;
// };
const parser = (str, idx) => {
  let data = "";
  let strlen = str.length;
  let find = false;
  for (let p = 0; p < strlen; p++) {
    if (isNaN(str[idx])) {
      idx++;
      if (find) break;
    }
    if (Number(str[idx]) || str[idx] === "0") {
      data += str[idx];
      idx++;
      find = true;
    }
  }
  return data;
};

module.exports = {
  whatsapp_number_verifayer,
  dmy_formatter,
  future_date_time_finder,
};
