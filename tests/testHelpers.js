const fs = require('fs');

function readFile(filePath) {
    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        return fileData;
      } catch (err) {
        console.error(err);
      }
      return null;
}

module.exports = {
    readFile
};