import Gamepads from "../src";

const Instance = new Gamepads(
  console.log,
  console.log,
  console.log,
  Gamepads.LAYOUT.XBOX_ONE
);

Instance.start();

// Instance.stop();
