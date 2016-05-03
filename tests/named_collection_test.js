'use strict';

var test              = require('tape');
var NamedCollection   = require('../lib/named_collection');

var collection;

function setup(creatorClass) {
  creatorClass = creatorClass || Thing;
  collection = new NamedCollection(creatorClass);
}

function Thing(name) {
  this.name = name;
  this.foo = 'bar';
}

test('NamedCollection it starts as empty', function(test) {
  setup();
  test.plan(1);

  test.assert(collection.isEmpty());
});

test('NamedCollection uses the passed in creator class to build new things', function(test) {
  function Thang(name) {
    this.name = name;
    this.thang = true;
  }
  setup(Thang);

  test.plan(3);

  var thing = collection.add('Newest Thing');

  test.assert(thing.name, 'Newest Thing');
  test.assert(thing.thang, true);
  test.assert(!collection.isEmpty());
});

test('NamedCollection sets up consecutive ids on the items as it adds them', function(test) {
  setup();

  test.plan(2);

  var things = [];
  things.push(collection.add('one'));
  things.push(collection.add('two'));

  test.assert(things[0].id, 1);
  test.assert(things[1].id, 2);
});

test('NamedCollection finds by name', function(test) {
  setup();

  test.plan(2);

  var things = [];
  things.push(collection.add('two'));
  things.push(collection.add('one'));

  test.assert(collection.find('one'), things[1]);
  test.assert(collection.find('two'), things[0]);
});

test('NamedCollection finds by string version of id', function(test) {
  setup();

  test.plan(2);

  var things = [];
  things.push(collection.add('one'));
  things.push(collection.add('two'));

  test.assert(collection.find('2'), things[1]);
  test.assert(collection.find('1'), things[0]);
});

test('NamedCollection removes an item by name', function(test) {
  setup();

  test.plan(1);

  collection.add('weed garden');
  collection.add('walk cats');
  collection.add('walk dog');

  collection.remove('walk cats');

  test.assert(!collection.exists('walk cats'));
});

test('NamedCollection removes an item by id', function(test) {
  setup();

  test.plan(1);

  collection.add('weed garden');
  collection.add('walk cats');
  collection.add('walk dog');

  collection.remove('2');

  test.assert(!collection.exists('walk cats'));
});

test('NamedCollection resets ids when removing an item', function(test) {
  setup();

  test.plan(2)

  collection.add('weed garden');
  collection.add('walk cats');
  collection.add('walk dog');

  collection.remove('2');

  test.assert(collection.find('1').name, 'weed garden');
  test.assert(collection.find('2').name, 'walk dog');
});

test('NamedCollection renames items', function(test) {
  setup();

  test.plan(2);

  collection.add('weed garden');
  collection.add('walk cats');

  collection.rename('walk cats', 'walk dog');

  test.assert(!collection.exists('walk cats'));
  test.assert(collection.find('2').name, 'walk dog');
});

test('NamedCollection does not allow renaming to an existing name', function(test) {
  setup();

  test.plan(2);

  collection.add('weed garden');
  collection.add('walk cats');
  collection.add('walk dog');

  collection.rename('walk cats', 'walk dog');

  test.assert(collection.exists('walk cats'));
  test.assert(collection.find('walk dog').id, 3);
});

test('NamedCollection map is delegated to the array', function(test) {
  setup();

  test.plan(1);

  collection.add('weed garden');
  collection.add('walk cats');
  collection.add('walk dog');

  var names = collection.map(function(item) {
    return item.name;
  });
  test.deepEqual(names, ['weed garden', 'walk cats', 'walk dog']);
});
