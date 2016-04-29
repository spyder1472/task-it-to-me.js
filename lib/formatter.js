var COLORS = {
  reset:    '\x1b[0m',
  info:     '\x1b[38;5;40m',
  prompt:   '\x1b[0;35m',
  alert:    '\x1b[40;38;5;214m',
  divider:  '\x1b[0;37m'
};

var LINE_BREAK    = '\n';
var SECTION_BREAK = '\n\n';

module.exports = {
  prompt:       prompt,
  info:         info,
  quoted:       quoted,
  alert:        alert,
  success:      success,
  command:      command,
  description:  description,

  COLORS:       COLORS,
  lineBreak:    LINE_BREAK,
  sectionBreak: SECTION_BREAK,
  dividerLight: dividerLight,
  dividerHeavy: dividerHeavy
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

function dividerHeavy() {
  return COLORS.divider + "=============================" + COLORS.reset + SECTION_BREAK;
}

function dividerLight() {
  return COLORS.divider + "-----------------------------" + COLORS.reset + SECTION_BREAK;
}

function command(message) {
  return COLORS.divider + message + COLORS.reset;
}

function description(message) {
  return COLORS.prompt + message + COLORS.reset;
}
