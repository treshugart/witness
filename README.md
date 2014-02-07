espy
====

Listen for changes in JavaScript objects.

Usage
-----

To observe changes, you must first get an observer:

    var observed = { test: false };
    var observer = espy(obj);

You can then listen for changes:

    observer.on(console.log);

Or not:

    observer.off(console.log);

### Additions

Adding a property:

    observed.test = false;

Would log:

    {
      object: { test: false },
      type: 'add',
      name: 'test',
      oldValue: undefined,
      newValue: false
    }

### Updates

Updating a property:

    observed.test = true;


Would log:

    {
      object: { test: true },
      type: 'add',
      name: 'test',
      oldValue: false,
      newValue: true
    }

### Deletions

Deleting a property:

    delete observed.test;

Would log:

    {
      object: {},
      type: 'delete',
      name: 'test',
      oldValue: true,
      newValue: undefined
    }
