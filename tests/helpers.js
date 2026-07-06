const path = require("path");
const { pathToFileURL } = require("url");

// file:// URL of the greeting page under test.
const PAGE = pathToFileURL(path.resolve(__dirname, "..", "index.html")).href;

module.exports = { PAGE };
