(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './observer', './registry'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./observer'), require('./registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.Observer, global.registry);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _observer, _registry) {
  'use strict';

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _Observer = _interopRequire(_observer);

  var _registry2 = _interopRequire(_registry);

  function witness(obj) {
    var observer = _Observer.find(obj);

    if (!observer) {
      observer = new _Observer(obj);
      _registry2.objects.push(obj);
      _registry2.observers.push(observer);
    }

    return observer;
  }

  module.exports = window.witness = witness;
});