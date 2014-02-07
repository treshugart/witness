(function() {

  'use strict';


  var objectRegistry = [];
  var observerRegistry = [];


  function Observer(obj) {
    var that = this;

    this.isArray = isArray(obj);
    this.obj = obj;
    this.listeners = [];

    that.save();
    timeout(run);

    function run() {
      var diff = that.diff();

      if (diff.length) {
        that.save();
        that.notify(diff);
      }

      timeout(run);
    };
  };

  Observer.find = function(obj) {
    var index = objectRegistry.indexOf(obj);
    return index === -1 ? false : observerRegistry[index];
  };

  Observer.prototype = {
    constructor: Observer,

    on: function(fn) {
      this.listeners.push(fn);
      return this;
    },

    off: function(fn) {
      this.listeners.splice(this.listeners.indexOf(fn), 1);
      return this;
    },

    notify: function(diff) {
      each(this.listeners, function(fn) {
        fn(diff);
      });
      return this;
    },

    diff: function() {
      var that = this;
      var diffs = [];
      var a = 0;

      if (this.isArray && this.obj.length === this.state.length) {
        return diffs;
      }

      each(this.state, function(val, a) {
        var missing = that.isArray
          ? that.obj.indexOf(val) === -1
          : typeof that.obj[a] === 'undefined';

        if (missing) {
          diffs.push({
            object: that.obj,
            type: 'delete',
            name: a,
            oldValue: val,
            newValue: undefined
          });
        }
      });

      each(this.obj, function(val, a) {
        var isAdd = that.isArray ? that.state.indexOf(val) === -1 : typeof that.state[a] === 'undefined';
        var isUpdate = that.isArray ? that.obj.length === that.state.length && that.state[a] !== val : that.state[a] !== val;

        if (isAdd || isUpdate) {
          diffs.push({
            object: that.obj,
            type: typeof that.state[a] === 'undefined' ? 'add' : 'update',
            name: a,
            oldValue: typeof that.state[a] === 'undefined' ? undefined : that.state[a],
            newValue: val
          });
        }
      });

      return diffs;
    },

    save: function() {
      var that = this;

      this.state = that.isArray ? [] : {};

      each(this.obj, function(val, a) {
        that.state[a] = val;
      });

      return this;
    }
  };


  function espy(obj) {
    var observer = Observer.find(obj);

    if (!observer) {
      observer = new Observer(obj);
      objectRegistry.push(obj);
      observerRegistry.push(observer);
    }

    return observer;
  };


  if (typeof define === 'function' && define.amd) {
    define('espy', espy);
  } else {
    window.espy = espy;
  }

})();