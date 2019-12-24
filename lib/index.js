"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var WarpBrowserGamepad = function () {
  var self = void 0;

  var DEFAULT = ["BUTTON_0", "BUTTON_1", "BUTTON_2", "BUTTON_3", "BUTTON_4", "BUTTON_5", "BUTTON_6", "BUTTON_7", "BUTTON_8", "BUTTON_9", "BUTTON_10", "BUTTON_11", "BUTTON_12", "BUTTON_13", "BUTTON_14", "BUTTON_15", "BUTTON_16"];

  var XBOX_ONE = ["A", "B", "X", "Y", "LB", "RB", "LT", "RT", "Start", "Back", "LS", "RS", "DPadUp", "DPadDown", "DPadLeft", "DPadRight"];

  function WarpBrowserGamepad() {
    var onButtonChange = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
      return null;
    };
    var onAxesChange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
      return null;
    };
    var onConnectionChange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
      return null;
    };
    var layout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT;

    self = this;
    self.onButtonChange = onButtonChange;
    self.onAxesChange = onAxesChange;
    self.onConnectionChange = onConnectionChange;
    self.layout = layout;
    self.scanning = false;
  }

  var createButton = function createButton(pressed, name) {
    return {
      name: name,
      pressed: pressed,
      value: pressed ? 1.0 : 0.0
    };
  };

  var isButtonPressed = function isButtonPressed(button) {
    if ((typeof button === "undefined" ? "undefined" : _typeof(button)) === "object") {
      return button.pressed;
    }
    return button === 1.0;
  };

  var initialState = {
    0: {
      buttons: Array(DEFAULT.length).fill(createButton(false)),
      axes: [0, 0, 0, 0]
    },
    1: {
      buttons: Array(DEFAULT.length).fill(createButton(false)),
      axes: [0, 0, 0, 0]
    },
    2: {
      buttons: Array(DEFAULT.length).fill(createButton(false)),
      axes: [0, 0, 0, 0]
    },
    3: {
      buttons: Array(DEFAULT.length).fill(createButton(false)),
      axes: [0, 0, 0, 0]
    }
  };

  var scan = function scan(prevGamepadsState, nextGamepadsState) {
    var newstate = Object.assign.apply(Object, [{}].concat(_toConsumableArray(Object.entries(prevGamepadsState).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          i = _ref2[0],
          _ref2$ = _ref2[1],
          buttons = _ref2$.buttons,
          axes = _ref2$.axes;

      var nextGamepad = nextGamepadsState[i];

      var newButtons = function newButtons() {
        return buttons.map(function (prevButton, j) {
          if (!nextGamepad) {
            return prevButton;
          }

          var nextButton = nextGamepad.buttons[j];

          var nextIsPressed = isButtonPressed(nextButton);
          var nextIsReleased = !nextIsPressed;

          var prevIsPressed = isButtonPressed(prevButton);
          var prevIsReleased = !prevIsPressed;

          if (prevIsReleased && nextIsPressed) {
            var button = createButton(true, self.layout[j]);
            self.onButtonChange(button, nextGamepad);
            return button;
          }

          if (prevIsPressed && nextIsReleased) {
            var _button = createButton(false, self.layout[j]);
            self.onButtonChange(_button, nextGamepad);
            return _button;
          }

          return prevButton;
        });
      };

      var newAxes = function newAxes() {
        if (!nextGamepad) {
          return axes;
        }
        var nextAxes = nextGamepad.axes;
        if (JSON.stringify(nextAxes) !== JSON.stringify(axes)) {
          self.onAxesChange(nextAxes);
          return nextAxes;
        }

        return axes;
      };

      return _defineProperty({}, i, { buttons: newButtons(), axes: newAxes() });
    }))));

    if (!self.scanning) {
      return;
    }
    requestAnimationFrame(function () {
      return scan(newstate, navigator.getGamepads());
    });
  };

  WarpBrowserGamepad.prototype.start = function () {
    self.scanning = true;
    scan(initialState, navigator.getGamepads());

    window.addEventListener("gamepadconnected", this.onConnectionChange);
    window.addEventListener("gamepaddisconnected", this.onConnectionChange);
  };

  WarpBrowserGamepad.prototype.stop = function () {
    self.scanning = false;

    window.removeEventListener("gamepadconnected", this.onConnectionChange);
    window.removeEventListener("gamepaddisconnected", this.onConnectionChange);
  };

  WarpBrowserGamepad.prototype.getActiveGamepads = function () {
    return Object.values(navigator.getGamepads()).filter(Boolean);
  };

  WarpBrowserGamepad.LAYOUT = {
    DEFAULT: DEFAULT,
    XBOX_ONE: XBOX_ONE
  };

  return WarpBrowserGamepad;
}();

exports.default = WarpBrowserGamepad;