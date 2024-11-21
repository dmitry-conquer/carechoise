import "../styles/style.scss";

import { Header } from "./components/header";

document.addEventListener("DOMContentLoaded", () => {
  const header = new Header({});
  header.init();
});
