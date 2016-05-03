var messages = require('./messages');

module.exports = function controllers(data, write, read, nextCommand, callback) {
  this.quit = function quit() {
    return callback();
  };

  this.back = function back() {
    data.stopEditingProject();
    nextCommand();
  };

  this.unknownCommand = function unknownCommand() {
    write(messages.unknownCommand(data.command));
    nextCommand();
  };

  this.changeProject = function changeProject() {
    write(messages.promptForNewProjectName());
    read(function changeProjectName(newName) {
      var oldName = data.currentProjectName();
      data.renameCurrentProject(newName);
      write(messages.changedProjectName(oldName, newName));
      nextCommand();
    });
  };

  this.addTask = function addTask() {
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
  };

  this.listTasks = function listTasks() {
    write(messages.listTasks(data.currentProjectName(), data.tasks()));
    nextCommand();
  };

  this.editTask = function editTask() {
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
  };

  this.deleteTask = function deleteTask() {
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
  };

  this.finishTask = function finishTask() {
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
  };

  this.listProjects = function listProjects() {
    write(messages.listProjects(data.projects));
    nextCommand();
  };

  this.addProject = function addProject() {
    write(messages.promptForProjectName());
    read(function createProject(projectName) {
      data.addProject(projectName);
      write(messages.createdProject(projectName));
      nextCommand();
    });
  };

  this.deleteProject = function deleteProject() {
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
  };

  this.editProject = function editProject() {
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
  };

  return this;
};
