const UTILS = require('../utils');
const { Command } = require('commander');

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

const run = (program) => {
  const [,symbol] = program.args;

  const options = program.opts();
  console.log(`TEST: ${options.limit}`);

  return runOne({
    symbol,
    limit: options.limit
  });
};

const processCLT = () => {
  const program = new Command();
  program.version('0.0.1');

  program
    .arguments('[command] <symbol>')
    .description('How to use last_trades', {
      command: 'last trades commmand',
      symbol: 'symbol you would like to test'
    })
    .option('-l, --limit <count>', 'set the number of trades you want. DEFAULT: 500', '500');

  program.parse(process.argv);

  return program;
};

module.exports = {
  run,
  runOne,
  readOne,
  processCLT
};


