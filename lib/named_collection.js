'use strict';

class NamedCollection {
  constructor(creator) {
    this.collection = [];
    this.creator = creator;
  }

  isEmpty() {
    return !this.collection.length;
  }

  add(name) {
    var item = new this.creator(name);
    this.collection.push(item);
    item.id = this.collection.length;
    return item;
  }

  find(nameOrId) {
    return this.findByName(nameOrId) || this.findById(nameOrId);
  }

  remove(nameOrId) {
    var found = this.find(nameOrId);
    if (!found) { return; }

    var index = this.collection.indexOf(found);
    this.collection.splice(index, 1);
    this.reorder();
    return found;
  }

  rename(nameOrId, newName) {
    var found = this.find(nameOrId);
    if (!found) { return; }
    if (this.exists(newName)) { return; }

    found.name = newName;
    return found;
  }

  exists(name) {
    console.log('exists', this.collection, name);
    return !!this.findByName(name);
  }

  map(iterator) {
    return this.collection.map(iterator);
  }

  // ----------
  // private

  findByName(name) {
    return this.collection.find(function(item) {
      return item.name === name;
    });
  }

  findById(strId) {
    return this.collection.find(function(item) {
      return item.id === parseInt(strId);
    });
  }

  reorder() {
    this.collection.forEach(function(item, index) {
      item.id = index + 1;
    });
  }
}

module.exports = NamedCollection;
