// Adapted from: http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating.
//
// Calls the specified function using `RequestAnimationFrame` and falls back to using `setTimeout`.
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
      },  timeToCall);

      lastTime = currTime + timeToCall;

      return id;
    };
  }
}());

timeout.stop = (function () {
  if (window.cancelAnimationFrame) {
    return window.cancelAnimationFrame.bind(window);
  }

  return function (id) {
    clearTimeout(id);
  };
})();

export default timeout;
