var messages = require('./messages');
var Data     = require('./data');

module.exports = function(outputStream, inputStream) {
  inputStream.resume();

  var data = new Data();

  function run(callback) {
    callback = callback || function noop() {};

    function nextCommand() {
      outputStream.write(menu());
      inputStream.once('data', processInput);
    }

    function menu() {
      var menu;
      if (data.isEditingProject()) {
        menu = messages.taskMenu();
      } else {
        menu = messages.projectMenu();
      }
      return menu;
    }

    function processInput(rawData) {
      var command = rawData.toString().trim();
      if (command === 'q') {
        return callback();
      } else if (data.isEditingProject()) {
        if (command === 'c') {
          outputStream.write(messages.promptForNewProjectName());
          inputStream.once('data', function changeProjectName(rawData) {
            var oldName = data.currentProjectName();
            var newName = rawData.toString().trim();
            data.renameCurrentProject(newName);
            outputStream.write(messages.changedProjectName(oldName, newName));
            nextCommand();
          });
        } else if (command === 'a') {
          outputStream.write(messages.promptForTaskName());
          inputStream.once('data', function addNewTask(rawData) {
            var taskName = rawData.toString().trim();
            if (data.taskExists(taskName)) {
              outputStream.write(messages.taskAlreadyExists(taskName));
              nextCommand();
            } else {
              data.addTask(taskName);
              outputStream.write(messages.createdTask(taskName));
              nextCommand();
            }
          });
        } else if (command === 'ls') {
          if (data.thereAreTasks()) {
            outputStream.write(messages.listTasks(data.currentProjectName(), data.tasks()));
          } else {
            outputStream.write(messages.noTasksCreated(data.currentProjectName()));
          }
          nextCommand();
        } else if (command === 'e') {
          outputStream.write(messages.promptForTaskName());
          inputStream.once('data', function editTaskName(rawData) {
            var oldName = rawData.toString().trim();
            var task = data.findTask(oldName);
            if (task) {
              oldName = task.name;
              outputStream.write(messages.promptForNewTaskName());
              inputStream.once('data', function changeTaskName(rawData) {
                var newName = rawData.toString().trim();
                data.renameTask(oldName, newName);
                outputStream.write(messages.changedTaskName(oldName, newName));
                nextCommand();
              });
            } else {
              outputStream.write(messages.taskDoesntExist(oldName));
              nextCommand();
            }
          });
        } else if (command === 'd') {
          outputStream.write(messages.promptForTaskName());
          inputStream.once('data', function deleteTask(rawData) {
            var taskName = rawData.toString().trim();
            if (data.taskExists(taskName)) {
              data.removeTask(taskName);
              outputStream.write(messages.deletedTask(taskName));
              nextCommand();
            } else if (data.thereAreTasks()) {
              outputStream.write(messages.taskDoesntExist(taskName));
              nextCommand();
            } else {
              outputStream.write(messages.noTasksCreated(data.currentProjectName()));
              nextCommand();
            }
          });
        } else if (command === 'f') {
          outputStream.write(messages.promptForTaskName());
          inputStream.once('data', function finishTask(rawData) {
            var task = rawData.toString().trim();
            if (data.taskExists(task)) {
              data.removeTask(task);
              outputStream.write(messages.finishedTask(task));
              nextCommand();
            } else {
              outputStream.write(messages.taskNotFound(task));
              nextCommand();
            }
          });
        } else if (command === 'b') {
          data.stopEditingProject();
          inputStream.once('data', processInput);
        } else {
          outputStream.write(messages.unknownCommand(command));
          nextCommand();
        }
      } else {
        if (command === 'ls') {
          if (data.thereAreProjects()) {
            outputStream.write(messages.listProjects(data.projects));
            nextCommand();
          } else {
            outputStream.write(messages.listingProjectHeader());
            outputStream.write(messages.noProjectsExist());
            nextCommand();
          }
        } else if (command === 'a') {
          outputStream.write(messages.promptForProjectName());
          inputStream.once('data', function createProject(rawData) {
            var projectName = rawData.toString().trim();
            data.addProject(projectName);
            outputStream.write(messages.createdProject(projectName));
            nextCommand();
          });
        } else if (command === 'd') {
          if (data.thereAreProjects()) {
            outputStream.write(messages.promptForProjectName());
            inputStream.once('data', function deleteProjectIfExists(rawData) {
              var projectName = rawData.toString().trim();
              var project = data.findProject(projectName);
              if (project) {
                data.removeProject(projectName);
                outputStream.write(messages.deletingProject(project.name));
                nextCommand();
              } else {
                outputStream.write(messages.projectDoesntExist(projectName));
                nextCommand();
              }
            });
          } else {
            outputStream.write(messages.noProjectsExist());
            outputStream.write(messages.cantDeleteProject());
            nextCommand();
          }
        } else if (command === 'e') {
          if (data.thereAreProjects()) {
            outputStream.write(messages.promptForProjectName());
            inputStream.once('data', function editProjectIfExists(rawData) {
              var projectName = rawData.toString().trim();
              var project = data.findProject(projectName);
              if (project) {
                outputStream.write(messages.editingProject(project.name));
                data.startEditingProject(projectName);
              } else {
                outputStream.write(messages.projectDoesntExist(projectName));
              }
              nextCommand();
            });
          } else {
            outputStream.write(messages.noProjectsExist());
            outputStream.write(messages.cantDeleteProject());
            nextCommand();
          }
        } else {
          outputStream.write(messages.unknownCommand(command));
          nextCommand();
        }
      }
    }

    nextCommand();
  }

  return {
    run: run
  };
};


