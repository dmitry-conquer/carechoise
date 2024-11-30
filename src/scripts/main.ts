import "../styles/style.scss";
import { Header } from "./components/header";
// import { Sliders } from "./components/sliders";
import { Sidebar } from "./components/sidebar";
import AOS from "aos";
import Map from "./components/map";

document.addEventListener("DOMContentLoaded", () => {
  /* Header */
  const header = new Header();
  header?.init();

  /* Sliders */
  // Sliders?.init();

  /* Sidebar */
  const sidebar = new Sidebar({
    buttonId: "sidebar-button",
    sidebarId: "sidebar",
  });
  sidebar.init();

  /* AOS */
  AOS?.init({
    duration: 800,
    once: true,
  });

  /* Map */
  const map = new Map({
    el: "map",
    apiKey: "AIzaSyBarQT_vJuw5uJhG66aCYYsjSjTXOq8th0",
    mapId: "3ee05f8926fee9b3",
    markerClassName: "map-marker",
    markers: [
      { lat: 40.084206193952376, lng: -75.1407551317014, url: "https://mediacomponents.com/" },
      { lat: 25.944275682078526, lng: -80.17338424561383, url: "https://mediacomponents.com/" },
    ],
    geoJsonUrl: "/coords.json",
    activeLocations: ["PA", "FL"],
  });
  map.init();
});
