"use strict";
var peg_parser = require('../grammar/cmake.js');
module.exports = {
    parse  : (string) => {
       return peg_parser.parse(string + "\n"); 
    }
};