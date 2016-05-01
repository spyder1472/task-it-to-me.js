'use strict';

var NamedCollection = require('./named_collection');

class Task {
  constructor(name) {
    this.name = name;
  }
}

class Project {
  constructor(name) {
    this.name = name;
    this.tasks = new NamedCollection(Task);
  }
}

class Data {
  constructor() {
    this.projects = {};
    this.projectCollection = new NamedCollection(Project);
    this.currentProject = null;
  }

  addProject(name) {
    if (!this.projectExists(name)) {
      this.projects[name] = [];
    }
    this.projectCollection.add(name);
  }

  removeProject(name) {
    this.projectCollection.remove(name);
    delete this.projects[name];
  }

  renameCurrentProject(newName) {
    this.projectCollection.rename(this.selectedProject.name, newName);
    var tasks = this.tasks();
    delete this.projects[this.currentProject];
    this.projects[newName] = tasks;
    this.currentProject = newName;
  }

  startEditingProject(name) {
    if (this.projectExists(name)) {
      this.selectedProject = this.projectCollection.find(name);
      this.currentProject = name;
    }
  }

  stopEditingProject() {
    this.currentProject = null;
    this.selectedProject = null;
  }

  addTask(name) {
    if (!this.isEditingProject()) { return; }
    if (this.taskExists(name))    { return; }
    this.selectedProject.tasks.add(name);
    this.tasks().push(name);
  }

  removeTask(name) {
    this.tasks().splice(this._taskLocation(name), 1);
    this.selectedProject.tasks.remove(name);
  }

  renameTask(oldName, newName) {
    var index = this._taskLocation(oldName);
    this.tasks()[index] = newName;
    this.selectedProject.tasks.rename(oldName, newName);
  }

  currentProjectName() {
    return this.selectedProject && this.selectedProject.name;
  }

  isEditingProject() {
    return !!this.selectedProject;
  }

  projectNames() {
    return this.projectCollection.map(function(project) { return project.name; });
  }

  thereAreProjects() {
    return !this.projectCollection.isEmpty();
  }

  projectExists(name) {
    return this.projectCollection.exists(name);
  }

  findProject(name) {
    return this.projectCollection.find(name);
  }

  selectedTasks() {
    if (!this.isEditingProject()) { return new NamedCollection(Task); }
    return this.selectedProject.tasks;
  }

  tasks() {
    if (!this.isEditingProject()) { return []; }
    return this.projects[this.currentProject];
  }

  thereAreTasks() {
    return !this.selectedTasks().isEmpty();
  }

  taskExists(name) {
    return this.selectedProject.tasks.exists(name);
  }

  // No longer needed
  _taskLocation(name) {
    return this.tasks().indexOf(name);
  }
}

module.exports = Data;
