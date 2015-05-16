// src/util/each.js
__7f75abb3ddb7e52de362111659583390 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  exports["default"] = function (items, cb) {
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
  };
  
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);

// src/registry.js
__57eea080b4aff2a6bf76004972c36a29 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = {
    objects: [],
    observers: []
  };
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);

// src/timeout.js
__439c13a17624dd43097ab55ad98d1d2b = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  // Adapted from: http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating.
  //
  // Calls the specified function using `RequestAnimationFrame` and falls back to using `setTimeout`.
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var timeout = (function () {
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
      return function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        }, timeToCall);
  
        lastTime = currTime + timeToCall;
  
        return id;
      };
    }
  })();
  
  timeout.stop = (function () {
    if (window.cancelAnimationFrame) {
      return window.cancelAnimationFrame.bind(window);
    }
  
    return function (id) {
      clearTimeout(id);
    };
  })();
  
  exports['default'] = timeout;
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/observer.js
__effaba1dbab052905b0d1a51be681709 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilEach = __7f75abb3ddb7e52de362111659583390;
  
  var _utilEach2 = _interopRequireDefault(_utilEach);
  
  var _registry = __57eea080b4aff2a6bf76004972c36a29;
  
  var _registry2 = _interopRequireDefault(_registry);
  
  var _timeout = __439c13a17624dd43097ab55ad98d1d2b;
  
  var _timeout2 = _interopRequireDefault(_timeout);
  
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
    var index = _registry2['default'].objects.indexOf(obj);
    return index === -1 ? false : _registry2['default'].observers[index];
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
  
      (0, _utilEach2['default'])(this.state, function (val, a) {
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
  
      (0, _utilEach2['default'])(this.obj, function (val, a) {
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
  
      (0, _utilEach2['default'])(this.obj, function (val, a) {
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
  
        (0, _timeout2['default'])(run);
      }
  
      this.save();
      this.timeout = (0, _timeout2['default'])(run);
  
      return this;
    },
  
    stop: function stop() {
      var that = this;
  
      _timeout2['default'].stop(this.timeout);
  
      this.state = {};
      this.timeout = false;
  
      types.forEach(function (type) {
        that.listeners[type] = [];
      });
  
      return this;
    },
  
    destroy: function destroy() {
      this.stop();
      _registry2['default'].objects.splice(_registry2['default'].objects.indexOf(this.obj), 1);
      _registry2['default'].observers.splice(_registry2['default'].observers.indexOf(this), 1);
      delete this.obj;
      return this;
    }
  };
  
  exports['default'] = Observer;
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/index.js
__6a5599fddd83accb31b8694cbce450c8 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _observer = __effaba1dbab052905b0d1a51be681709;
  
  var _observer2 = _interopRequireDefault(_observer);
  
  var _registry = __57eea080b4aff2a6bf76004972c36a29;
  
  var _registry2 = _interopRequireDefault(_registry);
  
  function witness(obj) {
    var observer = _observer2['default'].find(obj);
  
    if (!observer) {
      observer = new _observer2['default'](obj);
      _registry2['default'].objects.push(obj);
      _registry2['default'].observers.push(observer);
    }
  
    return observer;
  }
  
  exports['default'] = window.witness = witness;
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// test/unit.js
__07fe55e52ce89a74f7cb42f7cd34e00c = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _srcIndex = __6a5599fddd83accb31b8694cbce450c8;
  
  var _srcIndex2 = _interopRequireDefault(_srcIndex);
  
  var observer;
  var observed;
  
  beforeEach(function () {
    observed = {};
    observer = (0, _srcIndex2['default'])(observed);
  });
  
  afterEach(function () {
    observer.stop();
  });
  
  describe('Observing objects', function () {
    it('Should observe additions', function (done) {
      observer.on('add', function (change) {
        change.object.should.equal(observed);
        change.type.should.equal('add');
        change.name.should.equal('test');
        expect(change.oldValue).to.equal(undefined);
        change.newValue.should.equal(false);
  
        done();
      });
  
      observed.test = false;
    });
  
    it('Should observe updates', function (done) {
      observed.test = false;
  
      observer.on('update', function (change) {
        change.object.should.equal(observed);
        change.type.should.equal('update');
        change.name.should.equal('test');
        change.oldValue.should.equal(false);
        change.newValue.should.equal(true);
  
        done();
      });
  
      observed.test = true;
    });
  
    it('Should observe deletions', function (done) {
      observed.test = true;
  
      observer.on('delete', function (change) {
        change.object.should.equal(observed);
        change.type.should.equal('delete');
        change.name.should.equal('test');
        change.oldValue.should.equal(true);
        expect(change.newValue).to.equal(undefined);
  
        done();
      });
  
      delete observed.test;
    });
  
    it('Should observe any type of event', function (done) {
      observer.on('change', function (change) {
        change.object.should.equal(observed);
        change.type.should.equal('add');
        change.name.should.equal('test');
        expect(change.oldValue).to.equal(undefined);
        expect(change.newValue).to.equal(true);
  
        done();
      });
  
      observed.test = true;
    });
  
    it('Should stop listening to particular events', function (done) {
      observer.on('add', function () {
        assert(false);
        done();
      });
  
      observer.on('change', function () {
        assert(true);
        done();
      });
  
      observer.off('add');
  
      observed.test = true;
    });
  
    it('Should stop listenging to particular event handlers', function (done) {
      var handler = function handler() {
        assert(false);
        done();
      };
  
      observer.on('add', handler);
      observer.off('add', handler);
      observer.on('change', function () {
        assert(true);
        done();
      });
  
      observed.test = true;
    });
  
    it('Should stop listening on destroy', function (done) {
      observer.on('change', function () {
        assert(false);
        done();
      });
  
      observer.destroy();
  
      observed.test = true;
  
      setTimeout(function () {
        assert(true);
        done();
      }, 100);
    });
  });
  
  return module.exports;
}).call(this);