'use strict';

class Data {
  constructor() {
    this.projects = {};
    this.currentProject = null;
  }

  // data mutators -------
  addProject(name) {
    if (this.projectExists(name)) { return; }
    this.projects[name] = []
  }

  removeProject(name) {
    delete this.projects[name];
  }

  startEditingProject(name) {
    if (this.projectExists(name)) {
      this.currentProject = name
    }
  }

  stopEditingProject() {
    this.currentProject = null;
  }

  addTask(name) {
    if (!this.isEditingProject()) { return; }
    if (this.taskExists(name))    { return; }
    this.tasks().push(name);
  }

  removeTask(name) {
    this.tasks().splice(this._taskLocation(name), 1);
  }

  renameCurrentProject(newName) {
    var tasks = this.tasks();
    delete this.projects[this.currentProject];
    this.projects[newName] = tasks;
    this.currentProject = newName;
  }

  renameTask(oldName, newName) {
    var index = this._taskLocation(oldName);
    this.tasks()[index] = newName;
  }

  // -----------

  isEditingProject() {
    return !!this.currentProject;
  }

  projectNames() {
    return Object.keys(this.projects);
  }

  thereAreProjects() {
    return !!this.projectNames().length;
  }

  projectExists(name) {
    return !!this.projects[name];
  }

  tasks() {
    if (!this.isEditingProject()) { return []; }
    return this.projects[this.currentProject];
  }

  thereAreTasks() {
    return !!this.tasks().length;
  }

  taskExists(name) {
    return this._taskLocation(name) >= 0;
  }

  _taskLocation(name) {
    return this.tasks().indexOf(name);
  }
}

module.exports = Data;
