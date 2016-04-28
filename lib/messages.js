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
  createdTask:              createdTask,
  noTasksCreated:           noTasksCreated,
  listingTasksHeader:       listingTasksHeader,
  changedTaskName:          changedTaskName,
  taskDoesntExist:          taskDoesntExist,
  deletedTask:              deletedTask,
  taskNotFound:             taskNotFound,
  finishedTask:             finishedTask
}

function listingProjectHeader() {
  return "\x1b[38;5;40mListing projects:\x1b[0m\n";
}

function noProjectsExist() {
  return "\x1b[40;38;5;214mNo projects created\x1b[0m\n\n";
}

function promptForProjectName() {
  return "\x1b[0;3mEnter a project name:\x1b[0m";
}

function createdProject(name) {
  return "\x1b[38;5;40mCreated project:\x1b[0m '" + name + "'\n\n";
}

function cantDeleteProject() {
  return "\x1b[40;38;5;214mCan't delete a project\x1b[0m\n\n";
}

function deletingProject(name) {
  return "\x1b[38;5;40mDeleting project:\x1b[0m '" + name + "'\n\n";
}

function projectDoesntExist(name) {
  return "\x1b[40;38;5;214mProject doesn't exist: '" + name + "'\x1b[0m\n\n";
}

function editingProject(name) {
  return "\x1b[38;5;40mEditing project:\x1b[0m '" + name + "'\n\n";
}

function unknownCommand(command) {
  return "\x1b[40;38;5;214mUnknown command: '" + command + "'";
}

function promptForNewProjectName() {
  return "\x1b[0;35mEnter new project name:\x1b[0m";
}

function changedProjectName(oldName, newName) {
  return "\x1b[0;35mChanged project name from\x1b[0m '" + oldName + "' \x1b[38;5;40mto\x1b[0m '" + newName + "'\n\n\x1b[0m";
}

function changedTaskName(oldName, newName) {
  return "\x1b[0;35mChanged task name from\x1b[0m '" + oldName + "' \x1b[38;5;40mto\x1b[0m '" + newName + "'\n\n\x1b[0m"
}

function promptForTaskName() {
  return "\x1b[0;35mEnter a task name:\x1b[0m";
}

function createdTask(name) {
  return "\x1b[0;35mCreated task: '" + name + "'\n\x1b[0m";
}

function noTasksCreated(projectName) {
  return "\x1b[40;38;5;214mNo tasks created in '" + projectName + "'\x1b[0m\n\n"
}

function listingTasksHeader(projectName) {
  return "\x1b[38;5;40mListing tasks in " + projectName + ":\x1b[0m\n";
}

function taskDoesntExist(name) {
  return "\x1b[40;38;5;214mTask doesn't exist: '" + name + "'\x1b[0m\n\n";
}

function deletedTask(name) {
  return "\x1b[38;5;40mDeleted task:\x1b[0m '" + name + "'\n\n";
}

function taskNotFound(name) {
  return "\x1b[40;38;5;214mTask not found: '" + name + "'\x1b[0m\n\n";
}

function finishedTask(name) {
  return "\x1b[38;5;40mFinished task:\x1b[0m '" + name + "'!\n\n";
}
