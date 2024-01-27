import { MyStorage } from "./storage";
import htm from "htm";
import vhtml from "vhtml";
import "./style.scss";
import "normalize.css";

const html = htm.bind(vhtml);
const storage = new MyStorage();

function render() {
  Object.entries(storage.get().panels).forEach(([name, { width, height }]) => {
    document.querySelector<HTMLUListElement>("#panels")!.innerHTML = html`
      <li>
        <button class="label">[${width}x${height}] ${name}</button>
        <button class="delete">×</button>
      </li>
    ` as string;
  });
}

render();
