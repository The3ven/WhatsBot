const fs = require("fs");

function dir_files(path) {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => item.name);
}

module.exports = {
  dir_files,
};
