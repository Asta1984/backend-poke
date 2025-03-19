const fs = require("fs");
const path = require("path");

// Create a write stream (in append mode)
const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

module.exports = {
    stream: logStream
};
