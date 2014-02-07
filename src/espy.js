(function() {

  'use strict';


  var objectRegistry = [];
  var observerRegistry = [];


  // Common implementation for traversing an array or object.
  function each(items, cb) {
    if (!items) {
      return;
    }

    if (items.hasOwnProperty) {
      for (var a in items) {
        if (items.hasOwnProperty(a)) {
          if (cb(items[a], a) === false) {
            return;
          }
        }
      }
    } else if (items.length) {
      for (var a = 0; a < items.length; a++) {
        if (cb(items[a], a) === false) {
          return;
        }
      }
    }
  }


  // Adapted from: http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating.
  //
  // Calls the specified function using `RequestAnimationFrame` and falls back to using `setTimeout`.
  var timeout = (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];

    if (window.requestAnimationFrame) {
      return window.requestAnimationFrame;
    }

    for (var x = 0; x < vendors.length; ++x) {
      var method = vendors[x] + 'RequestAnimationFrame';

      if (typeof window[method] === 'function') {
        return window[method];
      }
    }

    if (!window.requestAnimationFrame) {
      return function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        },  timeToCall);

        lastTime = currTime + timeToCall;

        return id;
      };
    }
  }());

  // Ends a timeout started with `timeout`.
  var timeoutEnd = (function() {
    if (window.cancelAnimationFrame) {
      return window.cancelAnimationFrame;
    }

    return function(id) {
      clearTimeout(id);
    };
  })();


  function Observer(obj) {
    this.isArray = Array.isArray(obj);
    this.obj = obj;
    this.listeners = [];
    this.timeout = false;
  };

  Observer.find = function(obj) {
    var index = objectRegistry.indexOf(obj);
    return index === -1 ? false : observerRegistry[index];
  };

  Observer.prototype = {
    constructor: Observer,

    on: function(fn) {
      if (!this.listeners.length) {
        this.start();
      }

      this.listeners.push(fn);

      return this;
    },

    off: function(fn) {
      if (fn) {
        this.listeners.splice(this.listeners.indexOf(fn), 1);
      } else {
        this.listeners = [];
      }

      if (!this.listeners.length) {
        this.stop();
      }

      return this;
    },

    notify: function(diff) {
      this.listeners.forEach(function(fn) {
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
    },

    start: function() {
      var that = this;

      this.save();
      this.timeout = timeout(run);

      function run() {
        var diff = that.diff();

        if (diff.length) {
          that.save();
          that.notify(diff);
        }

        timeout(run);
      };

      return this;
    },

    stop: function() {
      timeoutEnd(this.timeout);
      this.listeners = [];
      this.state = {};
      this.timeout = false;
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