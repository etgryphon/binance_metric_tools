"use strict";
/**
 * index.js - main program/startup code for CLT
 * module index.js
 * @file index.js
 * @author egrano
 * @copyright Copyright ©2021, Evin Grano & Associates. All rights reserved.
 */
const MODULE_NAME = "main.js";
var _bmtn = global.BMT_NAMESPACE || {};

//set up our virtual environment vars
require('dotenv').config();

console.log("I'm here");

// Commands
const LAST_TRADES = require('./tools/last_trades');

LAST_TRADES.runOne({
    symbol: 'ADAUSDT',
    limit: 5
}).then((results) => {
    return LAST_TRADES.readOne(results)
}).then((results) => {
    console.log(`Success?: ${results}`);
});
