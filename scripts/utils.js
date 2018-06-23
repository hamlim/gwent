const http = require('https')
const fs = require('fs')
// https://stackoverflow.com/a/22907134
const download = (url, dest, cb) => {
  const file = fs.createWriteStream(dest)
  const request = http
    .get(url, response => {
      response.pipe(file)
      file.on('finish', () => {
        file.close(cb) // close() is async, call cb after close completes.
      })
    })
    .on('error', err => {
      // Handle errors
      fs.unlink(dest) // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message)
    })
}

module.exports = {
  download,
}
