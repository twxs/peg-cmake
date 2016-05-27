var CMake = require('../');

var fs = require('fs');


var FormatConfig = {
  UseTab:false,
  IndentWidth: 4, // space
  ContinuationIndentWidth: 4,
  ColumnLimit: 100,
  AllowedBlankLines: 1,
  AlignAfterOpenBracket : "BAS_Align",
  TrimComments: true 
  
}

// Simple CMake code formater ASTMatcher
// result will contain the indented buffer
// tabSize : number of space per TAB
//
function CMakeCodeFormater(config){
  this._indent =  0;
  
  
  this.tab = ()=>{
    this._indent+= config.IndentWidth;
  };
  this.untab = ()=>{
    this.result = this.result.substr(0, this.result.length-config.IndentWidth);
    this._indent-= config.IndentWidth;
  };
  
  // Storage
  this.result = "";
  
  this.toString = (string) => {return string ;};
  
  this.print = (string) => {
    this.result += this.toString(string);
    this.newlineEmitted = 0;
  };
 
  this.eol = ()=>{
    return "\n" + this.indentString();
  }
  
  this.indentString = ()=>{
    return this._indent>0?Array(this._indent+1).join(" "):"";
  };
  
  this.newlineEmitted = 0;
  
  this.newline =  (elt) => {
     if(this.newlineEmitted <= config.AllowedBlankLines)
      this.result += this.eol();
    this.newlineEmitted++;
  };
  
  this.comment = (comment)=>{ 
    if(config.TrimComments)
      this.print(this.toString("# " + comment.value.trim()));
    else
      this.print(this.toString("#" + comment.value))
    this.print(this.eol());
  };
  
  this.unquoted_argument = (elt)=>{ 
    return elt.value; 
  };
  
  this.quoted_argument = (elt)=>{ return "\"" + elt.value + "\""; };
  
  this.current_column = ()=>{
    var index = this.result.lastIndexOf("\n") + 1;
    return (index==0)?this.result.length :this.result.length - (index+1);
  }
  
  function openBracket(len){    
    return "[" + Array(len+1).join("=") +"[";
  }
  function closeBracket(len){
    return "]" + Array(len+1).join("=") +"]";
  }
  
  this.arguments = (args)=>{
    var com = this.comment;    
    var nl = this.newline;   
    var bc = this.bracket_comment;
    var ba = this.bracket_argument;
    this.newline = (e)=>{return this.eol()}; 
    this.comment = (comment)=>{ 
      return this.toString("# " + comment.value.trim() + this.eol());
    };
    this.bracket_comment = (comment)=>{ 
      return this.toString("#" + openBracket(comment.len) + comment.value + closeBracket(comment.len));
    };
     this.bracket_argument = (comment)=>{ 
      return this.toString( openBracket(comment.len)  + comment.value + closeBracket(comment.len));
    };
    var backup = this._indent;
    this._indent = this.current_column();
    var res = args.map((arg)=>{
      if(Array.isArray(arg)){
        return "(" + this.arguments(arg) + ")";
      }else if(this[arg.type]){
        return this[arg.type](arg);
      }else
        return null;
    })
    .filter((e)=>{return e != null})
    .join(" ");
    this._indent = backup;  
    this.comment = com; 
    this.newline = nl;
    this.bracket_comment = bc;
    this.bracket_argument = ba;
    return res;
  }
  
  this.invoke = (name, args, indent) => {
    this.print(name + "(");
    var args = this.arguments(args); 
    this.print(args +")") ;
    if(typeof indent !== 'undefined'){
      if(indent){
        this.tab()
      }else {
        this.untab();
      }
    }      
  }
  
  this.command_invocation = (elt)=>{
    this.invoke(elt.identifier, elt.arguments);
  };
  
  this.func = (elt, name)=>{
    this.invoke(name, [{type:"unquoted_argument", value:elt.name}].concat(elt.arguments));
    this.tab();
    elt.body.forEach((e)=>{
      var cb = this[e.type];
      if(cb){
        cb(e);
      }
    })
    this.untab();
    this.invoke("end"+name, [{type:"unquoted_argument", value:elt.name}]);
  }
  
  this.macro = (elt)=>{
    this.func(elt, "macro");
  }
  this.function = (elt)=>{
    this.func(elt, "function");
  }
  
  
  this.loop = (elt, name)=>{
    this.invoke(name, elt.arguments, true);
    this.print(this.eol());
    elt.body.forEach((e)=>{
      var cb = this[e.type];
      if(cb){
        cb(e);
      }
    })
    this.untab();
    this.invoke("end" + name, []);
  }
  this.foreach = (elt)=>{this.loop(elt, "foreach")};
  this.while = (elt)=>{this.loop(elt, "while")};
  
  this.if = (elt)=>{
     this.invoke("if", elt.predicate, true);
     elt.body.forEach((e)=>{
      var cb = this[e.type];
      if(cb){
        cb(e);
      }
     });
    
    this.untab();
    if(elt.elseif){
      elt.elseif.forEach((e) => {
        this.invoke("elseif", elt.predicate, true);
        e.body.forEach((_e) => {
          var cb = this[_e.type];
          if (cb) {
            cb(_e);
          }
        })
        this.untab();

      });
    }
    if(elt.else){
        this.invoke("else", elt.else.predicate, true);
      elt.else.body.forEach((e) => {
          var cb = this[e.type];
          if (cb) {
            cb(e);
          }
        })
        this.untab();
    }
    this.invoke("endif", []);
  }
  
  this.bracket_argument = (elt)=>{
    this.print(openBracket(elt.len) + elt.value + closeBracket(elt.len));
  }
  
  this.bracket_comment = (elt)=>{
    this.print("#" + openBracket(elt.len) + elt.value + closeBracket(elt.len));
  }
  
}

function traversAST(ast, matcher) {
  ast.forEach((element)=>{
    if(matcher[element.type])
      matcher[element.type](element);
  });
}


fs.readFile('test/CMakeLists.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  try {
  var result = CMake.parse(data);
  var formater = new CMakeCodeFormater(FormatConfig);
  traversAST(result, formater);
  process.stdout.write(formater.result);
//  printElements(result);
  console.log(JSON.stringify(result, null, 2));
  for(var i = 0; i != result.length; ++i){
      var statement = result[i];
   //   console.log(statement.type); 
  }
  }catch(e) {
      console.log(e.name + " line " + e.location.start.line 
      + ", " + e.location.start.column
      + "\n"+ e.message);
  }
});

