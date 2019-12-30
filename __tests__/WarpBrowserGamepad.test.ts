const Gamepads = require("../src/WarpBrowserGamepad").default;

describe("WarpBrowserGamepad", () => {
  test("should return the two available layouts in the LAYOUT static property", () => {
    expect(Gamepads.LAYOUT).toEqual({
      DEFAULT: Gamepads.LAYOUT.DEFAULT,
      XBOX_ONE: Gamepads.LAYOUT.XBOX_ONE
    });
  });
});
