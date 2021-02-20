"use strict";
/**
 * index.js - main program/startup code for CLT
 * module index.js
 * @file index.js
 * @author egrano
 * @copyright Copyright ©2021, Evin Grano & Associates. All rights reserved.
 */
const MODULE_NAME = "index.js";
var _bmtn = global.BMT_NAMESPACE || {};

//set up our virtual environment vars
require('dotenv').config();

const [,,command] = process.argv;

if (!command) {
    console.log(`ERROR: Missing a command`);
    return 1;
}

let RETURN_VAL = 0;

// Commands
try {
    const CLT = require(`./tools/${command}`);

    const program = CLT.processCLT();

    CLT.run(program).then((results) => {
        return CLT.readOne(results)
    }).then((results) => {
        console.log(`\nSuccess?: ${results}`);
    });
} catch (e) {
    console.log(`ERROR: Invalid Command: ${command}`);
    RETURN_VAL = 1;
}

return RETURN_VAL;
