import "../styles/style.scss";
import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: "AIzaSyDNBm9IzPPWXQChddi7x6ydLA-AaIk1bks",
  version: "weekly",
});
const NEW_ZEALAND_BOUNDS = {
  north: -34.36,
  south: -47.35,
  west: 166.28,
  east: -175.81,
};

const initMap = (): void => {
  let map: google.maps.Map;
  let markers;
  loader.importLibrary("maps").then(({ Map }) => {
    new Map(document.getElementById("map") as HTMLElement, {
      center: { lat: -36.90443961071846, lng: 174.80091317429236 },
      restriction: {
        latLngBounds: NEW_ZEALAND_BOUNDS,
        strictBounds: true,
      },
      zoom: 7,
      mapId: "4504f8b37365c3d0",
    });
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

const app = (): void => {
  initMap();
};

document.addEventListener("DOMContentLoaded", app);
