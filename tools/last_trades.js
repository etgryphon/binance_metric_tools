const UTILS = require('../utils');
const { Command } = require('commander');
const { binaryInsert } = require('binary-insert');

const TOP_BOTTOM= 0.1;

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

const processData = ({raw, sorted}) => {
  const len = sorted.length;
  const sliceIndex = Math.floor(len*TOP_BOTTOM);
  let totalUSD = 0;
  let medianUSD = 0;
  let minUSD = 0;
  let maxUSD = 0;
  medianIdx = Math.floor(len / 2);
  for(let i = sliceIndex; i < len - sliceIndex; i++) {
    const elem = sorted[i];
    const usdVal = (1*elem.qty) * (1*elem.price);
    totalUSD += usdVal;
    maxUSD = usdVal;
    if (i === medianIdx) {
      medianUSD = usdVal;
    }
    if (i === sliceIndex) {
      minUSD = usdVal
    }
  }

  const meanUSD = totalUSD /  (len - (2*sliceIndex));
  const outputString = `Stats: \
    \n\tMean: $${meanUSD.toFixed(2)} \
    \n\tMedian: $${medianUSD.toFixed(2)} \
    \n\tMin: $${minUSD.toFixed(2)} \
    \n\tMax: $${maxUSD.toFixed(2)} \
    `;
  console.log(outputString);
};

const readOne = ({ params, raw}) => {

  console.log(`LAST TRADES FOR: ${params.symbol}\n`);

  const comparator = (a,b) => {
    const usdValA = (1*a.qty) * (1*a.price);
    const usdValB = (1*b.qty) * (1*b.price);
    return usdValA - usdValB;
  };

  const sorted = [];
  for (let i = raw.length - 1; i >= 0; i--) {
    binaryInsert(sorted, raw[i], comparator);
  }

  processData({raw, sorted});

  return Promise.resolve(true);
};

const run = (program) => {
  const [,symbol] = program.args;

  const options = program.opts();

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


