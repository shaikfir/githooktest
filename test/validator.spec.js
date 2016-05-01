var expect = require('chai').expect;
var validator = require('../githooks/commit-msg');

var validMessages = [
  'merge',
  'test',
  'noqa',
  'blah|blah',
  'merge|some description',
  'test|some description',
  'noqa|some description',

  'WCD-1234|some text',
  'SE-0|some other text',

  'WCD-1234|resolved|some text',
  'WCD-1234|dev-done|some text',
  'SE-0|Resolved|some other text',
  'CLNT-1111|Resolved|some other text|and|many |pipeliens'

];

var badMessages = [
  'this should never work!',
  'this should never work!',
  'merge without pipeline',
  'testing 123',
  'what aboutnoqa',
  'this also should never work!',
  'blah|blah',

  'VOID-1234|some text',
  'WCD 1234|some text',
  'WCD-12e3|some other text',

  'WCD-1234|reslved|some text',
  'WCD-1234|dev--done|some text',
  'SHE-000|Resolved|some other text',
  'SE-0|Resov|ed|som|e other text'


];

describe("message validator", function() {
  validMessages.forEach(function (commitMsg) {
    it('should accept valid messages as valid ' + commitMsg, function() {
        var result = validator.validate(commitMsg);
        if (result.exitCode != 0) {
          console.log('+ ERROR: ' + commitMsg + ' expected to be valid. Error message:"' + result.log + '"');
        }
        console.log(commitMsg);
        expect(result.exitCode).to.equal(0);
    });
  })
});

xdescribe("Git Commit Hook", function() {
  describe("message validator", function() {

    validMessages.forEach(function (commitMsg) {
      it('should accept valid messages as valid', function() {
          var result = validator.validate(commitMsg);

          if (result.exitCode != 0) {
            console.log('+ ERROR: ' + commitMsg + ' expected to be valid. Error message:"' + result.log + '"');
          }
          expect(result.exitCode).to.equal(0);
      });
    })

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
