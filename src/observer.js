import each from './util/each';
import registry from './registry';
import timeout from './timeout';

var types = ['add', 'update', 'delete', 'change'];

function Observer(obj) {
  if (typeof obj !== 'object') {
    throw new Error('Cannot observe non-object: ' + obj);
  }

  this.isArray = Array.isArray(obj);
  this.obj = obj;
  this.init();
}

Observer.find = function (obj) {
  var index = registry.objects.indexOf(obj);
  return index === -1 ? false : registry.observers[index];
};

Observer.prototype = {
  constructor: Observer,

  init: function () {
    var that = this;

    this.listeners = {};
    this.timeout = false;

    types.forEach(function (type) {
      that.listeners[type] = [];
    });

    return this;
  },

  on: function (type, fn) {
    if (!this.listening()) {
      this.start();
    }

    this.listeners[type].push(fn);

    return this;
  },

  off: function (type, fn) {
    if (fn) {
      this.listeners[type].splice(this.listeners[type].indexOf(fn), 1);
    } else {
      this.listeners[type] = [];
    }

    if (!this.listening()) {
      this.stop();
    }

    return this;
  },

  notify: function (diffs) {
    var that = this;

    diffs.forEach(function (diff) {
      that.listeners[diff.type].forEach(function (fn) {
        fn(diff);
      });

      that.listeners.change.forEach(function (fn) {
        fn(diff);
      });
    });

    return this;
  },

  diff: function () {
    var that = this;
    var diffs = [];
    var keys = Object.keys(this.obj);

    if (this.isArray && this.obj.length === this.state.length) {
      return diffs;
    }

    each(this.state, function (val, a) {
      var missing = that.isArray ?
        that.obj.indexOf(val) === -1 :
        typeof that.obj[a] === 'undefined';

      if (missing) {
        diffs.push({
          index: that.isArray ? a : keys.indexOf(a),
          name: a,
          newValue: undefined,
          object: that.obj,
          oldValue: val,
          type: 'delete'
        });
      }
    });

    each(this.obj, function (val, a) {
      var isAdd = typeof that.state[a] === 'undefined';
      var isUpdate = that.isArray ? that.obj.length === that.state.length && that.state[a] !== val : that.state[a] !== val;

      if (isAdd || isUpdate) {
        diffs.push({
          index: that.isArray ? a : keys.indexOf(a),
          name: a,
          newValue: val,
          object: that.obj,
          oldValue: typeof that.state[a] === 'undefined' ? undefined : that.state[a],
          type: typeof that.state[a] === 'undefined' ? 'add' : 'update'
        });
      }
    });

    return diffs;
  },

  save: function () {
    var that = this;

    this.state = that.isArray ? [] : {};

    each(this.obj, function (val, a) {
      that.state[a] = val;
    });

    return this;
  },

  listening: function () {
    for (var a = 0; a < types.length; a++) {
      if (this.listeners[types[a]].length) {
        return true;
      }
    }

    return false;
  },

  start: function () {
    var that = this;

    function run () {
      var diff = that.diff();

      if (diff.length) {
        that.save();
        that.notify(diff);
      }

      timeout(run);
    }

    this.save();
    this.timeout = timeout(run);

    return this;
  },

  stop: function () {
    var that = this;

    timeout.stop(this.timeout);

    this.state = {};
    this.timeout = false;

    types.forEach(function (type) {
      that.listeners[type] = [];
    });

    return this;
  },

  destroy: function () {
    this.stop();
    registry.objects.splice(registry.objects.indexOf(this.obj), 1);
    registry.observers.splice(registry.observers.indexOf(this), 1);
    delete this.obj;
    return this;
  }
};

export default Observer;
