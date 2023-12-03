//jshint esversion:8
const {
  insertSchedule,
  fetchAllSchedules,
  deleteSchedule,
  scheduleHandler,
} = require("../helpers/scheduleWrapper");
const { ScheduleJob } = require("../helpers/jobSchedular");
const {
  whatsapp_number_verifayer,
  dmy_formatter,
  future_date_time_finder,
} = require("../helpers/lamp");

const execute = async (client, msg, args, isMe) => {
  let msgMode = msg.to;
  if (!isMe) {
    msgMode = msg.from;
  }
  let target, Task, scheduleDate, schedule_msg, schedule_date;
  // msg.delete(true);
  /*  Set Command to shedule followed by user argument assuem command here as task   */
  Task = args.shift().toLowerCase();
  //   console.log("Task : ", Task);
  /**
   * @param scheduleDate - a date and time object to run schedule task
   * Date to run te task
   * Accepted arguments are follows :
   * +05:00 // schedule after 5 Hour from now
   * 12:20 // schedule at 12:20 today
   * midnight // schedule at midnight which is 00:00:00
   * +00:30 // schedule after 30 minutes
   */
  scheduleDate = args.pop();

  /*  Set Command argument to be pass for future task run well */
  let arguments = args;
  /* if task is msg mean we need to schedule a single messege not a command just like Birtday wished & Fucking Brackup news (i love second one btw 😂 if you find it its mean its for you!)*/
  try {
    target = args.pop();
    schedule_msg = args.join(" ");
    // console.log("msg : ", schedule_msg);
    // console.log("arguments : ", arguments);
    // console.log("scheduleDate : ", scheduleDate);
    // console.log("target : ", target);
    let future_date = future_date_time_finder(
      dmy_formatter(scheduleDate.toUpperCase())
    );
    schedule_date = new Date(future_date);
    // console.log("future_date : ", future_date);
    // console.log(" new Date(future_date) : ", schedule_date);
    if (isNaN(target)) {
      await client.sendMessage(
        msgMode,
        `🙇‍♂️ *Error*\n Seems like you forget to provide number to schedule messege`
      );
      return;
    }
  } catch (e) {
    await client.sendMessage(
      msgMode,
      `🙇‍♂️ *Error*\n Seems like somthing wrong with arguments ${e}`
    );
    return;
  }

  if (Task === "msg") {
    try {
      let whatsapp_number = await whatsapp_number_verifayer(client, target);
      // console.log("whatsapp_number :", whatsapp_number);
      if (whatsapp_number) {
        try {
          let Scheduled_Job = ScheduleJob(
            Task,
            schedule_date,
            client,
            msg,
            schedule_msg,
            whatsapp_number._serialized,
            true
          );
          if (Scheduled_Job === Task) {
            await client.sendMessage(
              msgMode,
              `Your Job is Scheduled at ${schedule_date}`
            );
          }
        } catch {}
      } else {
        await client.sendMessage(
          msgMode,
          `🙇‍♂️ *Error*\n${target} Mobile number is not registered`
        );
      }
    } catch {
      await client.sendMessage(
        msgMode,
        `🙇‍♂️ *Error*\nWhile scheduling your messege`
      );
    }
  } else if (client.commands.get(Task).command === `!${Task}`) {
    // TODO : Handle Schedule Commands In future
  }

  // console.log("client.commands.get(Task) : ",);

  // await client.commands.get(Task).execute(client, msg, arguments, isMe);

  // let Shedule_date = new Date('2023-11-29T20:43:00');
  // ScheduleJob()
};

module.exports = {
  name: "Schedule",
  description: "schedule a command for future",
  command: "!schedule",
  commandType: "admin",
  isDependent: false,
  help: "Shedule a command & Messege for future it will execute automatically at specified time Eg: !schedule spam 10 Hello Guys +30M",
  execute,
};
