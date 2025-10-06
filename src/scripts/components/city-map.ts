import { Loader } from "@googlemaps/js-api-loader";

type TypeCityMapOptions = {
  apiKey: string;
  mapId: string;
  center: { lat: number; lng: number };
  zoom: number;
  marker: { lat: number; lng: number };
};

// Google Maps implementation for city-map
export default class CityMap {
  private map: google.maps.Map | null = null;
  private mapElement: HTMLElement | null = null;
  private loader: Loader;
  private options: TypeCityMapOptions;
  constructor(options: TypeCityMapOptions) {
    this.options = options;

    this.loader = new Loader({
      apiKey: this.options.apiKey,
      version: "weekly",
      libraries: ["places", "marker"],
      language: "en",
      region: "US",
    });
    this.init();
  }

  private init(): void {
    this.initializeMap();
  }

  private async initializeMap(): Promise<void> {
    this.mapElement = document.getElementById("city-map");

    if (!this.mapElement) {
      console.error('Element with id "city-map" not found');
      return;
    }

    try {
      this.loader.importLibrary("maps").then(({ Map }) => {
        this.createMap(Map);
        this.addMarker();
      });
    } catch (error) {
      console.error("Error loading Google Maps API:", error);
    }
  }

  private createMap(Map: any): void {
    if (!this.mapElement) return;

    // Map styles
    const mapStyles: google.maps.MapTypeStyle[] = [
      {
        featureType: "administrative",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#444444",
          },
        ],
      },
      {
        featureType: "landscape",
        elementType: "all",
        stylers: [
          {
            color: "#f2f2f2",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "all",
        stylers: [
          {
            saturation: -100,
          },
          {
            lightness: 45,
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "all",
        stylers: [
          {
            visibility: "simplified",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [
          {
            color: "#d74492",
          },
          {
            visibility: "on",
          },
        ],
      },
    ];

    // Map options
    const mapOptions: google.maps.MapOptions & { mapId?: string } = {
      center: this.options.center || { lat: 40.02187836742953, lng: -75.10518936959122 },
      zoom: this.options.zoom || 13,
      styles: mapStyles,
      mapId: this.options.mapId,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      scrollwheel: false,
      draggable: true,
    };

    this.map = new Map(this.mapElement, mapOptions);
  }

  private addMarker(): void {
    if (!this.map) return;

    this.loader.importLibrary("marker").then(({ AdvancedMarkerElement }) => {
      const markerIcon: HTMLSpanElement = document.createElement("span") as HTMLSpanElement;
      markerIcon.className = "map-marker-google";
      markerIcon.title = "Office Location";

      new AdvancedMarkerElement({
        map: this.map,
        position: this.options.marker,
        content: markerIcon,
      });
    });
  }

  public getMap(): google.maps.Map | null {
    return this.map;
  }
}
