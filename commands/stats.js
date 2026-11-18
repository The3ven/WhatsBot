//jshint esversion:8
//jshint esversion:8

const checkDiskSpace = require("check-disk-space").default;
const osInfo = require("@felipebutcher/node-os-info");
const si = require("systeminformation");
const os = require("os");
const process = require("process");
const currentPath = process.cwd();
const axios = require("axios");
const { MessageMedia } = require("whatsapp-web.js");


const psup = () => {
  var ps_ut_sec = Math.floor(process.uptime());
  var ps_ut_min = Math.floor(ps_ut_sec / 60);
  var ps_ut_hour = Math.floor(ps_ut_min / 60);
  ps_hour = ps_ut_hour % 60;
  ps_min = ps_ut_min % 60;
  ps_sec = ps_ut_sec % 60;
  return { ps_sec, ps_min, ps_hour };
};

const sysup = () => {
  var os_ut_sec = Math.floor(os.uptime());
  var os_ut_min = Math.floor(os_ut_sec / 60);
  var os_ut_hour = Math.floor(os_ut_min / 60);
  os_hour = os_ut_hour % 60;
  os_min = os_ut_min % 60;
  os_sec = os_ut_sec % 60;
  return { os_sec, os_min, os_hour };
};

const execute = async (client, msg, isMe) => {
  let msgMode = msg.to;
  if (!isMe) {
    msgMode = msg.from;
  }
  msg.delete(true);
  await checkDiskSpace(currentPath).then(async (diskSpace) => {
    // get ram usage in percentage
    await si.mem(async (mem) => {
      // get cpu usage in percentage
      await osInfo.cpu(async (cpu) => {
        // get disk usage in percentage
        await osInfo.disk(async (disk) => {
          // get uptime for bot process
          let { ps_hour, ps_min, ps_sec } = psup();

          // get uptime for system
          let { os_hour, os_min, os_sec } = sysup();

          // get memory (ram) usage status
          var bytes_totalram = os.totalmem();
          gb_totalrma = bytes_totalram / (1024 * 1024 * 1024);
          totram = parseFloat(gb_totalrma).toFixed(2);

          // get free memory
          var bytes_freeram = os.freemem();
          gb_freeram = bytes_freeram / (1024 * 1024 * 1024);
          totfram = parseFloat(gb_freeram).toFixed(2);

          // get used memory
          var used_ram = totram - totfram;
          totused = parseFloat(used_ram).toFixed(2);

          // get Processor cores
          var vcore = os.cpus().length;
          var pcore = vcore / 2;
          let memoryUsage = mem.active / mem.total;
          let usedSwep =
            mem.swaptotal / (1024 * 1024) - mem.swapfree / (1024 * 1024);
          let usedSwepby = usedSwep / 1024;
          let usedSwepbystr = usedSwepby.toString();
          let TotalSwep = parseFloat(
            mem.swaptotal / (1024 * 1024) / 1024
          ).toPrecision(3);
          let UsedSwep;
          if (usedSwepbystr[0] == "0") {
            UsedSwep = parseFloat(usedSwepby).toPrecision(2);
          } else {
            UsedSwep = parseFloat(usedSwepby).toPrecision(3);
          }
          let TotalFreeSwap = parseFloat(
            mem.swapfree / (1024 * 1024) / 1024
          ).toPrecision(3);
          let memory = Math.round(memoryUsage * 100) / 100;
          var tot_disk_size = parseFloat(
            diskSpace.size / (1024 * 1024 * 1024)
          ).toFixed(2);
          var free_disk_size = parseFloat(
            diskSpace.free / (1024 * 1024 * 1024)
          ).toFixed(2);
          var used_per_mem = Math.round(memory * 100);
          var used_per_cpu = Math.round(cpu * 100);
          var used_per_disk = Math.round(disk * 100);
          var used_disk_size = parseFloat(
            tot_disk_size - free_disk_size
          ).toFixed(2);

          let Final_stats_str = `*OS* : ${os_hour}h ${os_min}m ${os_sec}s  *Bot* : ${ps_hour}h ${ps_min}m ${ps_sec}s\n`;
          Final_stats_str += `*Total Cores* : ${vcore}  *Physical Cores* : ${pcore}\n`;
          Final_stats_str += `*Total* : ${tot_disk_size}GB  *Used* : ${used_disk_size}GB   *Free* : ${free_disk_size}GB\n`;
          Final_stats_str += `*Total* : ${totram}GB *Used* : ${totused}GB  *Free* : ${totfram}GB\n`;
          Final_stats_str += `*Total Swap* : ${TotalSwep}GB  *Used Swap* : ${UsedSwep}GB    *Free* : ${TotalFreeSwap}GB\n`;
          Final_stats_str += `*CPU* : ${used_per_cpu}%  *RAM* : ${used_per_disk}%    *Disk* : ${used_per_mem}%\n`;
          // console.log(Final_stats_str);

          let startdata = await get_image_media(Final_stats_str);
          await client.sendMessage(
            msgMode,
            new MessageMedia(startdata.mimetype, startdata.data, startdata.filename),
            { caption: startdata.msg }
          );




          // client.sendMessage(msgMode, Final_stats_str);
        });
      });
    });
  });
};




async function get_image_media(Final_msg) {
  return {
    msg:
      Final_msg,
    mimetype: "image/jpeg",
    data: Buffer.from(
      (
        await axios.get(
          "https://raw.githubusercontent.com/The3ven/WhatsBot/main/start.jpg",
          {
            responseType: "arraybuffer",
          }
        )
      ).data
    ).toString("base64"),
    filename: "start.jpg",
  };
}

module.exports = {
  name: "stats",
  description: "send status of the bot host machine",
  command: "!stats",
  commandType: "info",
  isDependent: false,
  help: `_You can use this command to check information of host system_`,
  execute,
};
