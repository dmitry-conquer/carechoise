import { Loader } from "@googlemaps/js-api-loader";

type TypeMarker = {
  lat: string | number;
  lng: string | number;
  url: string;
};

type TypeMapOptions = {
  el: string;
  apiKey: string;
  mapId: string;
  markerClassName: string;
  markers: TypeMarker[];
  geoJsonUrl: string;
  activeLocations: string[];
};

export default class Map {
  private options: TypeMapOptions;
  private mapSettings: any;
  private map: any;
  constructor(options: TypeMapOptions) {
    this.options = options;
    this.mapSettings = {
      zoom: this.getZoom(),
      center: {
        lat: 37.8283,
        lng: -95.5795,
      },
      mapTypeId: "roadmap",
      mapId: this.options.mapId,
      disableDefaultUI: true,
      gestureHandling: "none",
      keyboardShortcuts: false,
      scaleControl: false,
      backgroundColor: "transparent",
      scrollwheel: false,
    };
  }
  hasValidProperties(obj: TypeMapOptions) {
    return Object.values(obj).every(value => value !== null && value !== undefined && value !== "");
  }
  public init(): void {
    if (this.hasValidProperties(this.options)) {
      this.loadMap();
      this.addListeners();
    }
    return;
  }

  private getZoom() {
    let mapZoom;
    const foo = window.innerWidth;
    if (foo < 320) {
      mapZoom = 2;
    } else if (foo >= 320 && foo < 700) {
      mapZoom = 3;
    } else if (foo >= 700 && foo < 1440) {
      mapZoom = 4;
    } else if (foo >= 1440) {
      mapZoom = 5;
    } else {
      mapZoom = 4;
    }
    return mapZoom;
  }

  private loadMap() {
    const loader = new Loader({
      apiKey: this.options.apiKey,
      version: "weekly",
    });
    loader.importLibrary("maps").then(({ Map }) => {
      this.map = new Map(document.getElementById("map"), this.mapSettings);
      this.map.data.loadGeoJson(this.options.geoJsonUrl);
      this.map.data.setStyle((feature: any) => {
        let color = "#F05296";
        const statesWithBlueColor = this.options.activeLocations;
        if (statesWithBlueColor.includes(feature.getProperty("STUSPS"))) {
          color = "#5A308B";
        }
        return {
          fillColor: color,
          strokeWeight: 1,
          strokeColor: "#fff",
          fillOpacity: 1,
        };
      });
    });
    loader.importLibrary("marker").then(({ AdvancedMarkerElement }) => {
      const map = this.map;
      this.options.markers.forEach(marker => {
        const markerIcon: HTMLAnchorElement = document.createElement("a") as HTMLAnchorElement;
        markerIcon.className = this.options.markerClassName;
        markerIcon.href = marker.url;
        new AdvancedMarkerElement({
          map,
          position: { lat: marker.lat, lng: marker.lng },
          content: markerIcon,
        });
      });
    });
  }

  private addListeners() {
    const map = this.map;
    window.addEventListener("resize", () => {
      const mapZoom = this.getZoom();
      map.setZoom(mapZoom);
    });
  }
}
