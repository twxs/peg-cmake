# PEGCMake

peg-cmake is a simple CMake parser written in javascript.


 ## Usage
 
 ```js
 var CMake = require('../');
 var fs = require('fs');
 
 fs.readFile('CMakeLists.txt', 'utf8', function (err,data) {
  if (!err) {
    try {
        var AST = CMake.Parser.parse(data);
    }catch(e) {
        console.log(e.name + " line " + e.location.start.line 
        + ", " + e.location.start.column
        + "\n"+ e.message);
    }
  }
});
 
 ```