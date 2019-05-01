const path = require('path')
const fs = require('fs')
const https = require('https')

const endpoints = {wasatchback: 'https://api.runragnar.com/get/race/relay/wasatchback'}
const get = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let data = ''

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          if (parsed.status) {
            resolve(JSON.stringify(parsed.data))
          } else {
            console.log('There was a problem with the data.', data)
          }
        } catch (e) {
          console.log(e)
          reject(e)
        }
      });

    }).on("error", (err) => {
      reject(err)
    });
  })
}

Object.keys(endpoints).forEach((key) => {
  get(endpoints[key]).then((data) => {
    const fileName = path.join(__dirname, '..', 'src', 'data', key + '.json')
    fs.writeFile(fileName, data, (err) => {
      console.log(err)
    })
  }).catch((err) => {
    console.log(err)
  })
})
