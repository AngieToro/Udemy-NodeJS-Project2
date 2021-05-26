const path = require('path');

//give the path to the file that is responsible for the fact in the app is running
const rootDir = path.dirname(require.main.filename);

module.exports = rootDir;