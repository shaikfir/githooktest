var expect = require('chai').expect;
var validator = require('../githooks/commit-msg');

var validMessages = [
  'merge',
  'test',
  'noqa',

  'merge|some description',
  'test|some description',
  'noqa|some description',

  'WCD-1234|some text',
  'SE-0|some other text'
];

var badMessages = [
  'this should never work!',
  'this should never work!',
  'merge without pipeline',
  'testing 123',
  'what aboutnoqa',
  'this also should never work!',

  'VOID-1234|some text',
  'WCD 1234|some text',
  'WCD-12e3|some other text'

];


describe("Git Commit Hook", function() {
  describe("message validator", function() {
    it('should accept valid messages as valid', function() {
      for (var i in validMessages) {
        var commitMsg = validMessages[i];
        var result = validator.validate(commitMsg);

        if (result.exitCode != 0) {
          console.log('+ ERROR: ' + commitMsg + ' expected to be valid. Error message:"' + result.log + '"');
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
