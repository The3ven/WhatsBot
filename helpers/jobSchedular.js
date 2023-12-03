const schedule = require("node-schedule");

const ScheduleJob = (
  NameOfTask,
  Shedule_date,
  client,
  msg,
  args,
  target,
  ismsg
) => {
  let job = schedule.scheduleJob(NameOfTask, Shedule_date, async function () {
    // console.log(`user requested to run a task ${Takname}`);
    // console.log('The answer to life, the universe, and everything!');
    if (!ismsg) {
      await client.commands.get(job.name).execute(client, msg, args, mode);
    } else {
      await client.sendMessage(target, args);
    }
    // await deleteSchedule(job.name);
  });
  return job.name.toString();
};

module.exports = {
  ScheduleJob,
};
