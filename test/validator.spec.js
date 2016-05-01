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
  'SE-0|some other text',

  'WCD-1234|resolved|some text',
  'WCD-1234|dev-done|some text',
  'SE-0|Resolved|some other text',
  'CLNT-1111|Resolved|some other text|and|many |pipeliens',

  'WCD-1234|resolved|some text\n',
  'WCD-1234|dev-done|some text\n',
  'SE-0|Resolved|some other text\n',
  'CLNT-1111|Resolved|some other text|and|many |pipeliens\n',
  'WCD-1234|resolved|some text\nWCD-1234|dev-done|some text\nSE-0|Resolved|some other text\n',
  'WCD-1234|resolved|some text\ntest|some desc\nSE-0|Resolved|some other text\n'
];

var badMessages = [
  '',
  '\n',
  '\n\n\n\n\n\n',
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
  'SE-0|Resov|ed|som|e other text',

  'WCD-1234|resolved|desc\nBAD ONE\nWCD-1234|dev-done|some text\nSE-0|Resolved|some other text\n',
  'WCD-1234|resolved|some text\n  \ntest|some desc\nSE-0|Resolved|some other text\n'
];

describe("message validator", function() {
  validMessages.forEach(function (commitMsg) {
    it('should accept valid messages as valid: ' + commitMsg, function() {
        var result = validator.validate(commitMsg);
        expect(result.exitCode).to.equal(0);
    });
  })
});

describe("message validator", function() {
    badMessages.forEach(function(commitMsg) {
      it('should reject invalid messages: ' + commitMsg, function() {
        var result = validator.validate(commitMsg);
        expect(result.exitCode).to.equal(1);
     });
  });
});
