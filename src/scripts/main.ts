import "../styles/style.scss";

import { Header } from "./components/header";
import { Slider } from "./components/sliders";

document.addEventListener("DOMContentLoaded", () => {
  const header = new Header({});
  header.init();
  Slider();
});
