var COLORS = {
  reset:  '\x1b[0m',
  info:   '\x1b[38;5;40m',
  prompt: '\x1b[0;35m',
  alert:  '\x1b[40;38;5;214m'
};

module.exports = {
  prompt:   prompt,
  info:     info,
  quoted:   quoted,
  alert:    alert,
  success:  success,

  COLORS:       COLORS,
  lineBreak:    '\n',
  sectionBreak: '\n\n'
};

function prompt(message) {
  return COLORS.prompt + message + ': ' + COLORS.reset;
}

function info(message) {
  return COLORS.info + message + ': ' + COLORS.reset;
}

function quoted(message) {
  return "'" + message + "'";
}

function alert(message) {
  return COLORS.alert + message + COLORS.reset;
}

function success(message) {
  return COLORS.info + message + COLORS.reset;
}
