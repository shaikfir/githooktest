#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

var fs = require('fs');
var singleWords = ['noqa', 'test', 'merge'];


var VALID =  {
  exitCode: 0,
  log: 'all ok'
};

var validate = function(msg){
  return validateSingleLine(msg);
}

function validateSingleLine(msg) {
  var i;
  for (i in singleWords){
    var word = singleWords[i];
    var re = new RegExp('^' + word + '$|^' + word + '\|', "i");
    if (re.test(msg)) {
      return VALID;
    }
  }

  if(msg.match(/blah/i)){
    return VALID;
  }
  else {
    return {
      exitCode: 1,
      log: 'bad commit message: |' + msg + '|'
    }

  }
};

exports.validate = validate;

var firstLineFromBuffer = function(buffer) {
  return buffer.toString().split('\n').shift();
};

var commitMsgFile = process.argv[2];
// Avoid runing global code durng tests
if (commitMsgFile && commitMsgFile !== '--reporter'){
  var msg = fs.readFileSync(commitMsgFile).toString();
  var res = validate(msg);
  console.log(res.log);
  process.exit(res.exit);
}
