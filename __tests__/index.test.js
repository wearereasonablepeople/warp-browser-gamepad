const Gamepads = require("../src").default;

describe("WarpBrowserGamepad", () => {
  test("should return the two available layouts in the LAYOUt static property", () => {
    expect(Gamepads.LAYOUT).toEqual({
      DEFAULT: Gamepads.LAYOUT.DEFAULT,
      XBOX_ONE: Gamepads.LAYOUT.XBOX_ONE
    });
  });
});
