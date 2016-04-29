#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

var fs = require('fs');

var validate = function(msg){
  if(msg.match(/blah/i)){
    return {
      exit: 0,
      log: 'all ok'
    }
  }
  else {
    return {
      exit: 1,
      log: 'bad commit message: |' + msg + '|'
    }

  }
}


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
