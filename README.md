# WARP-BROWSER-GAMEPAD
![Build status](https://github.com/wearereasonablepeople/warp-browser-gamepad/workflows/CI/badge.svg)

Easy way to use the browser native gamepad API. 
Please check the [CanIuse](https://caniuse.com/#search=getGamepads) website before using this library

## Usage

Install dependencies:

```
$ npm install @wearereasonablepeople/warp-browser-gamepad --save
```

```js
import Gamepad from 'warp-browser-gamepad';
// or
const Gamepad = require('warp-browser-gamepad').default;
```

## How to use

```ts
import Gamepad from 'warp-browser-gamepad';

const onButtonChangeHandler = (button: GamepadButton, gamepad: Gamepad) => console.log(button, gamepad);
const onAxesChangeHandler = (axes: number[], gamepad: Gamepad) => console.log(axes, gamepad);
const onConnectionChangeHandler = (gamepad: Gamepad) => console.log(gamepad);

const myGamepadInstance = new Gamepad(
  onButtonChangeHandler,
  onAxesChangeHandler,
  onConnectionChangeHandler,
  Gamepad.Layouts.XBOX_ONE
);

// Starts the event listener
myGamepadInstance.start();

// Stops the event listener
myGamepadInstance.stop();

// Returns all connected gamepads
myGamepadInstance.getActiveGamepads()

```

## Available Layouts

```js
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
```
## Development

Run the example app at [http://localhost:3000](http://localhost:3000).

Open the browser DevTools and check the `console` output for debugging.

```
$ npm start
```

Run tests and watch for code changes using [jest](https://github.com/facebook/jest):

```
$ npm test
```

Lint `src` and `test` files:

```
$ npm run lint
```
