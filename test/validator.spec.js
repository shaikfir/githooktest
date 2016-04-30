var expect = require('chai').expect;
var validator = require('../githooks/commit-msg');

var validMessages = [
  'merge',
  'test',
  'noqa',

  'merge|some descritiob',
  'test|some descritiob',
  'noqa|some descritiob',
];


describe("Git Hook thingy", function() {
  describe("commit message validator", function() {
    for (var i in validMessages) {
      var commitMsg = validMessages[i];
      it('should accept "' + commitMsg + '" as valid', function() {
        var result = validator.validate(commitMsg);
        expect(result.exitCode).to.equal(0);
      });
    }
  });
});
