import "../styles/style.scss";
import { ApiService } from "./core/ApiService";
import { Header } from "./components/header";
import { Sliders } from "./components/sliders";
import { Sidebar } from "./components/sidebar";
import AOS from "aos";
import Map from "./components/map";

document.addEventListener("DOMContentLoaded", () => {
  /* Header */
  const header = new Header();
  header?.init();

  /* Sliders */
  Sliders?.init();

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

  if (document.getElementById("map")) {
    const googleMap = async () => {
      //@ts-ignore
      const response = await ApiService.get(`${ajax_obj.ajax_url}?action=get_map_data`);
      if (response.success) {
        const acfOptions = response.data;
        const map = new Map({
          el: "map",
          apiKey: acfOptions.gmapApiKey,
          mapId: acfOptions.gmapId,
          markerClassName: "map-marker",
          markers: acfOptions.gmapMarkers,
          geoJsonUrl: acfOptions.gmapCoords,
          activeLocations: acfOptions.gmapHighlightedAreas,
        });
        map.init();
      }
    };
    googleMap();
  }
});
