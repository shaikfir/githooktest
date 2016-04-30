#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

var fs = require('fs');
var singleWords = ['noqa', 'test', 'merge'];
var projects = ['WCD', 'CLNT', 'SE', 'BLOG', 'TPA'];

var VALID =  {
  exitCode: 0,
  log: 'all ok'
};

var validate = function(msg){
  return validateSingleLine(msg);
}

function validateSingleLine(msg) {

  // test for single word message
  var i;
  for (i in singleWords){
    var word = singleWords[i];
    var regex = '^'+ word + '$|^' + word + '\\|';
    var re = new RegExp(regex);
    var m = re.exec(msg);
    if(m !== null){
      return VALID;
    }
  };

  // test for split message (pipeline)
  var parts = msg.split('|');
  var numParts = parts.length;
  if (numParts === 1) {
    return {
      exitCode: 1,
      errCode: 1,
      log: 'bad commit message: "' + msg + '". Expecting pipline delimiter'
    }
  }

  // expect first part to be a project jira reference
  // as in #proj-123
  if (numParts === 2) {
    var projRef = parts[0];
    var jiraParts = projRef.split('-');
    if (jiraParts.length < 2) {
      return {
        exitCode: 1,
        errCode: 2,
        log: 'bad commit message: "' + msg + '". Expecting dash ("-") delimiter in Jira reference'
      }
    }
    var jiraProj = jiraParts[0];
    var jiraNum = jiraParts[1];
    var validProj = false;
    var p;
    for (p in projects){
      var proj = projects[p];
      if (proj === jiraProj){
        validProj = true;
        break;
      }
    }

    if (!validProj){
      return {
        exitCode: 1,
        errCode: 3,
        log: 'bad commit message: "' + msg + '". unrecognized Jira project ID: ' + jiraProj
      }
    }

    if (jiraNum.match(/^\d+$/) === null){
      return {
        exitCode: 1,
        errCode: 3,
        log: 'bad commit message: "' + msg + '". bad Jira ticket number: ' + jiraNum
      }
    }

    return VALID;
  }

  return {
    exitCode: 1,
    log: 'bad commit message: ' + msg
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
