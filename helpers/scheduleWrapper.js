const database = require("../db");

async function insertSchedule(number, task_name, task_date, msg, argument, isme, isSinglemsg) {
  let { conn, coll } = await database("schedule");
  try {
    await coll.insertOne({ number: number, task: task_name, date: task_date, msg: msg, args: argument, isMe: isme, ismsg: isSinglemsg });
    return true;
  } catch (error) {
    return false;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function fetchAllSchedules() {
  let { conn, coll } = await database("schedule");

  try {
    // Find all documents in the "schedule" collection
    const schedules = await coll.find({}).toArray();
    return schedules;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function deleteSchedule(NameOfTask) {
  let { conn, coll } = await database("schedule");

  try {
    // Delete the document with the specified id
    const result = await coll.deleteOne({ task: NameOfTask });

    if (result.deletedCount === 1) {
      console.log(`Document with Task ${NameOfTask} deleted successfully.`);
      return true;
    } else {
      console.log(`Document with Task ${NameOfTask} not found.`);
      return false;
    }
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return false;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function scheduleHandler() { }

module.exports = {
  insertSchedule,
  fetchAllSchedules,
  deleteSchedule,
  scheduleHandler,
};
