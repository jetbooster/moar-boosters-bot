import fs from "fs";
import path from "path";

// Why make an async function that doesn't support promises?!
fs.readFileAsync = function(filename) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, function(err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

var self = {
  getRunningTotals: () => {
    // importing the json at the top of the file causes it to be cached.
    const p = path.join(__dirname, "/data/runningTotal.json");
    // readFile is now modernised!
    return fs.readFileAsync(p).then(data => {
      console.log("Data loading...");
      return JSON.parse(data);
    });
  },
  updateRunningTotals: runningTotals => {
    const p = path.join(__dirname, "/data/runningTotal.json");
    // Writing the file with a promise is less important
    fs.writeFile(p, JSON.stringify(runningTotals), err => {
      if (err) {
        console.log(err);
      } else {
        console.log("File updated");
      }
    });
  }
};

export default self;
