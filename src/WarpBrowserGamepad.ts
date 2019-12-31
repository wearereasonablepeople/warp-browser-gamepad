import { DEFAULT, XBOX_ONE } from "./layouts";

class WarpBrowserGamepad {
  onButtonChange: OnButtonChange;
  onAxesChange: OnAxesChange;
  onConnectionChange: OnConnectionChange;
  layout: Layout;
  scanning: boolean;

  constructor(
    onButtonChange: OnButtonChange,
    onAxesChange: OnAxesChange,
    onConnectionChange: OnConnectionChange,
    layout = DEFAULT
  ) {
    this.onButtonChange = onButtonChange;
    this.onAxesChange = onAxesChange;
    this.onConnectionChange = onConnectionChange;
    this.layout = layout;
    this.scanning = false;
  }

  static LAYOUT = {
    DEFAULT,
    XBOX_ONE
  };

  private createState() {
    return Array(4).fill({
      buttons: Array(DEFAULT.length).fill(this.createButton(false)),
      axes: null
    }) as Gamepad[];
  }

  private createButton(pressed: Boolean, name?: String): Button {
    return { name, pressed, value: pressed ? 1 : 0 };
  }

  private isButtonPressed(button: Button): Boolean {
    return typeof button === "object" ? button.pressed : button === 1.0;
  }

  private getButtons(nextGamepad: Gamepad | null) {
    return (prevButton: Button, buttonPosition: number) => {
      if (!nextGamepad) {
        return prevButton;
      }

      const nextButton = nextGamepad.buttons[buttonPosition];
      const nextIsPressed = this.isButtonPressed(nextButton);
      const nextIsReleased = !nextIsPressed;

      const prevIsPressed = this.isButtonPressed(prevButton);
      const prevIsReleased = !prevIsPressed;

      if (prevIsReleased && nextIsPressed) {
        const button = this.createButton(true, this.layout[buttonPosition]);
        this.onButtonChange(button, nextGamepad);
        return button;
      }

      if (prevIsPressed && nextIsReleased) {
        const button = this.createButton(false, this.layout[buttonPosition]);
        this.onButtonChange(button, nextGamepad);
        return button;
      }

      return prevButton;
    };
  }

  private getAxes(nextGamepad: Gamepad | null, prevAxes: number[]) {
    if (
      !nextGamepad ||
      JSON.stringify(nextGamepad.axes) === JSON.stringify(prevAxes)
    ) {
      return prevAxes;
    }
    const nextAxes = [...nextGamepad.axes];
    if (prevAxes !== null) {
      this.onAxesChange(nextAxes, nextGamepad);
    }
    return nextAxes;
  }

  private scan(
    prevGamepadsState: Array<Gamepad>,
    nextGamepadsState: GamepadList
  ) {
    const newstate = Object.assign(
      {},
      ...Object.entries(prevGamepadsState).map(([i, prevGamepad]) => {
        const nextGamepad = nextGamepadsState[<any>i];
        const prevAxes = prevGamepad.axes && [...prevGamepad.axes];
        const newButtons = prevGamepad.buttons.map(
          this.getButtons(nextGamepad)
        );
        const newAxes = this.getAxes(nextGamepad, prevAxes);

        return { [i]: { buttons: newButtons, axes: newAxes } };
      })
    );

    if (!this.scanning) {
      return;
    }

    requestAnimationFrame(() => this.scan(newstate, navigator.getGamepads()));
  }

  private onConnectionChangeHandler = (evt: Event) => {
    const gamepad = (evt as any) as Gamepad;
    this.onConnectionChange(gamepad);
  };

  public start() {
    this.scanning = true;
    this.scan(this.createState(), navigator.getGamepads());

    window.addEventListener("gamepadconnected", this.onConnectionChangeHandler);
    window.addEventListener(
      "gamepaddisconnected",
      this.onConnectionChangeHandler
    );
  }

  public stop() {
    this.scanning = false;

    window.removeEventListener(
      "gamepadconnected",
      this.onConnectionChangeHandler
    );
    window.removeEventListener(
      "gamepaddisconnected",
      this.onConnectionChangeHandler
    );
  }

  public getActiveGamepads() {
    return Object.values(navigator.getGamepads()).filter(Boolean);
  }
}
export default WarpBrowserGamepad;
