import { Loader } from "@googlemaps/js-api-loader";

// Google Maps implementation for city-map
export default class CityMap {
  private map: google.maps.Map | null = null;
  private mapElement: HTMLElement | null = null;
  private loader: Loader;
  private options: { apiKey: string; center: { lat: number; lng: number }; zoom: number };
  constructor(options: { apiKey: string; center: { lat: number; lng: number }; zoom: number }) {
    this.options = options;

    this.loader = new Loader({
      apiKey: this.options.apiKey,
      version: "weekly",
      libraries: ["places"],
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
      // Load Google Maps API using importLibrary
      this.loader.importLibrary("maps").then(({ Map }) => {
        this.createMap(Map);
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
    const mapOptions: google.maps.MapOptions = {
      center: this.options.center || { lat: 40.02187836742953, lng: -75.10518936959122 },
      zoom: this.options.zoom || 13,
      styles: mapStyles,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      scrollwheel: true,
      draggable: true,
    };

    // Create map
    this.map = new Map(this.mapElement, mapOptions);

    // Map is now initialized and ready
    console.log("City map initialized successfully");
  }

  // Public method to get map instance (for potential future use)
  public getMap(): google.maps.Map | null {
    return this.map;
  }
}
