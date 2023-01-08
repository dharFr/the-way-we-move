// From https://gist.github.com/paulirish/1579671/682e5c880c92b445650c4880a6bf9f3897ec1c5b

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license
(function(self) {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !self.requestAnimationFrame; ++x) {
        self.requestAnimationFrame = self[vendors[x]+'RequestAnimationFrame'];
        self.cancelAnimationFrame = self[vendors[x]+'CancelAnimationFrame']
                                   || self[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!self.requestAnimationFrame)
        self.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = self.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!self.cancelAnimationFrame)
        self.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
})(typeof self !== 'undefined' ? self : this);