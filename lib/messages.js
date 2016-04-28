var formatter = require('./formatter');

module.exports = {
  listingProjectHeader:     listingProjectHeader,
  noProjectsExist:          noProjectsExist,
  promptForProjectName:     promptForProjectName,
  createdProject:           createdProject,
  cantDeleteProject:        cantDeleteProject,
  deletingProject:          deletingProject,
  projectDoesntExist:       projectDoesntExist,
  editingProject:           editingProject,
  unknownCommand:           unknownCommand,
  promptForNewProjectName:  promptForNewProjectName,
  changedProjectName:       changedProjectName,
  promptForTaskName:        promptForTaskName,
  promptForNewTaskName:     promptForNewTaskName,
  createdTask:              createdTask,
  noTasksCreated:           noTasksCreated,
  listingTasksHeader:       listingTasksHeader,
  changedTaskName:          changedTaskName,
  taskDoesntExist:          taskDoesntExist,
  deletedTask:              deletedTask,
  taskNotFound:             taskNotFound,
  finishedTask:             finishedTask,
  projectMenu:              projectMenu,
  taskMenu:                 taskMenu,
};

function listingProjectHeader() {
  return formatter.info('Listing projects') + formatter.lineBreak;
}

function noProjectsExist() {
  return formatter.alert('No projects created') + formatter.sectionBreak;
}

function promptForProjectName() {
  return formatter.prompt("Enter a project name");
}

function createdProject(name) {
  return formatter.info('Created project') + formatter.quoted(name) + formatter.sectionBreak;
}

function cantDeleteProject() {
  return formatter.alert("Can't delete a project") + formatter.sectionBreak;
}

function deletingProject(name) {
  return formatter.info('Deleting project') + formatter.quoted(name) + formatter.sectionBreak;
}

function projectDoesntExist(name) {
  return formatter.alert("Project doesn't exist: ") + formatter.quoted(name) + formatter.sectionBreak;
}

function editingProject(name) {
  return formatter.info('Editing project') + formatter.quoted(name) + formatter.sectionBreak;
}

function unknownCommand(command) {
  return formatter.alert('Unknown command: ') + formatter.quoted(command) + formatter.sectionBreak;
}

function promptForNewProjectName() {
  return formatter.prompt("Enter new project name");
}

function changedProjectName(oldName, newName) {
  return formatter.success('Changed project name from ')
    + formatter.quoted(oldName)
    + formatter.success(' to ')
    + formatter.quoted(newName)
    + formatter.sectionBreak;
}

function changedTaskName(oldName, newName) {
  return formatter.success('Changed task name from ')
    + formatter.quoted(oldName)
    + formatter.success(' to ')
    + formatter.quoted(newName)
    + formatter.sectionBreak;
}

function promptForTaskName() {
  return formatter.prompt("Enter a task name");
}

function promptForNewTaskName() {
  return formatter.prompt("Enter a new task name");
}

function createdTask(name) {
  return formatter.info('Created task') + formatter.quoted(name) + formatter.sectionBreak;
}

function noTasksCreated(projectName) {
  return formatter.alert('No tasks created in ') + formatter.quoted(projectName) + formatter.sectionBreak;
}

function listingTasksHeader(projectName) {
  return formatter.info('Listing tasks in ' + formatter.quoted(projectName)) + formatter.lineBreak;
}

function taskDoesntExist(name) {
  return formatter.alert("Task doesn't exist: " + formatter.quoted(name)) + formatter.sectionBreak;
}

function deletedTask(name) {
  return formatter.info('Deleted task') + formatter.quoted(name) + formatter.sectionBreak;
}

function taskNotFound(name) {
  return formatter.alert('Task not found: ' + formatter.quoted(name)) + formatter.sectionBreak;
}

function finishedTask(name) {
  return formatter.info('Finished task') + formatter.quoted(name) + '!' + formatter.sectionBreak;
}

function projectMenu() {
  return  "\x1b[38;5;40mWelcome to Taskitome!\n" +
          "\x1b[0;37m=============================\n\n" +
          "\x1b[0mPROJECTS MENU\n" +
          "\x1b[0;37m-----------------------------\n" +
          "\x1b[40;38;5;214mENTER A COMMAND:\x1b[0m\n" +
          "\x1b[1;37ma   \x1b[0;35mAdd a new project\n" +
          "\x1b[1;37mls  \x1b[0;35mList all project\n" +
          "\x1b[1;37md   \x1b[0;35mDelete a project\n" +
          "\x1b[1;37me   \x1b[0;35mEdit a project\n" +
          "\x1b[1;37mq   \x1b[0;35mQuit the app\x1b[0m\n\n\n";
}

function taskMenu() {
  return  "\x1b[0mTASKS MENU\n" +
          "\x1b[0;37m-----------------------------\n" +
          "\x1b[40;38;5;214mENTER A COMMAND:\x1b[0m\n" +
          "\x1b[1;37mc   \x1b[0;35mChange the project name\n" +
          "\x1b[1;37ma   \x1b[0;35mAdd a new task\n" +
          "\x1b[1;37mls  \x1b[0;35mList all tasks\n" +
          "\x1b[1;37md   \x1b[0;35mDelete a task\n" +
          "\x1b[1;37me   \x1b[0;35mEdit a task\n" +
          "\x1b[1;37mf   \x1b[0;35mFinish a task\n" +
          "\x1b[1;37mb   \x1b[0;35mBack to Projects menu\x1b[0m\n\n\n";
}
