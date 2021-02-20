const http = require('http');
const https = require('https');

const sendAPICall = (options) => {
  return new Promise((resolve, reject) => {
    // console.log(`Calling: https://${options.hostname}${options.path}`);
    const req = https.request(options, (res) => {
      // console.log(`STATUS: ${res.statusCode}`);
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        const parsedBody = JSON.parse(body);
        return resolve(parsedBody);
      });
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });

    // Write data to request body
    // req.write(postData);
    req.end();
  });
};

module.exports = {
    sendAPICall
};
