var test  = require('tape');
var Data  = require('../lib/data');

var data;

function setup() {
  data = new Data();
}

test('after initialize there are no projects', function(test) {
  setup();
  test.plan(1);

  test.assert(!data.thereAreProjects());
});

test('after initialize no project is being edited', function(test) {
  setup();
  test.plan(1);

  test.assert(!data.isEditingProject());
});

test('creating a project', function(test) {
  setup();
  test.plan(3);

  data.addProject('Chores');

  test.assert(data.thereAreProjects());
  test.deepEqual(data.projectNames(), ['Chores']);
  test.assert(data.projectExists('Chores'));
});

test('removing a project', function(test) {
  setup();
  test.plan(3);

  data.addProject('Chores');
  data.removeProject('Chores');

  test.assert(!data.thereAreProjects());
  test.deepEqual(data.projectNames(), []);
  test.assert(!data.projectExists('Chores'));
});

test('tasks are empty when there is no project being edited', function(test) {
  setup();
  test.plan(2);

  test.deepEqual(data.tasks(), []);
  test.assert(!data.thereAreTasks());
});

test('tasks are empty when there are is a project being edited, but it has no tasks', function(test) {
  setup();
  test.plan(2);

  data.addProject('Chores');
  data.startEditingProject('Chores');

  test.deepEqual(data.tasks(), []);
  test.assert(!data.thereAreTasks());
});

test('task names are returned when a project is being edited and has tasks', function(test) {
  setup();
  test.plan(2);

  data.addProject('Chores');
  data.startEditingProject('Chores');
  data.addTask('iron shirts');

  test.assert(data.thereAreTasks());
  test.deepEqual(data.tasks(), ['iron shirts']);
});

test('projects that do not exist cannot be edited', function(test) {
  setup();
  test.plan(1);

  data.startEditingProject('not here');

  test.assert(!data.isEditingProject());
});

test('stop editing the project works', function(test) {
  setup();
  test.plan(2);

  data.addProject('Chores');
  data.startEditingProject('Chores');
  data.addTask('iron shirts');
  data.stopEditingProject();

  test.assert(!data.isEditingProject());
  test.deepEqual(data.tasks(), []);
});

test('removing a task', function(test) {
  setup();
  test.plan(2);

  data.addProject('Chores');
  data.startEditingProject('Chores');
  data.addTask('iron shirts');
  data.addTask('walk dog');
  data.removeTask('iron shirts');

  test.assert(!data.taskExists('iron shirts'));
  test.deepEqual(data.tasks(), ['walk dog']);
});

test('renaming the current project', function(test) {
  setup();
  test.plan(3);

  data.addProject('Chores');
  data.startEditingProject('Chores');
  data.addTask('feed cats');
  data.addTask('cook dinner');
  data.renameCurrentProject('Household tasks');

  test.assert(data.projectExists('Household tasks'));
  test.assert(!data.projectExists('Chores'));
  test.deepEqual(data.tasks(), ['feed cats', 'cook dinner']);
});


test('rename task', function(test) {
  setup();
  test.plan(1);

  data.addProject('Chores');
  data.startEditingProject('Chores');
  data.addTask('feed cats');
  data.renameTask('feed cats', 'feed cats and puppy');

  test.deepEqual(data.tasks(), ['feed cats and puppy']);
});

test('trying to add a project again will no clear tasks', function(test) {
  setup();
  test.plan(1);

  data.addProject('Chores');
  data.startEditingProject('Chores');
  data.addTask('feed cats');

  data.stopEditingProject();

  data.addProject('Chores');
  data.startEditingProject('Chores');

  test.deepEqual(data.tasks(), ['feed cats']);
});

test('duplicating tasks by name will not work', function(test) {
  setup();
  test.plan(1);

  data.addProject('Chores');
  data.startEditingProject('Chores');
  data.addTask('feed cats');
  data.addTask('feed cats');

  test.deepEqual(data.tasks(), ['feed cats']);
});
