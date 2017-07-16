(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _pong = require('./pong');

var _pong2 = _interopRequireDefault(_pong);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.querySelector('#app');
var pong = new _pong2.default(canvas);

// Mouse mvt for player 1
canvas.addEventListener('mousemove', function (event) {
    var scale = event.offsetY / event.target.getBoundingClientRect().height;
    pong.players[0].pos.y = canvas.height * scale;
});

// Click to start
canvas.addEventListener('click', function () {
    pong.start();
});

},{"./pong":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _shapes = require('./shapes');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pong = function () {
    function Pong(canvas) {
        var _this = this;

        _classCallCheck(this, Pong);

        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.accumulator = 0;
        this.step = 1 / 120;

        this.ball = new _shapes.Ball();

        // Init players
        this.players = [new _shapes.Player(), new _shapes.Player()];
        this.players[0].pos.x = 40;
        this.players[1].pos.x = this.canvas.width - 40;
        this.players.forEach(function (player) {
            player.pos.y = _this.canvas.height / 2;
        });

        // Loop
        var lastTime = void 0;
        var callback = function callback(millis) {
            if (lastTime) {
                _this.update((millis - lastTime) / 1000);
                _this.draw();
            }
            lastTime = millis;
            requestAnimationFrame(callback);
        };
        callback();

        // Score chars
        this.CHARS = ['111101101101111', '010010010010010', '111001111100111', '111001111001111', '101101111001001', '111100111001111', '111100111101111', '111001001001001', '111101111101111', '111101111001111'].map(function (str) {
            var canvasTmp = document.createElement('canvas');
            canvasTmp.height = 50;
            canvasTmp.width = 30;
            var context = canvasTmp.getContext('2d');
            context.fillStyle = '#ffffff';
            str.split('').forEach(function (fill, i) {
                if (fill === '1') {
                    context.fillRect(i % 3 * 10, (i / 3 | 0) * 10, 10, 10);
                }
            });
            return canvasTmp;
        });

        this.reset();
    }

    // Check collision


    _createClass(Pong, [{
        key: 'collide',
        value: function collide(player, ball) {
            if (player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {
                ball.vel.x = -ball.vel.x * 1.05;
                ball.vel.y = (ball.pos.y - player.pos.y) * 3.5;
            }
        }

        // Draw on canvas

    }, {
        key: 'draw',
        value: function draw() {
            var _this2 = this;

            this.context.fillStyle = '#000000';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawNet();

            this.drawRect(this.ball);
            this.players.forEach(function (player) {
                return _this2.drawRect(player);
            });

            this.drawScore();
        }

        // Draw the net

    }, {
        key: 'drawNet',
        value: function drawNet() {
            this.context.fillStyle = '#ffffff';
            for (var i = -10; i < this.canvas.height; i += 40) {
                this.context.fillRect(this.canvas.width / 2 - 1, i, 2, 20);
            }
        }

        // Draw ball and players

    }, {
        key: 'drawRect',
        value: function drawRect(rect) {
            this.context.fillStyle = '#ffffff';
            this.context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
        }

        // Draw score

    }, {
        key: 'drawScore',
        value: function drawScore() {
            var _this3 = this;

            var align = this.canvas.width / 3;
            this.players.forEach(function (player, i) {
                var chars = player.score.toString().split('');
                var offset = align * (i + 1) - 40 * chars.length / 2 + 10 / 2;
                chars.forEach(function (char, pos) {
                    _this3.context.drawImage(_this3.CHARS[char | 0], offset + pos * 40, 20);
                });
            });
        }

        // Reset ball to center if a player win

    }, {
        key: 'reset',
        value: function reset() {
            this.ball.pos.x = this.canvas.width / 2;
            this.ball.pos.y = this.canvas.height / 2;

            this.ball.vel.x = 0;
            this.ball.vel.y = 0;
        }

        // Init velocity for ball

    }, {
        key: 'start',
        value: function start() {
            if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
                this.ball.vel.x = 200 * (Math.random() > 0.5 ? 1 : -1);
                this.ball.vel.y = 200 * Math.random();
            }
        }

        // Calculate movements

    }, {
        key: 'simulate',
        value: function simulate(dt) {
            var _this4 = this;

            // Move ball
            this.ball.pos.x += this.ball.vel.x * dt;
            this.ball.pos.y += this.ball.vel.y * dt;

            // Check if player win
            if (this.ball.left < 0 || this.ball.right > this.canvas.width) {
                var playerId = this.ball.vel.x < 0 | 0;
                this.players[playerId].score += 1;
                this.reset();
            }

            // Bounce on top and bottom
            if (this.ball.top < 0 || this.ball.bottom > this.canvas.height) {
                this.ball.vel.y *= -1;
            }

            // Basic AI
            if (this.ball.pos.y < this.players[1].bottom - 20) {
                this.players[1].pos.y -= 1;
            }
            if (this.ball.pos.y > this.players[1].top + 20) {
                this.players[1].pos.y += 1;
            }

            // Check ball collision with player
            this.players.forEach(function (player) {
                return _this4.collide(player, _this4.ball);
            });
        }

        // Safe update method with constant dt

    }, {
        key: 'update',
        value: function update(dt) {
            this.accumulator += dt;
            while (this.accumulator > this.step) {
                this.simulate(this.step);
                this.accumulator -= this.step;
            }
        }
    }]);

    return Pong;
}();

exports.default = Pong;

},{"./shapes":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vec = exports.Vec = function Vec() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Vec);

    this.x = x;
    this.y = y;
};

