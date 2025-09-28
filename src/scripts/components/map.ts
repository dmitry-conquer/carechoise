import { Loader } from "@googlemaps/js-api-loader";

type TypeMarker = {
  link: {
    title: string;
    url: string;
  };
  location: {
    address: string;
    lat: string;
    lng: string;
  };
};

type TypeMapOptions = {
  el: string;
  apiKey: string;
  mapId: string;
  markerClassName: string;
  markers: TypeMarker[];
  geoJsonUrl: string;
  activeLocations: string;
  stateUrlMapping?: { [key: string]: string };
  comingSoon: string;
};

export default class Map {
  private options: TypeMapOptions;
  private mapSettings: any;
  private map: any;
  private tooltip: HTMLElement | null = null;
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

  private hasValidProperties(obj: TypeMapOptions) {
    return Object.entries(obj).every(([key, value]) => {
      if (key === 'comingSoon') {
        return value !== null && value !== undefined;
      }
      return value !== null && value !== undefined && value !== "";
    });
  }
  public init(): void {
    if (!this.hasValidProperties(this.options)) {
      console.warn("Critical data for Google Maps is missing");
      return;
    }
    this.loadMap();
    this.addListeners();
  }

  private getZoom(): number {
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

  private splitString(string: string): string[] {
    const array = string.replace(/\s/g, "").split(",");
    return array;
  }

  private createTooltip(): HTMLElement {
    const tooltip = document.createElement('div');
    tooltip.id = 'state-tooltip';
    tooltip.style.cssText = `
      pointer-events: none;
      position: fixed;
      background-color: #fff;
      border-radius: 8px;
      padding: 12px 40px;
      z-index: 20;
      box-shadow: #0000004d 0 19px 38px, #00000038 0 15px 12px;
      opacity: 0;
      transition: opacity 0.2s ease;
      white-space: nowrap;
      text-align: center;
    `;
    document.body.appendChild(tooltip);
    return tooltip;
  }

  private showTooltip(stateName: string, x: number, y: number, stateCode?: string): void {
    if (!this.tooltip) {
      this.tooltip = this.createTooltip();
    }
    
    const comingSoonStates = this.options.comingSoon ? this.splitString(this.options.comingSoon) : [];
    const isComingSoon = stateCode && comingSoonStates.length > 0 && comingSoonStates.includes(stateCode);
    
    if (isComingSoon) {
      this.tooltip.innerHTML = `
        <div style="font-weight: 700; font-size: clamp(1.125rem, .9047rem + .94vw, 1.75rem); line-height: 1.2;">
          ${stateName}
        </div>
        <div style="font-weight: 400; font-size: clamp(0.75rem, .6rem + .5vw, 1rem); margin-top: 4px; color: #666;">
          Coming Soon
        </div>
      `;
    } else {
      this.tooltip.innerHTML = `
        <div style="font-weight: 700; font-size: clamp(1.125rem, .9047rem + .94vw, 1.75rem);">
          ${stateName}
        </div>
      `;
    }
    
    this.tooltip.style.left = `${x - 10}px`;
    this.tooltip.style.top = `${y - 63}px`;
    this.tooltip.style.opacity = '1';
  }

  private hideTooltip(): void {
    if (this.tooltip) {
      this.tooltip.style.opacity = '0';
    }
  }

  private loadMap(): void {
    const loader = new Loader({
      apiKey: this.options.apiKey,
      version: "weekly",
    });
    loader.importLibrary("maps").then(({ Map }) => {
      this.map = new Map(document.getElementById("map"), this.mapSettings);
      this.map.data.loadGeoJson(this.options.geoJsonUrl);
      this.map.data.setStyle((feature: any) => {
        let color = "#F05296";
        const statesWithBlueColor = this.splitString(this.options.activeLocations);
        const isActive = statesWithBlueColor.includes(feature.getProperty("STUSPS"));
        
        if (isActive) {
          color = "#5A308B";
        }
        
        return {
          fillColor: color,
          strokeWeight: 1,
          strokeColor: "#fff",
          fillOpacity: 1,
          cursor: isActive ? "pointer" : "default",
        };
      });

      this.map.data.addListener("click", (event: any) => {
        const stateCode = event.feature.getProperty("STUSPS");
        const stateName = event.feature.getProperty("NAME");
        
        const statesWithBlueColor = this.splitString(this.options.activeLocations);
        if (statesWithBlueColor.includes(stateCode)) {
          this.handleStateClick(stateCode, stateName);
        }
      });

      this.map.data.addListener("mouseover", (event: any) => {
        const stateCode = event.feature.getProperty("STUSPS");
        const stateName = event.feature.getProperty("NAME");
        const statesWithBlueColor = this.splitString(this.options.activeLocations);
        
        if (statesWithBlueColor.includes(stateCode)) {
          this.map.data.overrideStyle(event.feature, {
            fillOpacity: 0.8,
            strokeWeight: 2,
            strokeColor: "#fff",
          });
        }
        
        // Показуємо тултіп з назвою штату для всіх штатів
        const mouseEvent = event.domEvent;
        if (mouseEvent) {
          this.showTooltip(stateName, mouseEvent.clientX, mouseEvent.clientY, stateCode);
        }
      });

      // Додаємо обробник для оновлення позиції тултіпа при русі миші
      this.map.data.addListener("mousemove", (event: any) => {
        const stateName = event.feature.getProperty("NAME");
        const stateCode = event.feature.getProperty("STUSPS");
        
        // Оновлюємо позицію тултіпа для всіх штатів, якщо тултіп видимий
        if (this.tooltip && this.tooltip.style.opacity === '1') {
          const mouseEvent = event.domEvent;
          if (mouseEvent) {
            this.showTooltip(stateName, mouseEvent.clientX, mouseEvent.clientY, stateCode);
          }
        }
      });

      this.map.data.addListener("mouseout", (event: any) => {
        const stateCode = event.feature.getProperty("STUSPS");
        const statesWithBlueColor = this.splitString(this.options.activeLocations);
        
        if (statesWithBlueColor.includes(stateCode)) {
          this.map.data.overrideStyle(event.feature, {
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#fff",
          });
        }
        
        // Приховуємо тултіп для всіх штатів
        this.hideTooltip();
      });
    });
    loader.importLibrary("marker").then(({ AdvancedMarkerElement }) => {
      const map = this.map;
      this.options.markers.forEach(marker => {
        const markerIcon: HTMLAnchorElement = document.createElement("a") as HTMLAnchorElement;
        markerIcon.className = this.options.markerClassName;
        markerIcon.href = marker.link.url;
        markerIcon.title = marker.link.title;
        new AdvancedMarkerElement({
          map,
          position: {
            lat: parseFloat(String(marker.location.lat).trim()),
            lng: parseFloat(String(marker.location.lng).trim()),
          },
          content: markerIcon,
        });
      });
    });
  }

  private addListeners(): void {
    window.addEventListener("resize", () => {
      const mapZoom = this.getZoom();
      this.map.setZoom(mapZoom);
    });
  }

  public destroy(): void {
    if (this.tooltip && this.tooltip.parentNode) {
      this.tooltip.parentNode.removeChild(this.tooltip);
      this.tooltip = null;
    }
  }

  private handleStateClick(stateCode: string, stateName: string): void {
    const stateUrlMapping: { [key: string]: string } = {
      CA: "https://carechoice.com/california/",
      TX: "https://carechoice.com/texas/",
      FL: "https://carechoice.com/florida/",
      NY: "https://carechoice.com/new-york/",
      PA: "https://carechoice.com/pennsylvania/",
      IL: "https://carechoice.com/illinois/",
      OH: "https://carechoice.com/ohio/",
      GA: "https://carechoice.com/georgia/",
      NC: "https://carechoice.com/north-carolina/",
      MI: "https://carechoice.com/michigan/",
      NJ: "https://carechoice.com/new-jersey/",
      VA: "https://carechoice.com/virginia/",
      WA: "https://carechoice.com/washington/",
      AZ: "https://carechoice.com/arizona/",
      MA: "https://carechoice.com/massachusetts/",
      TN: "https://carechoice.com/tennessee/",
      IN: "https://carechoice.com/indiana/",
      MO: "https://carechoice.com/missouri/",
      MD: "https://carechoice.com/maryland/",
      WI: "https://carechoice.com/wisconsin/",
      CO: "https://carechoice.com/colorado/",
      MN: "https://carechoice.com/minnesota/",
      SC: "https://carechoice.com/south-carolina/",
      AL: "https://carechoice.com/alabama/",
      LA: "https://carechoice.com/louisiana/",
      KY: "https://carechoice.com/kentucky/",
      OR: "https://carechoice.com/oregon/",
      OK: "https://carechoice.com/oklahoma/",
      CT: "https://carechoice.com/connecticut/",
      UT: "https://carechoice.com/utah/",
      IA: "https://carechoice.com/iowa/",
      NV: "https://carechoice.com/nevada/",
      AR: "https://carechoice.com/arkansas/",
      MS: "https://carechoice.com/mississippi/",
      KS: "https://carechoice.com/kansas/",
      NM: "https://carechoice.com/new-mexico/",
      NE: "https://carechoice.com/nebraska/",
      WV: "https://carechoice.com/west-virginia/",
      ID: "https://carechoice.com/idaho/",
      HI: "https://carechoice.com/hawaii/",
      NH: "https://carechoice.com/new-hampshire/",
      ME: "https://carechoice.com/maine/",
      RI: "https://carechoice.com/rhode-island/",
      MT: "https://carechoice.com/montana/",
      DE: "https://carechoice.com/delaware/",
      SD: "https://carechoice.com/south-dakota/",
      ND: "https://carechoice.com/north-dakota/",
      AK: "https://carechoice.com/alaska/",
      VT: "https://carechoice.com/vermont/",
      WY: "https://carechoice.com/wyoming/",
      DC: "https://carechoice.com/washington-dc/",
    };

    const urlMapping = this.options.stateUrlMapping || stateUrlMapping;
    const stateUrl = urlMapping[stateCode];

    if (stateUrl) {
      window.location.href = stateUrl;
    } else {
      const stateSlug = stateName.toLowerCase().replace(/\s+/g, "-");
      window.location.href = `https://carechoice.com/${stateSlug}/`;
    }
  }
}
