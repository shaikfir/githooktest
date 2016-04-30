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

var badMessages = [
  'this should never work!',
  'this should never work!',
  'merge without pipeline',
  'testing 123',
  'what aboutnoqa',
  'this also should never work!',
];


describe("Git Commit Hook", function() {
  describe("message validator", function() {
    it('should accept valid messages as valid', function() {
      for (var i in validMessages) {
        var commitMsg = validMessages[i];
        var result = validator.validate(commitMsg);

        if (result.exitCode != 0) {
          console.log('+ ERROR: ' + commitMsg + ' expected to be valid');
        }
        expect(result.exitCode).to.equal(0);
      }
    });
  });

  describe("message validator", function() {
    it('should reject invalid messages', function() {
      for (var i in badMessages) {
        var commitMsg = badMessages[i];
        var result = validator.validate(commitMsg);
        if (result.exitCode != 1) {
          console.log('+ ERROR: ' + commitMsg + ' expected to be invalid');
        }
        expect(result.exitCode).to.equal(1);
      }
    });
  });
});
