const UTILS = require('../utils');

const runOne = ({ symbol, limit = 500 }) => {
  const path = `/api/v3/trades?symbol=${symbol}${limit != 500 ? `&limit=${limit}` : ''}`;

  const options = {
    hostname: 'api.binance.us',
    path,
    method: 'GET',
    headers: {
      // 'X-MBX-APIKEY': API_KEY
      // 'Content-Type': 'application/x-www-form-urlencoded',
      // 'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    return UTILS.sendAPICall(options)
    .then((body) => {
      return resolve({
        params: {
          symbol,
          limit
        },
        raw: body
      });
    });
  });
};

const processData = (data) => {
  console.log(`\t${JSON.stringify(data)}`);
};

const readOne = ({ params, raw}) => {

  console.log(`LAST TRADES FOR: ${params.symbol}\n`);

  for (var i = raw.length - 1; i >= 0; i--) {
    processData(raw[i]);
  }

  return Promise.resolve(true);
};

module.exports = {
  runOne,
  readOne
};


