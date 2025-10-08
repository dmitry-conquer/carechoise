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
    
    // Додаємо кнопки зуму після створення карти
    this.createZoomControls();
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

  private createZoomControls(): void {
    if (!this.mapElement) return;

    // Створюємо контейнер для кнопок зуму
    const zoomContainer = document.createElement('div');
    zoomContainer.className = 'zoom-controls';
    zoomContainer.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 2px;
    `;

    // Кнопка збільшення
    const zoomInBtn = document.createElement('button');
    zoomInBtn.className = 'zoom-btn zoom-in';
    zoomInBtn.innerHTML = '+';
    zoomInBtn.style.cssText = `
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    // Кнопка зменшення
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.className = 'zoom-btn zoom-out';
    zoomOutBtn.innerHTML = '−';
    zoomOutBtn.style.cssText = `
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    // Hover ефекти
    const addHoverEffects = (btn: HTMLButtonElement) => {
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(255, 255, 255, 1)';
        btn.style.transform = 'scale(1.05)';
        btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(255, 255, 255, 0.9)';
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      });
    };

    addHoverEffects(zoomInBtn);
    addHoverEffects(zoomOutBtn);

    // Функціонал зуму
    zoomInBtn.addEventListener('click', () => {
      if (this.map) {
        const currentZoom = this.map.getZoom();
        if (currentZoom !== undefined && currentZoom < 20) {
          this.map.setZoom(currentZoom + 1);
        }
      }
    });

    zoomOutBtn.addEventListener('click', () => {
      if (this.map) {
        const currentZoom = this.map.getZoom();
        if (currentZoom !== undefined && currentZoom > 1) {
          this.map.setZoom(currentZoom - 1);
        }
      }
    });

    // Додаємо кнопки до контейнера
    zoomContainer.appendChild(zoomInBtn);
    zoomContainer.appendChild(zoomOutBtn);

    // Додаємо контейнер до карти
    this.mapElement.appendChild(zoomContainer);
  }

  public getMap(): google.maps.Map | null {
    return this.map;
  }
}
