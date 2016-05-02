var messages = require('./messages');
var Data     = require('./data');

module.exports = function(outputStream, inputStream) {
  inputStream.resume();

  var data = new Data();
  var write = outputStream.write.bind(outputStream);

  function run(callback) {
    callback = callback || function noop() {};

    function nextCommand() {
      write(menu());
      inputStream.once('data', processCommand);
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


    function processCommand(rawData) {
      var command = rawData.toString().trim();
      if (command === 'q') {
        return callback();
      } else if (data.isEditingProject()) {
        if (command === 'c') {
          write(messages.promptForNewProjectName());
          inputStream.once('data', function changeProjectName(rawData) {
            var oldName = data.currentProjectName();
            var newName = rawData.toString().trim();
            data.renameCurrentProject(newName);
            write(messages.changedProjectName(oldName, newName));
            nextCommand();
          });
        } else if (command === 'a') {
          write(messages.promptForTaskName());
          inputStream.once('data', function addNewTask(rawData) {
            var taskName = rawData.toString().trim();
            if (data.taskExists(taskName)) {
              write(messages.taskAlreadyExists(taskName));
              nextCommand();
            } else {
              data.addTask(taskName);
              write(messages.createdTask(taskName));
              nextCommand();
            }
          });
        } else if (command === 'ls') {
          if (data.thereAreTasks()) {
            write(messages.listTasks(data.currentProjectName(), data.tasks()));
          } else {
            write(messages.noTasksCreated(data.currentProjectName()));
          }
          nextCommand();
        } else if (command === 'e') {
          write(messages.promptForTaskName());
          inputStream.once('data', function editTaskName(rawData) {
            var oldName = rawData.toString().trim();
            var task = data.findTask(oldName);
            if (task) {
              oldName = task.name;
              write(messages.promptForNewTaskName());
              inputStream.once('data', function changeTaskName(rawData) {
                var newName = rawData.toString().trim();
                data.renameTask(oldName, newName);
                write(messages.changedTaskName(oldName, newName));
                nextCommand();
              });
            } else {
              write(messages.taskDoesntExist(oldName));
              nextCommand();
            }
          });
        } else if (command === 'd') {
          write(messages.promptForTaskName());
          inputStream.once('data', function deleteTask(rawData) {
            var taskName = rawData.toString().trim();
            var task = data.findTask(taskName);
            if (task) {
              data.removeTask(taskName);
              write(messages.deletedTask(task.name));
              nextCommand();
            } else if (data.thereAreTasks()) {
              write(messages.taskDoesntExist(taskName));
              nextCommand();
            } else {
              write(messages.noTasksCreated(data.currentProjectName()));
              nextCommand();
            }
          });
        } else if (command === 'f') {
          write(messages.promptForTaskName());
          inputStream.once('data', function finishTask(rawData) {
            var name = rawData.toString().trim();
            var task = data.findTask(name);
            if (task) {
              data.removeTask(name);
              write(messages.finishedTask(task.name));
              nextCommand();
            } else {
              write(messages.taskNotFound(name));
              nextCommand();
            }
          });
        } else if (command === 'b') {
          data.stopEditingProject();
          nextCommand();
        } else {
          write(messages.unknownCommand(command));
          nextCommand();
        }
      } else {
        if (command === 'ls') {
          if (data.thereAreProjects()) {
            write(messages.listProjects(data.projects));
            nextCommand();
          } else {
            write(messages.listingProjectHeader());
            write(messages.noProjectsExist());
            nextCommand();
          }
        } else if (command === 'a') {
          write(messages.promptForProjectName());
          inputStream.once('data', function createProject(rawData) {
            var projectName = rawData.toString().trim();
            data.addProject(projectName);
            write(messages.createdProject(projectName));
            nextCommand();
          });
        } else if (command === 'd') {
          if (data.thereAreProjects()) {
            write(messages.promptForProjectName());
            inputStream.once('data', function deleteProjectIfExists(rawData) {
              var projectName = rawData.toString().trim();
              var project = data.findProject(projectName);
              if (project) {
                data.removeProject(projectName);
                write(messages.deletingProject(project.name));
                nextCommand();
              } else {
                write(messages.projectDoesntExist(projectName));
                nextCommand();
              }
            });
          } else {
            write(messages.noProjectsExist());
            write(messages.cantDeleteProject());
            nextCommand();
          }
        } else if (command === 'e') {
          if (data.thereAreProjects()) {
            write(messages.promptForProjectName());
            inputStream.once('data', function editProjectIfExists(rawData) {
              var projectName = rawData.toString().trim();
              var project = data.findProject(projectName);
              if (project) {
                write(messages.editingProject(project.name));
                data.startEditingProject(projectName);
              } else {
                write(messages.projectDoesntExist(projectName));
              }
              nextCommand();
            });
          } else {
            write(messages.noProjectsExist());
            write(messages.cantDeleteProject());
            nextCommand();
          }
        } else {
          write(messages.unknownCommand(command));
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


