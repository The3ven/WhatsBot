const fs = require("fs");

const Append_file = (file_name, content) => {
  // content += "By Append";
  content = "\n" + content;
  try {
    fs.appendFileSync(file_name, content);
    return true;
  } catch (err) {
    return "F@A_0001"; // Err F@A_0001
  }
};

const Read_file = (file_name) => {
  try {
    const data = fs.readFileSync(file_name, "utf8");
    return data;
  } catch (err) {
    return "F@R_0002"; // Err F@R_0002
  }
};

const Write_file = (file_name, content) => {
  // content += "By Write";
  try {
    fs.writeFileSync(file_name, content);
    return true;
  } catch (err) {
    return "F@W_0003"; // Err F@W_0003
  }
};

const Delete_file = (file_name) => {
  try {
    fs.unlinkSync(file_name);
    return true;
  } catch (err) {
    return "F@D_0004"; // Err F@D_0004
  }
};

const Rename_file = (orignal_file, replace_file) => {
  try {
    fs.renameSync(orignal_file, replace_file);
    return true;
  } catch (err) {
    return "F@R_0005"; // Err F@R_0005
  }
};

const Exist = (file_name) => {
  return fs.existsSync(file_name);
};

const Handler = (file_name, contant = "", mode, rename_name = "") => {
  mode = mode.toUpperCase();
  const exists = Exist(file_name);
  // console.log(`file name : ${file_name}`);
  // console.log(`contant : ${contant}`);
  // console.log(`rename_name : ${rename_name}`);
  // console.log(`mode : ${mode}`);
  switch (mode) {
    case "WRITE":
      if (!exists) return Write_file(file_name, contant);
      let read_contant = Read_file(file_name);
      if (read_contant.length > 0) {
        return Append_file(file_name, contant);
      } else {
        return Write_file(file_name, contant);
      }
    case "READ":
      if (!exists) return false;
      return Read_file(file_name);
    case "DELETE":
      if (!exists) return false;
      return Delete_file(file_name);
    case "RENAME":
      if (!exists) return false;
      if (rename_name.length === "") return false;
      const Rename_file_exists = Exist(rename_name);
      if (!Rename_file_exists) {
        return Rename_file(file_name, rename_name);
      }
  }
};

module.exports = {
  Append_file,
  Write_file,
  Read_file,
  Rename_file,
  Delete_file,
  Handler,
  Exist,
};