var Rect = exports.Rect = function () {
    function Rect(width, height) {
        _classCallCheck(this, Rect);

        this.pos = new Vec();
        this.size = new Vec(width, height);
    }

    _createClass(Rect, [{
        key: "top",
        get: function get() {
            return this.pos.y - this.size.y / 2;
        }
    }, {
        key: "left",
        get: function get() {
            return this.pos.x - this.size.x / 2;
        }
    }, {
        key: "bottom",
        get: function get() {
            return this.pos.y + this.size.y / 2;
        }
    }, {
        key: "right",
        get: function get() {
            return this.pos.x + this.size.x / 2;
        }
    }]);

    return Rect;
}();

var Ball = exports.Ball = function (_Rect) {
    _inherits(Ball, _Rect);

    function Ball() {
        _classCallCheck(this, Ball);

        var _this = _possibleConstructorReturn(this, (Ball.__proto__ || Object.getPrototypeOf(Ball)).call(this, 10, 10));

        _this.vel = new Vec();
        return _this;
    }

    return Ball;
}(Rect);

var Player = exports.Player = function (_Rect2) {
    _inherits(Player, _Rect2);

    function Player() {
        _classCallCheck(this, Player);

        var _this2 = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, 10, 80));

        _this2.score = 0;
        return _this2;
    }

    return Player;
}(Rect);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInBvbmcvc3JjL2FwcC5qcyIsInBvbmcvc3JjL3BvbmcuanMiLCJwb25nL3NyYy9zaGFwZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxJQUFNLFNBQVMsU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQWY7QUFDQSxJQUFNLE9BQU8sbUJBQVMsTUFBVCxDQUFiOztBQUVBO0FBQ0EsT0FBTyxnQkFBUCxDQUF3QixXQUF4QixFQUFxQyxVQUFDLEtBQUQsRUFBVztBQUM1QyxRQUFNLFFBQVEsTUFBTSxPQUFOLEdBQWdCLE1BQU0sTUFBTixDQUFhLHFCQUFiLEdBQXFDLE1BQW5FO0FBQ0EsU0FBSyxPQUFMLENBQWEsQ0FBYixFQUFnQixHQUFoQixDQUFvQixDQUFwQixHQUF3QixPQUFPLE1BQVAsR0FBZ0IsS0FBeEM7QUFDSCxDQUhEOztBQUtBO0FBQ0EsT0FBTyxnQkFBUCxDQUF3QixPQUF4QixFQUFpQyxZQUFNO0FBQ25DLFNBQUssS0FBTDtBQUNILENBRkQ7Ozs7Ozs7Ozs7O0FDWkE7Ozs7SUFFcUIsSTtBQUNqQixrQkFBWSxNQUFaLEVBQW9CO0FBQUE7O0FBQUE7O0FBQ2hCLGFBQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxhQUFLLE9BQUwsR0FBZSxPQUFPLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBZjs7QUFFQSxhQUFLLFdBQUwsR0FBbUIsQ0FBbkI7QUFDQSxhQUFLLElBQUwsR0FBWSxJQUFJLEdBQWhCOztBQUVBLGFBQUssSUFBTCxHQUFZLGtCQUFaOztBQUVBO0FBQ0EsYUFBSyxPQUFMLEdBQWUsQ0FDWCxvQkFEVyxFQUVYLG9CQUZXLENBQWY7QUFJQSxhQUFLLE9BQUwsQ0FBYSxDQUFiLEVBQWdCLEdBQWhCLENBQW9CLENBQXBCLEdBQXdCLEVBQXhCO0FB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O0FBQ0EsU0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNILEM7O0lBR1EsSSxXQUFBLEk7QUFDVCxrQkFBWSxLQUFaLEVBQW1CLE1BQW5CLEVBQTJCO0FBQUE7O0FBQ3ZCLGFBQUssR0FBTCxHQUFXLElBQUksR0FBSixFQUFYO0FBQ0EsYUFBSyxJQUFMLEdBQVksSUFBSSxHQUFKLENBQVEsS0FBUixFQUFlLE1BQWYsQ0FBWjtBQUNIOzs7OzRCQUVTO0FBQ04sbUJBQU8sS0FBSyxHQUFMLENBQVMsQ0FBVCxHQUFjLEtBQUssSUFBTCxDQUFVLENBQVYsR0FBYyxDQUFuQztBQUNIOzs7NEJBRVU7QUFDUCxtQkFBTyxLQUFLLEdBQUwsQ0FBUyxDQUFULEdBQWMsS0FBSyxJQUFMLENBQVUsQ0FBVixHQUFjLENBQW5DO0FBQ0g7Ozs0QkFFWTtBQUNULG1CQUFPLEtBQUssR0FBTCxDQUFTLENBQVQsR0FBYyxLQUFLLElBQUwsQ0FBVSxDQUFWLEdBQWMsQ0FBbkM7QUFDSDs7OzRCQUVXO0FBQ1IsbUJBQU8sS0FBSyxHQUFMLENBQVMsQ0FBVCxHQUFjLEtBQUssSUFBTCxDQUFVLENBQVYsR0FBYyxDQUFuQztBQUNIOzs7Ozs7SUFHUSxJLFdBQUEsSTs7O0FBQ1Qsb0JBQWM7QUFBQTs7QUFBQSxnSEFDSixFQURJLEVBQ0EsRUFEQTs7QUFFVixjQUFLLEdBQUwsR0FBVyxJQUFJLEdBQUosRUFBWDtBQUZVO0FBR2I7OztFQUpxQixJOztJQU9iLE0sV0FBQSxNOzs7QUFDVCxzQkFBYztBQUFBOztBQUFBLHFIQUNKLEVBREksRUFDQSxFQURBOztBQUVWLGVBQUssS0FBTCxHQUFhLENBQWI7QUFGVTtBQUdiOzs7RUFKdUIsSSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUG9uZyBmcm9tICcuL3BvbmcnO1xuXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwJyk7XG5jb25zdCBwb25nID0gbmV3IFBvbmcoY2FudmFzKTtcblxuLy8gTW91c2UgbXZ0IGZvciBwbGF5ZXIgMVxuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IHNjYWxlID0gZXZlbnQub2Zmc2V0WSAvIGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgcG9uZy5wbGF5ZXJzWzBdLnBvcy55ID0gY2FudmFzLmhlaWdodCAqIHNjYWxlO1xufSk7XG5cbi8vIENsaWNrIHRvIHN0YXJ0XG5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgcG9uZy5zdGFydCgpO1xufSk7XG4iLCJpbXBvcnQgeyBCYWxsLCBQbGF5ZXIgfSBmcm9tICcuL3NoYXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvbmcge1xuICAgIGNvbnN0cnVjdG9yKGNhbnZhcykge1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgdGhpcy5hY2N1bXVsYXRvciA9IDA7XG4gICAgICAgIHRoaXMuc3RlcCA9IDEgLyAxMjA7XG5cbiAgICAgICAgdGhpcy5iYWxsID0gbmV3IEJhbGwoKTtcblxuICAgICAgICAvLyBJbml0IHBsYXllcnNcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW1xuICAgICAgICAgICAgbmV3IFBsYXllcigpLFxuICAgICAgICAgICAgbmV3IFBsYXllcigpLFxuICAgICAgICBdO1xuICAgICAgICB0aGlzLnBsYXllcnNbMF0ucG9zLnggPSA0MDtcbiAgICAgICAgdGhpcy5wbGF5ZXJzWzFdLnBvcy54ID0gdGhpcy5jYW52YXMud2lkdGggLSA0MDtcbiAgICAgICAgdGhpcy5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgICAgICAgcGxheWVyLnBvcy55ID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gMjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTG9vcFxuICAgICAgICBsZXQgbGFzdFRpbWU7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gKG1pbGxpcykgPT4ge1xuICAgICAgICAgICAgaWYgKGxhc3RUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKG1pbGxpcyAtIGxhc3RUaW1lKSAvIDEwMDApO1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGFzdFRpbWUgPSBtaWxsaXM7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgICBjYWxsYmFjaygpO1xuXG4gICAgICAgIC8vIFNjb3JlIGNoYXJzXG4gICAgICAgIHRoaXMuQ0hBUlMgPSBbXG4gICAgICAgICAgICAnMTExMTAxMTAxMTAxMTExJyxcbiAgICAgICAgICAgICcwMTAwMTAwMTAwMTAwMTAnLFxuICAgICAgICAgICAgJzExMTAwMTExMTEwMDExMScsXG4gICAgICAgICAgICAnMTExMDAxMTExMDAxMTExJyxcbiAgICAgICAgICAgICcxMDExMDExMTEwMDEwMDEnLFxuICAgICAgICAgICAgJzExMTEwMDExMTAwMTExMScsXG4gICAgICAgICAgICAnMTExMTAwMTExMTAxMTExJyxcbiAgICAgICAgICAgICcxMTEwMDEwMDEwMDEwMDEnLFxuICAgICAgICAgICAgJzExMTEwMTExMTEwMTExMScsXG4gICAgICAgICAgICAnMTExMTAxMTExMDAxMTExJyxcbiAgICAgICAgXS5tYXAoKHN0cikgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2FudmFzVG1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICBjYW52YXNUbXAuaGVpZ2h0ID0gNTA7XG4gICAgICAgICAgICBjYW52YXNUbXAud2lkdGggPSAzMDtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXNUbXAuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyNmZmZmZmYnO1xuICAgICAgICAgICAgc3RyLnNwbGl0KCcnKS5mb3JFYWNoKChmaWxsLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGwgPT09ICcxJykge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KCgoaSAlIDMpICogMTApLCAoaSAvIDMgfCAwKSAqIDEwLCAxMCwgMTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGNhbnZhc1RtcDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGNvbGxpc2lvblxuICAgIGNvbGxpZGUocGxheWVyLCBiYWxsKSB7XG4gICAgICAgIGlmIChwbGF5ZXIubGVmdCA8IGJhbGwucmlnaHQgJiYgcGxheWVyLnJpZ2h0ID4gYmFsbC5sZWZ0ICYmXG4gICAgICAgICAgICBwbGF5ZXIudG9wIDwgYmFsbC5ib3R0b20gJiYgcGxheWVyLmJvdHRvbSA+IGJhbGwudG9wKSB7XG4gICAgICAgICAgICBiYWxsLnZlbC54ID0gLWJhbGwudmVsLnggKiAxLjA1O1xuICAgICAgICAgICAgYmFsbC52ZWwueSA9IChiYWxsLnBvcy55IC0gcGxheWVyLnBvcy55KSAqIDMuNTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIERyYXcgb24gY2FudmFzXG4gICAgZHJhdygpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwMDAwJztcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXG4gICAgICAgIHRoaXMuZHJhd05ldCgpO1xuXG4gICAgICAgIHRoaXMuZHJhd1JlY3QodGhpcy5iYWxsKTtcbiAgICAgICAgdGhpcy5wbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHRoaXMuZHJhd1JlY3QocGxheWVyKSk7XG5cbiAgICAgICAgdGhpcy5kcmF3U2NvcmUoKTtcbiAgICB9XG5cbiAgICAvLyBEcmF3IHRoZSBuZXRcbiAgICBkcmF3TmV0KCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gJyNmZmZmZmYnO1xuICAgICAgICBmb3IgKGxldCBpID0gLTEwOyBpIDwgdGhpcy5jYW52YXMuaGVpZ2h0OyBpICs9IDQwKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoKHRoaXMuY2FudmFzLndpZHRoIC8gMikgLSAxLCBpLCAyLCAyMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBEcmF3IGJhbGwgYW5kIHBsYXllcnNcbiAgICBkcmF3UmVjdChyZWN0KSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAnI2ZmZmZmZic7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdChyZWN0LmxlZnQsIHJlY3QudG9wLCByZWN0LnNpemUueCwgcmVjdC5zaXplLnkpO1xuICAgIH1cblxuICAgIC8vIERyYXcgc2NvcmVcbiAgICBkcmF3U2NvcmUoKSB7XG4gICAgICAgIGNvbnN0IGFsaWduID0gdGhpcy5jYW52YXMud2lkdGggLyAzO1xuICAgICAgICB0aGlzLnBsYXllcnMuZm9yRWFjaCgocGxheWVyLCBpKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjaGFycyA9IHBsYXllci5zY29yZS50b1N0cmluZygpLnNwbGl0KCcnKTtcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9ICgoYWxpZ24gKiAoaSArIDEpKSAtICgoNDAgKiBjaGFycy5sZW5ndGgpIC8gMikpICsgKDEwIC8gMik7XG4gICAgICAgICAgICBjaGFycy5mb3JFYWNoKChjaGFyLCBwb3MpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMuQ0hBUlNbY2hhciB8IDBdLCBvZmZzZXQgKyAocG9zICogNDApLCAyMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgYmFsbCB0byBjZW50ZXIgaWYgYSBwbGF5ZXIgd2luXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuYmFsbC5wb3MueCA9IHRoaXMuY2FudmFzLndpZHRoIC8gMjtcbiAgICAgICAgdGhpcy5iYWxsLnBvcy55ID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gMjtcblxuICAgICAgICB0aGlzLmJhbGwudmVsLnggPSAwO1xuICAgICAgICB0aGlzLmJhbGwudmVsLnkgPSAwO1xuICAgIH1cblxuICAgIC8vIEluaXQgdmVsb2NpdHkgZm9yIGJhbGxcbiAgICBzdGFydCgpIHtcbiAgICAgICAgaWYgKHRoaXMuYmFsbC52ZWwueCA9PT0gMCAmJiB0aGlzLmJhbGwudmVsLnkgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuYmFsbC52ZWwueCA9IDIwMCAqIChNYXRoLnJhbmRvbSgpID4gMC41ID8gMSA6IC0xKTtcbiAgICAgICAgICAgIHRoaXMuYmFsbC52ZWwueSA9IDIwMCAqIE1hdGgucmFuZG9tKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDYWxjdWxhdGUgbW92ZW1lbnRzXG4gICAgc2ltdWxhdGUoZHQpIHtcbiAgICAgICAgLy8gTW92ZSBiYWxsXG4gICAgICAgIHRoaXMuYmFsbC5wb3MueCArPSB0aGlzLmJhbGwudmVsLnggKiBkdDtcbiAgICAgICAgdGhpcy5iYWxsLnBvcy55ICs9IHRoaXMuYmFsbC52ZWwueSAqIGR0O1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHBsYXllciB3aW5cbiAgICAgICAgaWYgKHRoaXMuYmFsbC5sZWZ0IDwgMCB8fCB0aGlzLmJhbGwucmlnaHQgPiB0aGlzLmNhbnZhcy53aWR0aCkge1xuICAgICAgICAgICAgY29uc3QgcGxheWVySWQgPSB0aGlzLmJhbGwudmVsLnggPCAwIHwgMDtcbiAgICAgICAgICAgIHRoaXMucGxheWVyc1twbGF5ZXJJZF0uc2NvcmUgKz0gMTtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJvdW5jZSBvbiB0b3AgYW5kIGJvdHRvbVxuICAgICAgICBpZiAodGhpcy5iYWxsLnRvcCA8IDAgfHwgdGhpcy5iYWxsLmJvdHRvbSA+IHRoaXMuY2FudmFzLmhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy5iYWxsLnZlbC55ICo9IC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmFzaWMgQUlcbiAgICAgICAgaWYgKHRoaXMuYmFsbC5wb3MueSA8IHRoaXMucGxheWVyc1sxXS5ib3R0b20gLSAyMCkge1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzWzFdLnBvcy55IC09IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYmFsbC5wb3MueSA+IHRoaXMucGxheWVyc1sxXS50b3AgKyAyMCkge1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzWzFdLnBvcy55ICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBiYWxsIGNvbGxpc2lvbiB3aXRoIHBsYXllclxuICAgICAgICB0aGlzLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4gdGhpcy5jb2xsaWRlKHBsYXllciwgdGhpcy5iYWxsKSk7XG4gICAgfVxuXG4gICAgLy8gU2FmZSB1cGRhdGUgbWV0aG9kIHdpdGggY29uc3RhbnQgZHRcbiAgICB1cGRhdGUoZHQpIHtcbiAgICAgICAgdGhpcy5hY2N1bXVsYXRvciArPSBkdDtcbiAgICAgICAgd2hpbGUgKHRoaXMuYWNjdW11bGF0b3IgPiB0aGlzLnN0ZXApIHtcbiAgICAgICAgICAgIHRoaXMuc2ltdWxhdGUodGhpcy5zdGVwKTtcbiAgICAgICAgICAgIHRoaXMuYWNjdW11bGF0b3IgLT0gdGhpcy5zdGVwO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZlYyB7XG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUmVjdCB7XG4gICAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xuICAgICAgICB0aGlzLnBvcyA9IG5ldyBWZWMoKTtcbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFZlYyh3aWR0aCwgaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBnZXQgdG9wKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MueSAtICh0aGlzLnNpemUueSAvIDIpO1xuICAgIH1cblxuICAgIGdldCBsZWZ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MueCAtICh0aGlzLnNpemUueCAvIDIpO1xuICAgIH1cblxuICAgIGdldCBib3R0b20oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcy55ICsgKHRoaXMuc2l6ZS55IC8gMik7XG4gICAgfVxuXG4gICAgZ2V0IHJpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MueCArICh0aGlzLnNpemUueCAvIDIpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJhbGwgZXh0ZW5kcyBSZWN0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoMTAsIDEwKTtcbiAgICAgICAgdGhpcy52ZWwgPSBuZXcgVmVjKCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGxheWVyIGV4dGVuZHMgUmVjdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKDEwLCA4MCk7XG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgIH1cbn1cbiJdfQ==
