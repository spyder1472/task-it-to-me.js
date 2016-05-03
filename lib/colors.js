const white = '\x1b[0m';
const green = '\x1b[38;5;40m';

module.exports = {
	header: header,
}

function header(text) {
	return green + text + white;
}
