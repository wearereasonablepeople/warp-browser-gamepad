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
});
