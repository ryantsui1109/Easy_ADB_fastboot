const fs = require("fs");
const configJSONExists = fs.existsSync("config.json");
if (configJSONExists) {
  fs.rmSync("config.json");
}
fs.copyFileSync("default_config.json", "config.json");
