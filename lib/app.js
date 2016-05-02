var messages = require('./messages');
var Data     = require('./data');

module.exports = function(outputStream, inputStream) {
  inputStream.resume();

  var data = new Data();
  var write = outputStream.write.bind(outputStream);
  var read  = function(callback) {
    inputStream.once('data', function(rawInput) {
      callback(rawInput.toString().trim());
    });
  }

  function run(callback) {
    callback = callback || function noop() {};

    function nextCommand() {
      write(menu());
      read(processCommand);
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

    function processCommand(command) {
      if (command === 'q') {
        return callback();
      } else if (data.isEditingProject()) {
        if (command === 'c') {
          write(messages.promptForNewProjectName());
          read(function changeProjectName(newName) {
            var oldName = data.currentProjectName();
            data.renameCurrentProject(newName);
            write(messages.changedProjectName(oldName, newName));
            nextCommand();
          });
        } else if (command === 'a') {
          write(messages.promptForTaskName());
          read(function addNewTask(taskName) {
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
          read(function editTaskName(oldName) {
            var task = data.findTask(oldName);
            if (task) {
              oldName = task.name;
              write(messages.promptForNewTaskName());
              read(function changeTaskName(newName) {
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
          read(function deleteTask(taskName) {
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
          read(function finishTask(name) {
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
          read(function createProject(projectName) {
            data.addProject(projectName);
            write(messages.createdProject(projectName));
            nextCommand();
          });
        } else if (command === 'd') {
          if (data.thereAreProjects()) {
            write(messages.promptForProjectName());
            read(function deleteProjectIfExists(projectName) {
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
            read(function editProjectIfExists(projectName) {
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


