var messages = require('./messages');

module.exports = function(outputStream, inputStream) {
  inputStream.resume();

  // Model layer ----------
  var currentProject;
  var projects = {};

  function projectNames() {
    return Object.keys(projects);
  }

  function thereAreProjects() {
    return !!projectNames().length;
  }

  function projectExists(name) {
    return !!projects[name]
  }

  function taskLocation(name) {
    return tasks().indexOf(name);
  }

  function taskExists(name) {
    return taskLocation(name) >= 0;
  }

  function removeTask(name) {
    tasks().splice(taskLocation(name), 1);
  }

  function createNewProject(name) {
    if (projects[name]) { return; }
    projects[name] = [];
  }

  function deleteProject(name) {
    delete projects[name];
  }

  function startEditingProject(name) {
    currentProject = name;
  }

  function stopEditingProject() {
    currentProject = undefined;
  }

  function renameCurrentProject(newName) {
    var tasks = projects[currentProject];
    delete projects[currentProject];
    projects[newName] = tasks;
    currentProject = newName;
  }

  function addTask(name) {
    tasks().push(name);
  }

  function renameTask(oldName, newName) {
    var index = taskLocation(oldName);
    tasks()[index] = newName;
  }

  function isEditingProject() {
    return !!currentProject;
  }

  function thereAreTasks() {
    return !!tasks().length;
  }

  function tasks() {
    return projects[currentProject];
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
            var oldName = currentProject;
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
            outputStream.write(messages.listTasks(currentProject, tasks()));
          } else {
            outputStream.write(messages.noTasksCreated(currentProject));
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
              outputStream.write(messages.noTasksCreated(currentProject));
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


