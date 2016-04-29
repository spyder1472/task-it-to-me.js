var test        = require('tape');
var tapeMethods = require(__dirname + '/support/tape_extensions');
test.Test.prototype.match    = tapeMethods.match;
test.Test.prototype.notMatch = tapeMethods.notMatch;

var formatter = require('../lib/formatter');

test('#prompt is the right color', function(test) {
  test.plan(1);
  test.match(formatter.prompt('do something'), formatter.COLORS.prompt);
});

test('#prompt ends with colon space and color reset', function(test) {
  test.plan(1);
  test.match(formatter.prompt('do something'), ': ' + formatter.COLORS.reset);
});

test('#prompt includes the message', function(test) {
  test.plan(1);
  test.match(formatter.prompt('do something'), 'do something');
});

test('#info starts with the info color', function(test) {
  test.plan(1);
  test.match(formatter.info('it went well'), formatter.COLORS.info);
});

test('#info ends with colon space color reset', function(test) {
  test.plan(1);
  test.match(formatter.info('do something'), ': ' + formatter.COLORS.reset);
});

test('#info includes the message', function(test) {
  test.plan(1);
  test.match(formatter.info('do something'), 'do something');
});

test('#quoted includes the message', function(test) {
  test.plan(1);
  test.match(formatter.quoted('do something'), "'do something'");
});

test('#alert starts with the alert color', function(test) {
  test.plan(1);
  test.match(formatter.alert('oh no!'), formatter.COLORS.alert);
});

test('#alert ends with color reset', function(test) {
  test.plan(1);
  test.match(formatter.alert('oh no!'), formatter.COLORS.reset);
});

test('#info includes the message', function(test) {
  test.plan(1);
  test.match(formatter.alert('oh no!'), 'oh no!');
});

test('#success starts with the info color', function(test) {
  test.plan(1);
  test.match(formatter.success('it went well'), formatter.COLORS.info);
});

test('#success ends with color reset', function(test) {
  test.plan(1);
  test.match(formatter.success('do something'), formatter.COLORS.reset);
});

test('#success does not insert a colon', function(test) {
  test.plan(1);
  test.notMatch(formatter.success('do something'), ':');
});

test('#success includes the message', function(test) {
  test.plan(1);
  test.match(formatter.success('do something'), 'do something');
});

test('#command uses the divider color', function(test) {
  test.plan(3);
  test.match(formatter.command('a'), 'a');
  test.match(formatter.command('a'), formatter.COLORS.divider);
  test.match(formatter.command('a'), formatter.COLORS.reset);
});

test('#description uses the prompt color', function(test) {
  test.plan(3);
  test.match(formatter.description('add'), 'add');
  test.match(formatter.description('add'), formatter.COLORS.prompt);
  test.match(formatter.description('add'), formatter.COLORS.reset);
});
