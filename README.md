# peg-cmake

peg-cmake is a simple CMake parser written in javascript. 
It aims to provide a core lib for tools suche as formatting, refactoring, etc... 

The library is under developement and not stable.   

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
