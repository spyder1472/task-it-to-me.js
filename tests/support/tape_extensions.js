module.exports = {
  match: match,
  notMatch: notMatch
};

function match(base, substring, msg, extra) {
  var value = base.indexOf(substring) >= 0;
  var message = "\nExpected '" + substring + "' to be contained within '" + base + "'.\n";
  msg = !value && message;
  this._assert(value, {
    message : msg,
    operator : 'ok',
    expected : true,
    actual : value,
    extra : extra
  });
};

function notMatch(base, substring, msg, extra) {
  var value = base.indexOf(substring) < 0;
  var message = "\nExpected '" + substring + "' NOT to be contained within '" + base + "'.\n";
  msg = !value && message;
  this._assert(value, {
    message : msg,
    operator : 'ok',
    expected : true,
    actual : value,
    extra : extra
  });
};
