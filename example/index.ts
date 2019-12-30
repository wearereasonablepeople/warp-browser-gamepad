import Gamepads from "../src/WarpBrowserGamepad";

function renderLastEvent(entity: any): void {
  const element = document.querySelector("body") || { innerText: "" };
  const content = JSON.stringify(entity);

  element.innerText = content;
  console.log(entity);
  return;
}

const Instance = new Gamepads(
  renderLastEvent,
  renderLastEvent,
  renderLastEvent,
  Gamepads.LAYOUT.DEFAULT
);

Instance.start();
