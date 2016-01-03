
var assert = require('assert');

var cmake = require('../grammar/cmake.js');


module.exports = {
    'command invocation no arg' : function(test) {
        cmake.parse('set()\n');
        test.ok(true)
        test.done();
    },
    'command invocation 1 arg' : function(test) {
        cmake.parse('az_AZ12 (ARG  )\n');
        test.ok(true)
        test.done();
    },
    'command invocation args' : function(test) {
        cmake.parse('az_AZ12 (ARG ${VALUE} ${Outer${Inner}} "string " )\n');
        test.ok(true)
        test.done();
    },
    'command invocation empty string' : function(test) {
        cmake.parse('fun("")\n');
        test.ok(true)
        test.done();
    },
    'command invocation string' : function(test) {
        cmake.parse('fun("Heloo World")\n');
        test.ok(true)
        test.done();
    },
     'command invocation string newline' : function(test) {
        cmake.parse('fun("Heloo ${World}\
        World")\n');
        test.ok(true)
        test.done();
    },
     'command invocation string escape' : function(test) {
        cmake.parse('zob("\\"")\n');
        test.ok(true)
        test.done();
    },
    'statement1' : function(test) {
        cmake.parse('set()\n');
        test.ok(true, 'cannot parse set()')
        test.done();
    },
    'single line comment' : function(test) {
        var expected ='if()endif()';
        var actual = cmake.parse('#'+expected+'\n');
        test.equal(expected, actual);
        test.ok(true);
        test.done();
    }, 
    'bracket comment' : function(test) {
        var actual = cmake.parse('\
#[=[\
        \
        ]]\n');
        test.done();
    }, 
    'two lines comment' : function(test) {
        var expected ='if()endif()';
        var actual = cmake.parse('#'+expected+'\n'+'#'+expected+'\n');
        
        test.deepEqual([expected, expected], actual);
        test.done();
    }, 
    'if_statement' : function(test) {
       
        var actual = cmake.parse('if()\nif()\nendif()\nendif()\n\n');
        
        test.done();
    }, 
};