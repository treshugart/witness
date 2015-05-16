(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.unknown = mod.exports;
  }
})(this, function (exports, module) {
  "use strict";

  module.exports = function (items, cb) {
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
});