var App = require(__dirname + "/lib/app");
new App(process.stdout, process.stdin).run(function() {
  process.exit();
});
