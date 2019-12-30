"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layouts = require("./layouts");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var WarpBrowserGamepad =
/*#__PURE__*/
function () {
  function WarpBrowserGamepad(onButtonChange, onAxesChange, onConnectionChange) {
    var _this = this;

    var layout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _layouts.DEFAULT;

    _classCallCheck(this, WarpBrowserGamepad);

    _defineProperty(this, "onButtonChange", void 0);

    _defineProperty(this, "onAxesChange", void 0);

    _defineProperty(this, "onConnectionChange", void 0);

    _defineProperty(this, "layout", void 0);

    _defineProperty(this, "scanning", void 0);

    _defineProperty(this, "initialState", Array(4).fill({
      buttons: Array(_layouts.DEFAULT.length).fill(this.createButton(false)),
      axes: null
    }));

    _defineProperty(this, "onConnectionChangeHandler", function (evt) {
      var gamepad = evt;

      _this.onConnectionChange(gamepad);
    });

    this.onButtonChange = onButtonChange;
    this.onAxesChange = onAxesChange;
    this.onConnectionChange = onConnectionChange;
    this.layout = layout;
    this.scanning = false;
  }

  _createClass(WarpBrowserGamepad, [{
    key: "createButton",
    value: function createButton(pressed, name) {
      return {
        name: name,
        pressed: pressed,
        value: pressed ? 1 : 0
      };
    }
  }, {
    key: "isButtonPressed",
    value: function isButtonPressed(button) {
      return _typeof(button) === "object" ? button.pressed : button === 1.0;
    }
  }, {
    key: "getButtons",
    value: function getButtons(nextGamepad) {
      var _this2 = this;

      return function (prevButton, buttonPosition) {
        if (!nextGamepad) {
          return prevButton;
        }

        var nextButton = nextGamepad.buttons[buttonPosition];

        var nextIsPressed = _this2.isButtonPressed(nextButton);

        var nextIsReleased = !nextIsPressed;

        var prevIsPressed = _this2.isButtonPressed(prevButton);

        var prevIsReleased = !prevIsPressed;

        if (prevIsReleased && nextIsPressed) {
          var button = _this2.createButton(true, _this2.layout[buttonPosition]);

          _this2.onButtonChange(button, nextGamepad);

          return button;
        }

        if (prevIsPressed && nextIsReleased) {
          var _button = _this2.createButton(false, _this2.layout[buttonPosition]);

          _this2.onButtonChange(_button, nextGamepad);

          return _button;
        }

        return prevButton;
      };
    }
  }, {
    key: "getAxes",
    value: function getAxes(nextGamepad, axes) {
      if (!nextGamepad || JSON.stringify(nextGamepad.axes) === JSON.stringify(axes)) {
        return axes;
      }

      var nextAxes = _toConsumableArray(nextGamepad.axes);

      if (axes !== null) {
        this.onAxesChange(nextAxes, nextGamepad);
      }

      return nextAxes;
    }
  }, {
    key: "scan",
    value: function scan(prevGamepadsState, nextGamepadsState) {
      var _this3 = this;

      var newstate = Object.assign.apply(Object, [{}].concat(_toConsumableArray(Object.entries(prevGamepadsState).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            i = _ref2[0],
            gp = _ref2[1];

        var nextGamepad = nextGamepadsState[i];

        var axes = gp.axes && _toConsumableArray(gp.axes);

        var newButtons = gp.buttons.map(_this3.getButtons(nextGamepad));

        var newAxes = _this3.getAxes(nextGamepad, axes);

        return _defineProperty({}, i, {
          buttons: newButtons,
          axes: newAxes
        });
      }))));

      if (!this.scanning) {
        return;
      }

      requestAnimationFrame(function () {
        return _this3.scan(newstate, navigator.getGamepads());
      });
    }
  }, {
    key: "start",
    value: function start() {
      this.scanning = true;
      this.scan(this.initialState, navigator.getGamepads());
      window.addEventListener("gamepadconnected", this.onConnectionChangeHandler);
      window.addEventListener("gamepaddisconnected", this.onConnectionChangeHandler);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.scanning = false;
      window.removeEventListener("gamepadconnected", this.onConnectionChangeHandler);
      window.removeEventListener("gamepaddisconnected", this.onConnectionChangeHandler);
    }
  }, {
    key: "getActiveGamepads",
    value: function getActiveGamepads() {
      return Object.values(navigator.getGamepads()).filter(Boolean);
    }
  }]);

  return WarpBrowserGamepad;
}();

_defineProperty(WarpBrowserGamepad, "LAYOUT", {
  DEFAULT: _layouts.DEFAULT,
  XBOX_ONE: _layouts.XBOX_ONE
});

