type OnButtonChange = (button: Button, gamepad: Gamepad) => void;
type OnAxesChange = (axes: number[], gamepad: Gamepad) => void;
type OnConnectionChange = (gamepad: Gamepad) => void;

type Layout = Array<String>;
type Button = {
  name?: String;
  pressed: Boolean;
  value: Number;
};
type GamepadList = (Gamepad | null)[];
