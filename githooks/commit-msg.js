#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

var fs = require('fs');
var singleWords = ['noqa', 'test', 'merge'];
var projects = ['WCD', 'CLNT', 'SE', 'BLOG', 'TPA'];
var statuses = ['resolved', 'dev-done'];

var VALID =  {
  exitCode: 0,
  log: 'all ok'
};

var validate = function(msg){
  var globalResult = null
  msg = msg.replace(/[\n\r]+$/, ''); // remove last crlf
  var lines = msg.split('\n');
  var hasErr = lines.map(function(line){
    return validateSingleLine(line);
  }).some(function(result){
    globalResult = result;
    return (result.exitCode === 1);
  });

  if (hasErr) {
    return globalResult;
  }

  return VALID;
}

function isValidJiraRef(projRef){
  var jiraParts = projRef.split('-');
  if (jiraParts.length < 2) {
    return {
      exitCode: 1,
      errCode: 2,
      log: 'bad commit message. Expecting dash ("-") delimiter in Jira reference: ' + projRef
    }
  }

  var jiraProj = jiraParts[0];
  var jiraNum = jiraParts[1];
  var validProj = false;
  if (projects.indexOf(jiraProj) === -1) {
    return {
      exitCode: 1,
      errCode: 3,
      log: 'bad commit message: "' + msg + '". unrecognized Jira project ID: ' + jiraProj
    }
  }

  if (jiraNum.match(/^\d+$/) === null){
    return {
      exitCode: 1,
      errCode: 4,
      log: 'bad commit message: "' + msg + '". bad Jira ticket number: ' + jiraNum
    }
  }

  return VALID;

}

function validateSingleLine(msg) {
  // test for single word message
  var isValid = singleWords.some(function(word){
    var regex = '^'+ word + '$|^' + word + '\\|';
    var re = new RegExp(regex);
    return re.exec(msg);
  });

  if (isValid) {
    return VALID;
  }

  // test for split message (pipeline)
  var parts = msg.split('|');
  var numParts = parts.length;
  if (numParts === 1) {
    return {
      exitCode: 1,
      errCode: 5,
      log: 'bad commit message: "' + msg + '". Expecting pipline delimiter'
    }
  }

  // expect first part to be a project jira reference
  // as in #proj-123
  var projRef = parts[0];
  var jiraRefTest = isValidJiraRef(projRef);
  if (numParts === 2 || jiraRefTest.exitCode === 1) {
    return jiraRefTest;
  }

  var status = parts[1].toLowerCase();
  if (statuses.indexOf(status) === -1) {
    return {
      exitCode: 1,
      errCode: 6,
      log: 'bad commit message: "' + msg + '". unknown status: ' + status
    }
  }

  return VALID;
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
  process.exit(res.exitCode);
}
