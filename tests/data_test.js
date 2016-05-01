var test  = require('tape');
var Data  = require('../lib/data');

var data;

function setup() {
  data = new Data();
}

test('Data: after initialize there are no projects', function(test) {
  setup();
  test.plan(1);

  test.assert(!data.thereAreProjects());
});

test('Data: after initialize no project is being edited', function(test) {
  setup();
  test.plan(1);

  test.assert(!data.isEditingProject());
});

test('Data: creating a project', function(test) {
  setup();
  test.plan(3);

  data.addProject('Chores');

  test.assert(data.thereAreProjects());
  test.deepEqual(data.projectNames(), ['Chores']);
  test.assert(data.projectExists('Chores'));
});

test('Data: created project can be found by name or assigned id', function(test) {
  setup();
  test.plan(1);

  data.addProject('Chores');
  data.addProject('Features');
  data.addProject('Bugs');

  var projectFoundByName = data.findProject('Features');
  var projectFoundById   = data.findProject('2');
  test.equal(projectFoundByName, projectFoundById);
});

test('Data: removing a project', function(test) {
  setup();
  test.plan(3);

  data.addProject('Chores');
  data.removeProject('Chores');

  test.assert(!data.thereAreProjects());
  test.deepEqual(data.projectNames(), []);
  test.assert(!data.projectExists('Chores'));
});

test('Data: tasks are empty when there is no project being edited', function(test) {
  setup();
  test.plan(1);

  test.assert(!data.thereAreTasks());
});

test('Data: tasks are empty when there are is a project being edited, but it has no tasks', function(test) {
  setup();
  test.plan(1);

  data.addProject('Chores');
  data.startEditingProject('Chores');

  test.assert(!data.thereAreTasks());
});

test('Data: task are returned when a project is being edited and has tasks', function(test) {
  setup();
  test.plan(2);

  data.addProject('Chores');
  data.startEditingProject('Chores');
  data.addTask('iron shirts');

  test.assert(data.thereAreTasks());
  test.deepEqual(data.taskNames(), ['iron shirts']);
});

test('Data: projects that do not exist cannot be edited', function(test) {
  setup();
  test.plan(1);

  data.startEditingProject('not here');

  test.assert(!data.isEditingProject());
});

test('Data: stop editing the project works', function(test) {
  setup();
  test.plan(2);

  data.addProject('Chores');
  data.startEditingProject('Chores');
  data.addTask('iron shirts');
  data.stopEditingProject();

  test.assert(!data.isEditingProject());
  test.assert(!data.thereAreTasks());
});

test('Data: removing a task', function(test) {
  setup();
  test.plan(2);

  data.addProject('Chores');
  data.startEditingProject('Chores');
  data.addTask('iron shirts');
  data.addTask('walk dog');
  data.removeTask('iron shirts');

  test.assert(!data.taskExists('iron shirts'));
  test.deepEqual(data.taskNames(), ['walk dog']);
});

test('Data: renaming the current project', function(test) {
  setup();
  test.plan(3);

  data.addProject('Chores');
  data.startEditingProject('Chores');
  data.addTask('feed cats');
  data.addTask('cook dinner');
  data.renameCurrentProject('Household tasks');

  test.assert(data.projectExists('Household tasks'));
  test.assert(!data.projectExists('Chores'));
  test.deepEqual(data.taskNames(), ['feed cats', 'cook dinner']);
});


test('Data: rename task', function(test) {
  setup();
  test.plan(1);

  data.addProject('Chores');
  data.startEditingProject('Chores');
  data.addTask('feed cats');
  data.renameTask('feed cats', 'feed cats and puppy');

  test.deepEqual(data.taskNames(), ['feed cats and puppy']);
});

test('Data: trying to add a project again will not clear tasks', function(test) {
  setup();
  test.plan(1);

  data.addProject('Chores');
  data.startEditingProject('Chores');
  data.addTask('feed cats');

  data.stopEditingProject();

  data.addProject('Chores');
  data.startEditingProject('Chores');

  test.deepEqual(data.taskNames(), ['feed cats']);
});

test('Data: duplicating tasks by name will not work', function(test) {
  setup();
  test.plan(1);

  data.addProject('Chores');
  data.startEditingProject('Chores');
  data.addTask('feed cats');
  data.addTask('feed cats');

  test.deepEqual(data.taskNames(), ['feed cats']);
});

test('Data: currentProjectName returns the name of the current project', function(test) {
  setup();
  test.plan(1);

  data.addProject('Chores');
  data.startEditingProject('Chores');
  test.equal(data.currentProjectName(), 'Chores');
});
