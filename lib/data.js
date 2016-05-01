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
    this.projects = new NamedCollection(Project);
  }

  addProject(name) {
    this.projects.add(name);
  }

  removeProject(name) {
    this.projects.remove(name);
  }

  renameCurrentProject(newName) {
    this.projects.rename(this.selectedProject.name, newName);
  }

  startEditingProject(name) {
    if (this.projectExists(name)) {
      this.selectedProject = this.projects.find(name);
    }
  }

  stopEditingProject() {
    this.selectedProject = null;
  }

  addTask(name) {
    if (!this.isEditingProject()) { return; }
    if (this.taskExists(name))    { return; }
    this.selectedProject.tasks.add(name);
  }

  removeTask(name) {
    this.tasks().remove(name);
  }

  renameTask(oldName, newName) {
    this.tasks().rename(oldName, newName);
  }

  currentProjectName() {
    return this.selectedProject && this.selectedProject.name;
  }

  isEditingProject() {
    return !!this.selectedProject;
  }

  projectNames() {
    return this.projects.map(function(project) { return project.name; });
  }

  thereAreProjects() {
    return !this.projects.isEmpty();
  }

  projectExists(name) {
    return this.projects.exists(name);
  }

  findProject(name) {
    return this.projects.find(name);
  }

  tasks() {
    if (!this.isEditingProject()) { return new NamedCollection(Task); }
    return this.selectedProject.tasks;
  }

  taskNames() {
    return this.tasks().map(function(task) {
      return task.name
    });
  }

  thereAreTasks() {
    return !this.tasks().isEmpty();
  }

  taskExists(name) {
    return this.tasks().exists(name);
  }
}

module.exports = Data;
