(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './util/each', './registry', './timeout'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./util/each'), require('./registry'), require('./timeout'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.each, global.registry, global.timeout);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilEach, _registry, _timeout) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _each = _interopRequire(_utilEach);

  var _registry2 = _interopRequire(_registry);

  var _timeout2 = _interopRequire(_timeout);

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
    var index = _registry2.objects.indexOf(obj);
    return index === -1 ? false : _registry2.observers[index];
  };

  Observer.prototype = {
    constructor: Observer,

    init: function init() {
      var that = this;

      this.listeners = {};
      this.timeout = false;

      types.forEach(function (type) {
        that.listeners[type] = [];
      });

      return this;
    },

    on: function on(type, fn) {
      if (!this.listening()) {
        this.start();
      }

      this.listeners[type].push(fn);

      return this;
    },

    off: function off(type, fn) {
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

    notify: function notify(diffs) {
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

    diff: function diff() {
      var that = this;
      var diffs = [];
      var keys = Object.keys(this.obj);

      if (this.isArray && this.obj.length === this.state.length) {
        return diffs;
      }

      (0, _each)(this.state, function (val, a) {
        var missing = that.isArray ? that.obj.indexOf(val) === -1 : typeof that.obj[a] === 'undefined';

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

      (0, _each)(this.obj, function (val, a) {
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

    save: function save() {
      var that = this;

      this.state = that.isArray ? [] : {};

      (0, _each)(this.obj, function (val, a) {
        that.state[a] = val;
      });

      return this;
    },

    listening: function listening() {
      for (var a = 0; a < types.length; a++) {
        if (this.listeners[types[a]].length) {
          return true;
        }
      }

      return false;
    },

    start: function start() {
      var that = this;

      function run() {
        var diff = that.diff();

        if (diff.length) {
          that.save();
          that.notify(diff);
        }

        (0, _timeout2)(run);
      }

      this.save();
      this.timeout = (0, _timeout2)(run);

      return this;
    },

    stop: function stop() {
      var that = this;

      _timeout2.stop(this.timeout);

      this.state = {};
      this.timeout = false;

      types.forEach(function (type) {
        that.listeners[type] = [];
      });

      return this;
    },

    destroy: function destroy() {
      this.stop();
      _registry2.objects.splice(_registry2.objects.indexOf(this.obj), 1);
      _registry2.observers.splice(_registry2.observers.indexOf(this), 1);
      delete this.obj;
      return this;
    }
  };

  module.exports = Observer;
});