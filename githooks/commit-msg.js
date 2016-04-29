#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

var fs = require('fs');

var firstLineFromBuffer = function(buffer) {
  return buffer.toString().split('\n').shift();
};

var commitMsgFile = process.argv[2];

var msg = fs.readFileSync(commitMsgFile).toString();

process.exit(1);
