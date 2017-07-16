(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _tetris = require('./tetris');

var _tetris2 = _interopRequireDefault(_tetris);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.querySelector('#app');
var tetris = new _tetris2.default(canvas);

},{"./tetris":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tetris = function () {
    function Tetris(canvas) {
        var _this = this;

        _classCallCheck(this, Tetris);

        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        // Loop
        var lastTime = void 0;
        var callback = function callback(millis) {
            if (lastTime) {
                // this.update((millis - lastTime) / 1000);
                _this.draw();
            }
            lastTime = millis;
            requestAnimationFrame(callback);
        };
        callback();
    }

    // Draw on canvas


    _createClass(Tetris, [{
        key: 'draw',
        value: function draw() {
            this.context.fillStyle = '#000000';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }]);

    return Tetris;
}();

exports.default = Tetris;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInRldHJpcy9zcmMvYXBwLmpzIiwidGV0cmlzL3NyYy90ZXRyaXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxJQUFNLFNBQVMsU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQWY7QUFDQSxJQUFNLFNBQVMscUJBQVcsTUFBWCxDQUFmOzs7Ozs7Ozs7Ozs7O0lDSHFCLE07QUFDakIsb0JBQVksTUFBWixFQUFvQjtBQUFBOztBQUFBOztBQUNoQixhQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0EsYUFBSyxPQUFMLEdBQWUsT0FBTyxVQUFQLENBQWtCLElBQWxCLENBQWY7O0FBRUE7QUFDQSxZQUFJLGlCQUFKO0FBQ0EsWUFBTSxXQUFXLFNBQVgsUUFBVyxDQUFDLE1BQUQsRUFBWTtBQUN6QixnQkFBSSxRQUFKLEVBQWM7QUFDVjtBQUNBLHNCQUFLLElBQUw7QUFDSDtBQUNELHVCQUFXLE1BQVg7QUFDQSxrQ0FBc0IsUUFBdEI7QUFDSCxTQVBEO0FBUUE7QUFDSDs7QUFFRDs7Ozs7K0JBQ087QUFDSCxpQkFBSyxPQUFMLENBQWEsU0FBYixHQUF5QixTQUF6QjtBQUNBLGlCQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLEVBQTRCLEtBQUssTUFBTCxDQUFZLEtBQXhDLEVBQStDLEtBQUssTUFBTCxDQUFZLE1BQTNEO0FBQ0g7Ozs7OztrQkF0QmdCLE0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFRldHJpcyBmcm9tICcuL3RldHJpcyc7XG5cbmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHAnKTtcbmNvbnN0IHRldHJpcyA9IG5ldyBUZXRyaXMoY2FudmFzKTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFRldHJpcyB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzKSB7XG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAvLyBMb29wXG4gICAgICAgIGxldCBsYXN0VGltZTtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSAobWlsbGlzKSA9PiB7XG4gICAgICAgICAgICBpZiAobGFzdFRpbWUpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLnVwZGF0ZSgobWlsbGlzIC0gbGFzdFRpbWUpIC8gMTAwMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYXN0VGltZSA9IG1pbGxpcztcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjayk7XG4gICAgICAgIH07XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuXG4gICAgLy8gRHJhdyBvbiBjYW52YXNcbiAgICBkcmF3KCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gJyMwMDAwMDAnO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgfVxufVxuIl19
