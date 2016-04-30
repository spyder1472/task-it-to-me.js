var messages = require('./messages');
var Data     = require('./data');

module.exports = function(outputStream, inputStream) {
  inputStream.resume();

  var data = new Data();

  // command ..............
  function createNewProject(name) {
    data.addProject(name);
  }

  function deleteProject(name) {
    data.removeProject(name);
  }

  function startEditingProject(name) {
    data.startEditingProject(name);
  }

  function stopEditingProject() {
    data.stopEditingProject();
  }

  // ... commands with dependencies on queries

  function addTask(name) {
    data.addTask(name);
  }

  function removeTask(name) {
    data.removeTask(name);
  }

  function renameCurrentProject(newName) {
    data.renameCurrentProject(newName);
  }

  function renameTask(oldName, newName) {
    data.renameTask(oldName, newName);
  }

  // query ................
  function currentProject() {
    return data.currentProject;
  }

  function projectNames() {
    return data.projectNames();
  }

  function thereAreProjects() {
    return data.thereAreProjects();
  }

  function projectExists(name) {
    return data.projectExists(name);
  }

  // Not going to move over, because it is really a private method
  function taskLocation(name) {
    return tasks().indexOf(name);
  }

  function taskExists(name) {
    return data.taskExists(name);
  }

  function isEditingProject() {
    return data.isEditingProject();
  }

  function thereAreTasks() {
    return data.thereAreTasks();
  }

  function tasks() {
    return data.tasks();
  }
  // -----------------------

  function run(callback) {
    callback = callback || function noop() {};

    function nextCommand() {
      outputStream.write(menu());
      inputStream.once('data', processInput);
    }

    function menu() {
      var menu;
      if (isEditingProject()) {
        menu = messages.taskMenu();
      } else {
        menu = messages.projectMenu();
      }
      return menu;
    }

    function processInput(rawData) {
      var data = rawData.toString().trim();
      if (data === 'q') {
        return callback();
      } else if (isEditingProject()) {
        if (data === 'c') {
          outputStream.write(messages.promptForNewProjectName());
          inputStream.once('data', function changeProjectName(rawData) {
            var oldName = currentProject();
            var newName = rawData.toString().trim();
            renameCurrentProject(newName);
            outputStream.write(messages.changedProjectName(oldName, newName));
            nextCommand();
          });
        } else if (data === 'a') {
          outputStream.write(messages.promptForTaskName());
          inputStream.once('data', function addNewTask(rawData) {
            var taskName = rawData.toString().trim();
            if (taskExists(taskName)) {
              outputStream.write(messages.taskAlreadyExists(taskName));
              nextCommand();
            } else {
              addTask(taskName);
              outputStream.write(messages.createdTask(taskName));
              nextCommand();
            }
          });
        } else if (data === 'ls') {
          if (thereAreTasks()) {
            outputStream.write(messages.listTasks(currentProject(), tasks()));
          } else {
            outputStream.write(messages.noTasksCreated(currentProject()));
          }
          nextCommand();
        } else if (data === 'e') {
          outputStream.write(messages.promptForTaskName());
          inputStream.once('data', function editTaskName(rawData) {
            var oldName = rawData.toString().trim();
            if (taskExists(oldName)) {
              outputStream.write(messages.promptForNewTaskName());
              inputStream.once('data', function changeTaskName(rawData) {
                var newName = rawData.toString().trim();
                renameTask(oldName, newName);
                outputStream.write(messages.changedTaskName(oldName, newName));
                nextCommand();
              });
            } else {
              outputStream.write(messages.taskDoesntExist(oldName));
              nextCommand();
            }
          });
        } else if (data === 'd') {
          outputStream.write(messages.promptForTaskName());
          inputStream.once('data', function deleteTask(rawData) {
            var taskName = rawData.toString().trim();
            if (taskExists(taskName)) {
              removeTask(taskName);
              outputStream.write(messages.deletedTask(taskName));
              nextCommand();
            } else if (thereAreTasks()) {
              outputStream.write(messages.taskDoesntExist(taskName));
              nextCommand();
            } else {
              outputStream.write(messages.noTasksCreated(currentProject()));
              nextCommand();
            }
          });
        } else if (data === 'f') {
          outputStream.write(messages.promptForTaskName());
          inputStream.once('data', function finishTask(rawData) {
            var task = rawData.toString().trim();
            if (taskExists(task)) {
              removeTask(task);
              outputStream.write(messages.finishedTask(task));
              nextCommand();
            } else {
              outputStream.write(messages.taskNotFound(task));
              nextCommand();
            }
          });
        } else if (data === 'b') {
          stopEditingProject();
          inputStream.once('data', processInput);
        } else {
          outputStream.write(messages.unknownCommand(data));
          nextCommand();
        }
      } else {
        if (data === 'ls') {
          if (thereAreProjects()) {
            outputStream.write(messages.listProjects(projectNames()));
            nextCommand();
          } else {
            outputStream.write(messages.listingProjectHeader());
            outputStream.write(messages.noProjectsExist());
            nextCommand();
          }
        } else if (data === 'a') {
          outputStream.write(messages.promptForProjectName());
          inputStream.once('data', function createProject(rawData) {
            var projectName = rawData.toString().trim();
            createNewProject(projectName);
            outputStream.write(messages.createdProject(projectName));
            nextCommand();
          });
        } else if (data === 'd') {
          if (thereAreProjects()) {
            outputStream.write(messages.promptForProjectName());
            inputStream.once('data', function deleteProjectIfExists(rawData) {
              var projectName = rawData.toString().trim();
              if (projectExists(projectName)) {
                deleteProject(projectName);
                outputStream.write(messages.deletingProject(projectName));
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
        } else if (data === 'e') {
          if (thereAreProjects()) {
            outputStream.write(messages.promptForProjectName());
            inputStream.once('data', function editProjectIfExists(rawData) {
              var projectName = rawData.toString().trim();
              if (projectExists(projectName)) {
                outputStream.write(messages.editingProject(projectName));
                startEditingProject(projectName);
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
          outputStream.write(messages.unknownCommand(data));
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


