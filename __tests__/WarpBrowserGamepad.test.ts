const Gamepads = require("../src/WarpBrowserGamepad").default;

describe("WarpBrowserGamepad", () => {
  describe("Static LAYOUT prop", () => {
    test("should return the two available layouts", () => {
      expect(Gamepads.LAYOUT).toEqual({
        DEFAULT: Gamepads.LAYOUT.DEFAULT,
        XBOX_ONE: Gamepads.LAYOUT.XBOX_ONE
      });
    });
  });

  describe("createState", () => {
    test("should return an empty new gamepad state", () => {
      const instance = new Gamepads();
      expect(instance.createState()).toEqual(
        Array(4).fill({
          buttons: Array(Gamepads.LAYOUT.DEFAULT.length).fill(
            instance.createButton(false)
          ),
          axes: null
        })
      );
    });
  });

  describe("createButton", () => {
    test("should return a new pressed button", () => {
      const instance = new Gamepads();
      expect(instance.createButton(true, "MyButton1")).toEqual({
        pressed: true,
        value: 1,
        name: "MyButton1"
      });
    });

    test("should return a new released button", () => {
      const instance = new Gamepads();
      expect(instance.createButton(false, "MyButton2")).toEqual({
        pressed: false,
        value: 0,
        name: "MyButton2"
      });
    });
  });

  describe("getButtons", () => {
    test("should NOT call the callback handler if the previous and current buttons are the same", () => {
      const buttonHandler = jest.fn();
      const instance = new Gamepads(buttonHandler);
      const prevGamepadState = instance.createState()[0];
      const nextGamepadState = instance.createState()[0];

      const result = prevGamepadState.buttons.map(
        instance.getButtons(nextGamepadState)
      );

      expect(result).toEqual(prevGamepadState.buttons);
      expect(buttonHandler).not.toBeCalled();
    });

    test("should call the callback handler with the different button if the previous and current buttons are NOT the same", () => {
      const buttonHandler = jest.fn();
      const instance = new Gamepads(buttonHandler);
      const prevGamepadState = instance.createState()[0];
      const nextGamepadState = instance.createState()[0];
      const newButton = instance.createButton(true, "BUTTON_1");

      nextGamepadState.buttons[1] = newButton;

      const result = prevGamepadState.buttons.map(
        instance.getButtons(nextGamepadState)
      );

      expect(result).not.toEqual(prevGamepadState.buttons);
      expect(buttonHandler).toBeCalledWith(newButton, nextGamepadState);
    });
  });

  describe("getAxes", () => {
    test("should NOT call the callback handler if the previous and current axes are the same", () => {
      const axesHandler = jest.fn();
      const instance = new Gamepads(undefined, axesHandler);

      const prevGamepadState = instance.createState()[0];
      prevGamepadState.axes = [1, 1, 0, 0];

      const nextGamepadState = instance.createState()[0];
      nextGamepadState.axes = [1, 1, 0, 0];

      const result = instance.getAxes(nextGamepadState, prevGamepadState.axes);

      expect(result).toEqual(prevGamepadState.axes);
      expect(axesHandler).not.toBeCalled();
    });

    test("should call the callback handler with the different axes if the previous and current axes are NOT the same", () => {
      const axesHandler = jest.fn();
      const instance = new Gamepads(undefined, axesHandler);

      const prevGamepadState = instance.createState()[0];
      prevGamepadState.axes = [1, 1, 0, 0];

      const nextGamepadState = instance.createState()[0];
      nextGamepadState.axes = [0, 1, 0, 1];

      const result = instance.getAxes(nextGamepadState, prevGamepadState.axes);

      expect(result).not.toEqual(prevGamepadState.axes);
      expect(axesHandler).toBeCalledWith(
        nextGamepadState.axes,
        nextGamepadState
      );
    });
  });
});
