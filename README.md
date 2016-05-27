# PEGCMake

peg-cmake is a simple [CMake](https://cmake.org/cmake/help/v3.0/manual/cmake-language.7.html#syntax) parser written in javascript.


 ## Usage
 
 ```js
 var CMake = require('../');
 var fs = require('fs');
 
 fs.readFile('CMakeLists.txt', 'utf8', function (err,data) {
  if (!err) {
    try {
        var AST = CMake.arse(data);
    }catch(e) {
        console.log(e.name + " line " + e.location.start.line 
        + ", " + e.location.start.column
        + "\n"+ e.message);
    }
  }
});
 
 ```
 
 ## AST
 
 The the parse result is an array of node.
 Each node owns at least a `type` which can be one of the following :
 
 - `"bracket_argument"` 
 - `"bracket_comment"` 
 - `"command_invocation"`  
 - `"comment"`  
 - `"foreach"`  
 - `"function"`  
 - `"if"`  
 - `"macro"`  
 - `"newline"`  
 - `"quoted_argument"`  
 - `"unquoted_argument"`  
 - `"while"`  
 
 and a location :
 ```js
    {
        "start": {
            "offset": 31,
            "line": 1,
            "column": 32
        },
       "end": {
            "offset": 43,
            "line": 1,
            "column": 44
        }
    }
 ```

<table>
<tr>
<td>**Type**</td>
<td>**CMake**</td>
<td>**ASTNode**</td>
</tr>
<tr>
<td>
`comment`
</td>
<td>
   <pre lang="cmake">
# A single line comment
   </pre>
</td>
<td>
  <pre lang="js">
{
    "type": "comment",
    "value": " A single line comment"
}
  </pre>
</td>
</tr>
<tr>
<td>`bracket_comment`</td>
<td>
<pre lang="cmake">
#[[This is a bracket comment.
It runs until the close bracket.]]

message("1st Arg\n" #[[Bracket Comment]] "2nd Arg")
</pre>
</td>
<td>
  <pre lang="js">
{
    "type": "bracket_comment",
    "value": "Bracket Comment"
}
  </pre>
</td>
</tr>

<tr>
<td>`newline`</td>
<td></td>
<td>
<pre lang="js">
{
    "type":'newline'
}
</pre>
</td>
</tr>

<tr>
<td>`command_invocation`</td>
<td>
<pre lang="cmake">
message(FATAL "Hello")
</pre>
</td>
<td>
<pre lang="js">
{
    "type": "command_invocation", 
    "name": "message", 
    "arguments": [
        { "type" = "unquoted_argument" /*...*/ },
        { "type" = "quoted_argument" /*...*/ }
        ]
}
</pre>
</td>
</tr>

<tr>
<td>`bracket_argument`</td>
<td>
<pre lang="cmake">
message([=[
This is the first line in a 
bracket argument with bracket length 1.
No \-escape sequences or ${variable}
references are evaluated.
This is always one argument even
 though it contains a ; character.
The text does not end on a closing
 bracket of length 0 like ]].
It does end in a closing bracket
 of length 1.
]=])
</pre>
</td>
<td>
<pre lang="js">
 {
     "type": "bracket_argument", 
     "value": "This is [...] of length 1.",
     "len": 1
 }
</pre>
</td>
</tr>

<tr>
<td>`if`</td>
<td>
<pre lang="cmake">
if(TRUE)
elseif(PREDICATE)
else()
endif()
</pre>
</td>
<td>
<pre lang="js">
 {
     "type": "if", 
     "predicate" : [{"type":"unquoted_argument", "value":"TRUE"}],
     "body": [],
     "elseif" : [
         {
             "predicate" : [{"type":"unquoted_argument", "value":"PREDICATE"}],
             "body": []
         }
     ],
     "else" : {
        "predicate" : [{"type":"unquoted_argument", "value":"TRUE"}],
        "body": []
     }
 }
</pre>
</td>
</tr>


<tr>
<td>`function`</td>
<td>
<pre lang="cmake">
function(my_func ARG)
# body
endfunction()
</pre>
</td>
<td>
<pre lang="js">
{
    "type": "function", 
    "name": "my_func", 
    "arguments": [ {"type": "unquoted_argument" /*, ...*/} ]
    "body": [
        { "type" = "comment" /*...*/ }
        ]
}
</pre>
</td>
</tr>

<tr>
<td>`macro`</td>
<td>
<pre lang="cmake">
macro(my_macro ARG)
# body
endmacro()
</pre>
</td>
<td>
<pre lang="js">
{
    "type": "macro", 
    "name": "my_macro", 
    "arguments": [ {"type": "unquoted_argument" /*, ...*/} ]
    "body": [
        { "type" = "comment" /*...*/ }
        ]
}
</pre>
</td>
</tr>



<tr>
<td>`foreach`</td>
<td>
<pre lang="cmake">
foreach(F ${FILES})
# body
endforeach()
</pre>
</td>
<td>
<pre lang="js">
{
    "arguments": [ {"type": "unquoted_argument", "value": "F"}, 
                   {"type": "unquoted_argument", "value": "${FILES}"} ]
    "body": [
        { "type" = "comment" /*...*/ }
        ]
}
</pre>
</td>
</tr>


<tr>
<td>`while`</td>
<td>
<pre lang="cmake">
while(F ${FILES})
# body
endwhile()
</pre>
</td>
<td>
<pre lang="js">
{
    "arguments": [ {"type": "unquoted_argument", "value": "F"}, 
                   {"type": "unquoted_argument", "value": "${FILES}"} ]
    "body": [
        { "type" = "comment" /*...*/ }
        ]
}
</pre>
</td>
</tr>


</table>



# Known Issues

- Thes buffer must end with "\n", as a workaround the parse function append a new line to the buffer passed as argument.
- need tests :
```
CMake versions prior to 2.8.12 silently accept an Unquoted Argument or a Quoted Argument immediately following a Quoted Argument and not separated by any whitespace. For compatibility, CMake 2.8.12 and higher accept such code but produce a warning.
```
