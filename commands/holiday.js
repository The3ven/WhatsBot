//jshint esversion:8
const axios = require("axios");
const { HOLIDAY_API_KEY } = require("../config");
const csp = require("country-state-picker");
let year = "";
let month = "";
let day = "";
let base_url = "https://calendarific.com/api/v2/holidays?&api_key=";

const execute = async (client, msg, args, isMe) => {
  console.log("args.length", args.length);
  console.log("args", args);
  let response;
  let holiday_search_data = "";
  year = "";
  month = "";
  day = "";
  console.log("day : ", day);
  console.log("month : ", month);
  console.log("year : ", year);
  if (args.length > 0) {
    holiday_search_data = args[0].toUpperCase();
    dmy_formatter(holiday_search_data);
  }
  let msgMode = msg.to;
  if (!isMe) {
    msgMode = msg.from;
  }
  let date = new Date();
  let country = "";
  let type = "";

  country.length <= 0 && country == ""
    ? (country = csp
        .getCountry("+" + `${msg.from.substring(0, 2)}`)
        .code.toUpperCase())
    : (country = "IN");
  month.length <= 0 && month == "" && holiday_search_data.indexOf("Y") === -1
    ? (month = 1 + date.getMonth())
    : "";
  year.length <= 0 && year == ""
    ? (year = date.getFullYear())
    : (year = "20" + year);
  type.length <= 0 && type == ""
    ? (type = "national")
    : // national - Returns public, federal and bank holidays
      // local - Returns local, regional and state holidays
      // religious - Return religious holidays: buddhism, christian, hinduism, muslim, etc
      // observance - Observance, Seasons, Times
      "";

  const errorMessage =
    (month == null ? "Month" : "") +
    (day == null ? "Day" : "") +
    (year == null ? "Year" : "");

  if (errorMessage) {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n\n` +
        "```" +
        errorMessage +
        "is passed but value is not specified```" +
        `${e}`
    );
    return;
  }

  if (Number(month) > 12) {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n\n` + "```Month can`t be greater then 12```" + `${e}`
    );
    return;
  }
  let currentMonthDays = getDaysInMonth(month, year);

  if (Number(day) > currentMonthDays) {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n\n` +
        "```Date can`t be greater then ```" +
        `${currentMonthDays}` +
        `${e}`
    );
    return;
  }
  if (Number(month) > 12) {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n\n` + "```Month can`t be greater then 12```" + `${e}`
    );
    return;
  }
  console.log("day : ", day);
  console.log("month : ", month);
  console.log("year : ", year);

  let url = `${base_url}${HOLIDAY_API_KEY}&country=${country}&year=${year}&day=${day}&month=${month}&type=${type}`;

  console.log("URL : ", url);
  try {
    response = await axios.get(url);
  } catch (e) {
    console.log(e);
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n\n` +
        "```Something Unexpected Happened while fetching Holiday```" +
        `${e}`
    );
  }

  if (response.data.meta.code !== 200) {
    console.error("Error Occured!!");
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n\n` +
        "```Something Unexpected Happened while fetching Holiday```" +
        `${response.data.response}`
    );
    return;
  }

  console.log("data : ", response.data.response.holidays);
  try {
    if (response.data.response.holidays.length > 1) {
      response.data.response.holidays.forEach(async (Json) => {
        console.log(Json);
        await client.sendMessage(
          msgMode,
          `*Name :* _${Json.name}_\n*description :* _${Json.description}_\n*Date :* _${Json.date.datetime.day}-${Json.date.datetime.month}-${Json.date.datetime.year}_\n*Holiday Type :* ${Json.type[0]}`
        );
      });
    } else {
      let Json = response.data.response.holidays[0];
      await client.sendMessage(
        msgMode,
        `*Name :* _${Json.name}_\n*description :* _${Json.description}_\n*Date :* _${Json.date.datetime.day}-${Json.date.datetime.month}-${Json.date.datetime.year}_\n*Holiday Type :* ${Json.type[0]}`
      );
    }
  } catch {
    if (response.data.response.holidays.length === 0) {
      let date = "";
      (day.length > 0 ? (date += day + "-") : "") +
        (month.length > 0 ? (date += month + "-") : "") +
        (year.length > 0 ? (date += year) : "");
      await client.sendMessage(
        msgMode,
        "No " + `${type}` + " holiday for date : " + `${date}`
      );
      return;
    }
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n\n` +
        "```Something Unexpected Happened while fetching Holiday```" +
        `${response.data.response}`
    );
  }
  console.log("Im at  end");
};

const dmy_formatter = (str) => {
  // console.log("str : ", str);
  let idx_D = str.indexOf("D"),
    idx_M = str.indexOf("M"),
    idx_Y = str.indexOf("Y");
  if (idx_D >= 0) {
    day = parser(str, idx_D);
  }
  if (idx_M >= 0) {
    month = parser(str, idx_M);
  }
  if (idx_Y >= 0) {
    idx_M === -1 ? (month = "") : "";
    year = parser(str, idx_Y);
  }
};

const parser = (str, idx) => {
  let value = str.substring(idx + 1, idx + 3);
  if (isNaN(value[0])) return null;
  isNaN(value[1]) ? (value = value[0]) : "";
  return value;
};

function getDaysInMonth(month, year) {
  const date = new Date(year, month + 1, 0);
  return date.getDate();
}

module.exports = {
  name: "Holiday",
  description: "Send about holiday", // short description of what this command does
  command: "!holiday", //command with prefix. Ex command: '!test'
  commandType: "plugin", // admin|info|plugin
  isDependent: false, //whether this command is related/dependent to some other command
  help: "can tell about holiday of a day,week,month or year default is month\n\n*!holiday* [DDMMYYYY]\nEx: !holiday [D13M11Y23]",
  execute,
};
