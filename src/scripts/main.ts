import "../styles/style.scss";
import { Loader } from "@googlemaps/js-api-loader";
import { Header } from "./components/header";
import { Slider } from "./components/sliders";
import Sidebar from "./components/sidebar";

document.addEventListener("DOMContentLoaded", () => {
  /* Header */
  const header = new Header({});
  header.init();

  /* Sliders */
  Slider();

  /* Sidebar */
  const sidebar = new Sidebar({
    buttonId: "sidebar-button",
    sidebarId: "sidebar",
  });
  sidebar.init();

  /* AOS */
  // @ts-ignore
  AOS.init({
    duration: 800,
    once: true,
  });

  /* Google map */
  const loader = new Loader({
    apiKey: "AIzaSyBarQT_vJuw5uJhG66aCYYsjSjTXOq8th0",
    version: "weekly",
  });

  const initMap = (): void => {
    loader.importLibrary("maps").then(({ Map }) => {
      let map = new Map(document.getElementById("map") as HTMLElement, {
        center: {
          lat: 39.8283,
          lng: -98.5795,
        },
        zoom: 3,
        mapId: "3ee05f8926fee9b3",
      });
      map.data.loadGeoJson("/coords.json");
    });
    // loader.importLibrary("marker").then(({ AdvancedMarkerElement }) => {
    //   markersList.forEach(m => {
    //     const marker = new AdvancedMarkerElement({
    //       map,
    //       position: { lat: m.position.lat, lng: m.position.lng },
    //       content: buildContent(m.content),
    //       title: "TITLE",
    //     });
    //   });
    // });
  };

  initMap();
});
