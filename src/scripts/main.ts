import "../styles/style.scss";
import { ApiService } from "./core/ApiService";
import { Header } from "./components/header";
import { Sliders } from "./components/sliders";
import { Sidebar } from "./components/sidebar";
import AOS from "aos";
import Map from "./components/map";
import { InitModals } from "./components/modal";
import AdaptiveDOM from "./utils/AdaptiveDOM";
import SvgMap from "./components/svg-map/Map";
import AccordionCollection from "./components/accordion";
import HeaderScroll from "./header-scroll";
import CityMap from "./components/city-map";

declare const mapData: {
  markers?: MarkerData[];
  areas?: string[];
};

document.addEventListener("DOMContentLoaded", () => {
  new AdaptiveDOM();

  /* Header */
  const header = new Header();
  header?.init();

  /* Header Scroll */
  new HeaderScroll();

  /* Sliders */
  Sliders?.init();

  if (typeof mapData !== "undefined") {
    new SvgMap(mapData.markers || [], mapData.areas || []);
  }

  InitModals();

  /* Sidebar */
  const sidebar = new Sidebar({
    buttonId: "sidebar-button",
    sidebarId: "sidebar",
  });
  sidebar.init();

  /* Accordion */
  new AccordionCollection();

  /* AOS */
  AOS?.init({
    duration: 800,
    once: true,
  });

  /* City Map */
  if (document.getElementById("city-map")) {
    async function initCityMap() {
      //@ts-ignore
      const response = await ApiService.get(`${ajax_obj.ajax_url}?action=get_map_data`);
      if (response.success) {
        const acfOptions = response.data;
        const cityCoords = (document.querySelector("[data-city-coords]") as HTMLElement)?.dataset.cityCoords;
        const marker = (document.querySelector("[data-marker]") as HTMLElement)?.dataset.marker;
        const zoom = (document.querySelector("[data-zoom]") as HTMLElement)?.dataset.zoom;
        if (cityCoords && marker) {
          new CityMap({
            apiKey: acfOptions.gmapApiKey,
            mapId: "719421de39d621e5ecda6f9c",
            center: {
              lat: parseFloat(cityCoords.split(",")[0]),
              lng: parseFloat(cityCoords.split(",")[1]),
            },
            zoom: zoom ? parseInt(zoom) : 13,
            marker: {
              lat: parseFloat(marker.split(",")[0]),
              lng: parseFloat(marker.split(",")[1]),
            },
          });
        }
      }
    }

    initCityMap();
  }

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
          markerClassName: "map-marker-google",
          markers: acfOptions.gmapMarkers,
          geoJsonUrl: acfOptions.gmapCoords,
          activeLocations: acfOptions.gmapHighlightedAreas,
          comingSoon: acfOptions.gmapComingStates,
        });
        map.init();
      }
    };
    googleMap();
  }

  /* Steps Slider Z-Index Fix */
  const stepsSlides = document.querySelectorAll(".steps-slider__slide");
  let zIndex = stepsSlides.length;
  stepsSlides.forEach(slide => {
    (slide as HTMLElement).style.zIndex = zIndex.toString();
    zIndex--;
  });
});