var _default = WarpBrowserGamepad;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9XYXJwQnJvd3NlckdhbWVwYWQudHMiXSwibmFtZXMiOlsiV2FycEJyb3dzZXJHYW1lcGFkIiwib25CdXR0b25DaGFuZ2UiLCJvbkF4ZXNDaGFuZ2UiLCJvbkNvbm5lY3Rpb25DaGFuZ2UiLCJsYXlvdXQiLCJERUZBVUxUIiwiQXJyYXkiLCJmaWxsIiwiYnV0dG9ucyIsImxlbmd0aCIsImNyZWF0ZUJ1dHRvbiIsImF4ZXMiLCJldnQiLCJnYW1lcGFkIiwic2Nhbm5pbmciLCJwcmVzc2VkIiwibmFtZSIsInZhbHVlIiwiYnV0dG9uIiwibmV4dEdhbWVwYWQiLCJwcmV2QnV0dG9uIiwiYnV0dG9uUG9zaXRpb24iLCJuZXh0QnV0dG9uIiwibmV4dElzUHJlc3NlZCIsImlzQnV0dG9uUHJlc3NlZCIsIm5leHRJc1JlbGVhc2VkIiwicHJldklzUHJlc3NlZCIsInByZXZJc1JlbGVhc2VkIiwiSlNPTiIsInN0cmluZ2lmeSIsIm5leHRBeGVzIiwicHJldkdhbWVwYWRzU3RhdGUiLCJuZXh0R2FtZXBhZHNTdGF0ZSIsIm5ld3N0YXRlIiwiT2JqZWN0IiwiYXNzaWduIiwiZW50cmllcyIsIm1hcCIsImkiLCJncCIsIm5ld0J1dHRvbnMiLCJnZXRCdXR0b25zIiwibmV3QXhlcyIsImdldEF4ZXMiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJzY2FuIiwibmF2aWdhdG9yIiwiZ2V0R2FtZXBhZHMiLCJpbml0aWFsU3RhdGUiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwib25Db25uZWN0aW9uQ2hhbmdlSGFuZGxlciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ2YWx1ZXMiLCJmaWx0ZXIiLCJCb29sZWFuIiwiWEJPWF9PTkUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVNQSxrQjs7O0FBWUosOEJBQ0VDLGNBREYsRUFFRUMsWUFGRixFQUdFQyxrQkFIRixFQUtFO0FBQUE7O0FBQUEsUUFEQUMs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QUFVLEtBQUtHLFlBQWYsRUFBNkJGLFNBQVMsQ0FBQ0MsV0FBVixFQUE3QjtBQUVBRSxNQUFBQSxNQUFNLENBQUNDLGdCQUFQLENBQXdCLGtCQUF4QixFQUE0QyxLQUFLQyx5QkFBakQ7QUFDQUYsTUFBQUEsTUFBTSxDQUFDQyxnQkFBUCxDQUNFLHFCQURGLEVBRUUsS0FBS0MseUJBRlA7QUFJRDs7OzJCQUVhO0FBQ1osV0FBS3JDLFFBQUwsR0FBZ0IsS0FBaEI7QUFFQW1DLE1BQUFBLE1BQU0sQ0FBQ0csbUJBQVAsQ0FDRSxrQkFERixFQUVFLEtBQUtELHlCQUZQO0FBSUFGLE1BQUFBLE1BQU0sQ0FBQ0csbUJBQVAsQ0FDRSxxQkFERixFQUVFLEtBQUtELHlCQUZQO0FBSUQ7Ozt3Q0FFMEI7QUFDekIsYUFBT2pCLE1BQU0sQ0FBQ21CLE1BQVAsQ0FBY1AsU0FBUyxDQUFDQyxXQUFWLEVBQWQsRUFBdUNPLE1BQXZDLENBQThDQyxPQUE5QyxDQUFQO0FBQ0Q7Ozs7OztnQkF2SUd2RCxrQixZQXlCWTtBQUNkSyxFQUFBQSxPQUFPLEVBQVBBLGdCQURjO0FBRWRtRCxFQUFBQSxRQUFRLEVBQVJBO0FBRmMsQzs7ZUFnSEh4RCxrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERFRkFVTFQsIFhCT1hfT05FIH0gZnJvbSBcIi4vbGF5b3V0c1wiO1xuXG5jbGFzcyBXYXJwQnJvd3NlckdhbWVwYWQge1xuICBvbkJ1dHRvbkNoYW5nZTogT25CdXR0b25DaGFuZ2U7XG4gIG9uQXhlc0NoYW5nZTogT25BeGVzQ2hhbmdlO1xuICBvbkNvbm5lY3Rpb25DaGFuZ2U6IE9uQ29ubmVjdGlvbkNoYW5nZTtcbiAgbGF5b3V0OiBMYXlvdXQ7XG4gIHNjYW5uaW5nOiBib29sZWFuO1xuXG4gIGluaXRpYWxTdGF0ZSA9IEFycmF5KDQpLmZpbGwoe1xuICAgIGJ1dHRvbnM6IEFycmF5KERFRkFVTFQubGVuZ3RoKS5maWxsKHRoaXMuY3JlYXRlQnV0dG9uKGZhbHNlKSksXG4gICAgYXhlczogbnVsbFxuICB9KSBhcyBHYW1lcGFkW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgb25CdXR0b25DaGFuZ2U6IE9uQnV0dG9uQ2hhbmdlLFxuICAgIG9uQXhlc0NoYW5nZTogT25BeGVzQ2hhbmdlLFxuICAgIG9uQ29ubmVjdGlvbkNoYW5nZTogT25Db25uZWN0aW9uQ2hhbmdlLFxuICAgIGxheW91dCA9IERFRkFVTFRcbiAgKSB7XG4gICAgdGhpcy5vbkJ1dHRvbkNoYW5nZSA9IG9uQnV0dG9uQ2hhbmdlO1xuICAgIHRoaXMub25BeGVzQ2hhbmdlID0gb25BeGVzQ2hhbmdlO1xuICAgIHRoaXMub25Db25uZWN0aW9uQ2hhbmdlID0gb25Db25uZWN0aW9uQ2hhbmdlO1xuICAgIHRoaXMubGF5b3V0ID0gbGF5b3V0O1xuICAgIHRoaXMuc2Nhbm5pbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHN0YXRpYyBMQVlPVVQgPSB7XG4gICAgREVGQVVMVCxcbiAgICBYQk9YX09ORVxuICB9O1xuXG4gIHByaXZhdGUgY3JlYXRlQnV0dG9uKHByZXNzZWQ6IEJvb2xlYW4sIG5hbWU/OiBTdHJpbmcpOiBCdXR0b24ge1xuICAgIHJldHVybiB7IG5hbWUsIHByZXNzZWQsIHZhbHVlOiBwcmVzc2VkID8gMSA6IDAgfTtcbiAgfVxuXG4gIHByaXZhdGUgaXNCdXR0b25QcmVzc2VkKGJ1dHRvbjogQnV0dG9uKTogQm9vbGVhbiB7XG4gICAgcmV0dXJuIHR5cGVvZiBidXR0b24gPT09IFwib2JqZWN0XCIgPyBidXR0b24ucHJlc3NlZCA6IGJ1dHRvbiA9PT0gMS4wO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRCdXR0b25zKG5leHRHYW1lcGFkOiBHYW1lcGFkIHwgbnVsbCkge1xuICAgIHJldHVybiAocHJldkJ1dHRvbjogQnV0dG9uLCBidXR0b25Qb3NpdGlvbjogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAoIW5leHRHYW1lcGFkKSB7XG4gICAgICAgIHJldHVybiBwcmV2QnV0dG9uO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXh0QnV0dG9uID0gbmV4dEdhbWVwYWQuYnV0dG9uc1tidXR0b25Qb3NpdGlvbl07XG4gICAgICBjb25zdCBuZXh0SXNQcmVzc2VkID0gdGhpcy5pc0J1dHRvblByZXNzZWQobmV4dEJ1dHRvbik7XG4gICAgICBjb25zdCBuZXh0SXNSZWxlYXNlZCA9ICFuZXh0SXNQcmVzc2VkO1xuXG4gICAgICBjb25zdCBwcmV2SXNQcmVzc2VkID0gdGhpcy5pc0J1dHRvblByZXNzZWQocHJldkJ1dHRvbik7XG4gICAgICBjb25zdCBwcmV2SXNSZWxlYXNlZCA9ICFwcmV2SXNQcmVzc2VkO1xuXG4gICAgICBpZiAocHJldklzUmVsZWFzZWQgJiYgbmV4dElzUHJlc3NlZCkge1xuICAgICAgICBjb25zdCBidXR0b24gPSB0aGlzLmNyZWF0ZUJ1dHRvbih0cnVlLCB0aGlzLmxheW91dFtidXR0b25Qb3NpdGlvbl0pO1xuICAgICAgICB0aGlzLm9uQnV0dG9uQ2hhbmdlKGJ1dHRvbiwgbmV4dEdhbWVwYWQpO1xuICAgICAgICByZXR1cm4gYnV0dG9uO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJldklzUHJlc3NlZCAmJiBuZXh0SXNSZWxlYXNlZCkge1xuICAgICAgICBjb25zdCBidXR0b24gPSB0aGlzLmNyZWF0ZUJ1dHRvbihmYWxzZSwgdGhpcy5sYXlvdXRbYnV0dG9uUG9zaXRpb25dKTtcbiAgICAgICAgdGhpcy5vbkJ1dHRvbkNoYW5nZShidXR0b24sIG5leHRHYW1lcGFkKTtcbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZCdXR0b247XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QXhlcyhuZXh0R2FtZXBhZDogR2FtZXBhZCB8IG51bGwsIGF4ZXM6IG51bWJlcltdKSB7XG4gICAgaWYgKFxuICAgICAgIW5leHRHYW1lcGFkIHx8XG4gICAgICBKU09OLnN0cmluZ2lmeShuZXh0R2FtZXBhZC5heGVzKSA9PT0gSlNPTi5zdHJpbmdpZnkoYXhlcylcbiAgICApIHtcbiAgICAgIHJldHVybiBheGVzO1xuICAgIH1cbiAgICBjb25zdCBuZXh0QXhlcyA9IFsuLi5uZXh0R2FtZXBhZC5heGVzXTtcbiAgICBpZiAoYXhlcyAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5vbkF4ZXNDaGFuZ2UobmV4dEF4ZXMsIG5leHRHYW1lcGFkKTtcbiAgICB9XG4gICAgcmV0dXJuIG5leHRBeGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBzY2FuKFxuICAgIHByZXZHYW1lcGFkc1N0YXRlOiBBcnJheTxHYW1lcGFkPixcbiAgICBuZXh0R2FtZXBhZHNTdGF0ZTogR2FtZXBhZExpc3RcbiAgKSB7XG4gICAgY29uc3QgbmV3c3RhdGUgPSBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICAuLi5PYmplY3QuZW50cmllcyhwcmV2R2FtZXBhZHNTdGF0ZSkubWFwKChbaSwgZ3BdKSA9PiB7XG4gICAgICAgIGNvbnN0IG5leHRHYW1lcGFkID0gbmV4dEdhbWVwYWRzU3RhdGVbPGFueT5pXTtcbiAgICAgICAgY29uc3QgYXhlcyA9IGdwLmF4ZXMgJiYgWy4uLmdwLmF4ZXNdO1xuICAgICAgICBjb25zdCBuZXdCdXR0b25zID0gZ3AuYnV0dG9ucy5tYXAodGhpcy5nZXRCdXR0b25zKG5leHRHYW1lcGFkKSk7XG4gICAgICAgIGNvbnN0IG5ld0F4ZXMgPSB0aGlzLmdldEF4ZXMobmV4dEdhbWVwYWQsIGF4ZXMpO1xuXG4gICAgICAgIHJldHVybiB7IFtpXTogeyBidXR0b25zOiBuZXdCdXR0b25zLCBheGVzOiBuZXdBeGVzIH0gfTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGlmICghdGhpcy5zY2FubmluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnNjYW4obmV3c3RhdGUsIG5hdmlnYXRvci5nZXRHYW1lcGFkcygpKSk7XG4gIH1cblxuICBwcml2YXRlIG9uQ29ubmVjdGlvbkNoYW5nZUhhbmRsZXIgPSAoZXZ0OiBFdmVudCkgPT4ge1xuICAgIGNvbnN0IGdhbWVwYWQgPSAoZXZ0IGFzIGFueSkgYXMgR2FtZXBhZDtcbiAgICB0aGlzLm9uQ29ubmVjdGlvbkNoYW5nZShnYW1lcGFkKTtcbiAgfTtcblxuICBwdWJsaWMgc3RhcnQoKSB7XG4gICAgdGhpcy5zY2FubmluZyA9IHRydWU7XG4gICAgdGhpcy5zY2FuKHRoaXMuaW5pdGlhbFN0YXRlLCBuYXZpZ2F0b3IuZ2V0R2FtZXBhZHMoKSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImdhbWVwYWRjb25uZWN0ZWRcIiwgdGhpcy5vbkNvbm5lY3Rpb25DaGFuZ2VIYW5kbGVyKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiZ2FtZXBhZGRpc2Nvbm5lY3RlZFwiLFxuICAgICAgdGhpcy5vbkNvbm5lY3Rpb25DaGFuZ2VIYW5kbGVyXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBzdG9wKCkge1xuICAgIHRoaXMuc2Nhbm5pbmcgPSBmYWxzZTtcblxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgXCJnYW1lcGFkY29ubmVjdGVkXCIsXG4gICAgICB0aGlzLm9uQ29ubmVjdGlvbkNoYW5nZUhhbmRsZXJcbiAgICApO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgXCJnYW1lcGFkZGlzY29ubmVjdGVkXCIsXG4gICAgICB0aGlzLm9uQ29ubmVjdGlvbkNoYW5nZUhhbmRsZXJcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGdldEFjdGl2ZUdhbWVwYWRzKCkge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKG5hdmlnYXRvci5nZXRHYW1lcGFkcygpKS5maWx0ZXIoQm9vbGVhbik7XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFdhcnBCcm93c2VyR2FtZXBhZDtcbiJdfQ==