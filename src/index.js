const WarpBrowserGamepad = (function() {
  let self;

  const DEFAULT = [
    "BUTTON_0",
    "BUTTON_1",
    "BUTTON_2",
    "BUTTON_3",
    "BUTTON_4",
    "BUTTON_5",
    "BUTTON_6",
    "BUTTON_7",
    "BUTTON_8",
    "BUTTON_9",
    "BUTTON_10",
    "BUTTON_11",
    "BUTTON_12",
    "BUTTON_13",
    "BUTTON_14",
    "BUTTON_15",
    "BUTTON_16"
  ];

  const XBOX_ONE = [
    "A",
    "B",
    "X",
    "Y",
    "LB",
    "RB",
    "LT",
    "RT",
    "Start",
    "Back",
    "LS",
    "RS",
    "DPadUp",
    "DPadDown",
    "DPadLeft",
    "DPadRight"
  ];

  function WarpBrowserGamepad(
    onButtonChange = () => null,
    onAxesChange = () => null,
    onConnectionChange = () => null,
    layout = DEFAULT
  ) {
    self = this;
    self.onButtonChange = onButtonChange;
    self.onAxesChange = onAxesChange;
    self.onConnectionChange = onConnectionChange;
    self.layout = layout;
    self.scanning = false;
  }

  const createButton = (pressed, name) => ({
    name,
    pressed,
    value: pressed ? 1.0 : 0.0
  });

  const isButtonPressed = button => {
    if (typeof button === "object") {
      return button.pressed;
    }
    return button === 1.0;
  };

  const initialState = {
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

  const scan = (prevGamepadsState, nextGamepadsState) => {
    const newstate = Object.assign(
      {},
      ...Object.entries(prevGamepadsState).map(([i, { buttons, axes }]) => {
        const nextGamepad = nextGamepadsState[i];

        const newButtons = () =>
          buttons.map((prevButton, j) => {
            if (!nextGamepad) {
              return prevButton;
            }

            const nextButton = nextGamepad.buttons[j];

            const nextIsPressed = isButtonPressed(nextButton);
            const nextIsReleased = !nextIsPressed;

            const prevIsPressed = isButtonPressed(prevButton);
            const prevIsReleased = !prevIsPressed;

            if (prevIsReleased && nextIsPressed) {
              const button = createButton(true, self.layout[j]);
              self.onButtonChange(button, nextGamepad);
              return button;
            }

            if (prevIsPressed && nextIsReleased) {
              const button = createButton(false, self.layout[j]);
              self.onButtonChange(button, nextGamepad);
              return button;
            }

            return prevButton;
          });

        const newAxes = () => {
          if (!nextGamepad) {
            return axes;
          }
          const nextAxes = nextGamepad.axes;
          if (JSON.stringify(nextAxes) !== JSON.stringify(axes)) {
            self.onAxesChange(nextAxes);
            return nextAxes;
          }

          return axes;
        };

        return { [i]: { buttons: newButtons(), axes: newAxes() } };
      })
    );

    if (!self.scanning) {
      return;
    }
    requestAnimationFrame(() => scan(newstate, navigator.getGamepads()));
  };

  WarpBrowserGamepad.prototype.start = function() {
    self.scanning = true;
    scan(initialState, navigator.getGamepads());

    window.addEventListener("gamepadconnected", this.onConnectionChange);
    window.addEventListener("gamepaddisconnected", this.onConnectionChange);
  };

  WarpBrowserGamepad.prototype.stop = function() {
    self.scanning = false;

    window.removeEventListener("gamepadconnected", this.onConnectionChange);
    window.removeEventListener("gamepaddisconnected", this.onConnectionChange);
  };

  WarpBrowserGamepad.prototype.getActiveGamepads = function() {
    return Object.values(navigator.getGamepads()).filter(Boolean);
  };

  WarpBrowserGamepad.LAYOUT = {
    DEFAULT,
    XBOX_ONE
  };

  return WarpBrowserGamepad;
})();

export default WarpBrowserGamepad;
