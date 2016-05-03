var messages = {
  listProjects: listProjects,
  noProjectsCreated: noProjectsCreated,
  enterProjectName: enterProjectName,
  createdProject: createdProject,
  cantDeleteProject: cantDeleteProject,
  deletingProject: deletingProject,
  projectDoesntExist: projectDoesntExist,
  enterTaskName: enterTaskName,
  listTasks: listTasks
};

function listProjects(outputStream) {
  return "\x1b[38;5;40mListing projects:\x1b[0m\n";
}

function noProjectsCreated(outputStream) {
  return "\x1b[40;38;5;214mNo projects created\x1b[0m\n\n";
}

function enterProjectName(outputStream) {
  return "\x1b[0;3mEnter a project name:\x1b[0m";
}

function createdProject(projectName) {
  return "\x1b[38;5;40mCreated project:\x1b[0m '" + projectName + "'\n\n";
}

function cantDeleteProject() {
  return "\x1b[40;38;5;214mCan't delete a project\x1b[0m\n\n";
}

function deletingProject(projectName) {
  return "\x1b[38;5;40mDeleting project:\x1b[0m '" + projectName + "'\n\n";
}

function projectDoesntExist(projectName) {
  return "\x1b[40;38;5;214mProject doesn't exist: '" + projectName + "'\x1b[0m\n\n";
}

function enterTaskName() {
  return "\x1b[0;35mEnter a task name:\x1b[0m";
}

function listTasks(currentProject) {
  return "\x1b[38;5;40mListing tasks in " + currentProject + ":\x1b[0m\n";
}

module.exports = messages;