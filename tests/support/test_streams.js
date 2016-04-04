var Stream = require('stream');

module.exports = TestStreams;

function TestStreams() {
  this.inputStream = setupInputStream();
  this.outputStream = setupOutputStream();
};

TestStreams.prototype.output = function output() {
  return this.outputStream.output;
}

TestStreams.prototype.plainOutput = function plainOutput() {
  return this.output().replace(/\x1b[[0-9;]+m/g, '');
};

TestStreams.prototype.mockInput = function mockInput(commands) {
  var self = this;
  commands.forEach(function(command) {
    process.nextTick(function() {
      self.inputStream.emit('data', command);
    });
  });
};

function setupOutputStream() {
  var outputStream = new Stream.Writable();

  outputStream.output = '';

  outputStream._write = function(chunk, enc, next) {
    outputStream.output += chunk.toString();
    next();
  };

  return outputStream;
}

function setupInputStream() {
  var inputStream = new Stream.Readable();
  inputStream.resume = function() { /* no-op */ };

  return inputStream;
}
