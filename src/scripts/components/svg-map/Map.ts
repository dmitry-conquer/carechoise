import Markers from "./Markers";

export default class SvgMap {
  private rootElement: HTMLElement | null = null;
  private mapElement: HTMLElement | null = null;
  private markers: Markers;
  private areas: HTMLElement[] = [];
  private label: HTMLElement | null = null;
  private config = {
    highlightColor: "#592F8A",
    breakpoint: 1024,
    labelOffset: { x: 10, y: -3 },
    mouseMoveDebounce: 3,
    shiftThreshold: 140,
  };

  constructor(markersData: MarkerData[], customConfig: Partial<{
    highlightColor: string;
    breakpoint: number;
    labelOffset: { x: number; y: number };
    mouseMoveDebounce: number;
    shiftThreshold: number;
  }> = {}) {
    this.config = { ...this.config, ...customConfig };
    this.markers = new Markers();
    
    this.rootElement = document.querySelector(".map");
    this.mapElement = this.rootElement?.querySelector(".map-svg") || null;
    this.areas = Array.from(this.rootElement?.querySelectorAll("[data-area]") || []);
    this.label = this.rootElement?.querySelector(".map-label") || null;

    if (this.rootElement && this.mapElement) {
      this.init(markersData);
    }
  }

  private init(markersData: MarkerData[]): void {
    this.fillAreas();
    this.markers.renderMarkers(markersData);
    this.bindEvents();
  }

  private fillAreas(): void {
    const keys = this.rootElement?.dataset.filledAreas;
    if (!keys) return;

    const keysArray = keys.split(",").map(key => key.trim());
    
    this.areas.forEach(area => {
      const areaId = area.getAttribute("data-area");
      if (areaId && keysArray.includes(areaId)) {
        area.setAttribute("fill", this.config.highlightColor);
      }
    });
  }

  private setLabelPosition = (e: MouseEvent): void => {
    if (!this.label || !this.mapElement) return;

    let shiftPosition = 0;
    const width = this.mapElement.offsetWidth;
    
    if (window.innerWidth <= this.config.breakpoint && width) {
      shiftPosition = e.offsetX > width / 2 ? this.config.shiftThreshold : 0;
    }

    this.label.style.top = `${e.offsetY + this.config.labelOffset.y}px`;
    this.label.style.left = `${e.offsetX + this.config.labelOffset.x - shiftPosition}px`;
  };

  private showLabel = (area: HTMLElement): void => {
    if (!this.label) return;
    
    const areaName = area.dataset.area;
    if (!areaName) return;

    this.label.style.display = "block";
    this.label.textContent = areaName;
  };

  private hideLabel = (): void => {
    if (!this.label) return;
    this.label.style.display = "none";
  };

  private bindEvents(): void {
    if (!this.mapElement) return;

    let mouseMoveTimeout: number | null = null;
    const debouncedMouseMove = (e: MouseEvent) => {
      if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout);
      }
      mouseMoveTimeout = window.setTimeout(() => {
        this.setLabelPosition(e);
      }, this.config.mouseMoveDebounce);
    };

    this.areas.forEach(area => {
      area.addEventListener("mousemove", () => this.showLabel(area));
      area.addEventListener("mouseleave", this.hideLabel);
    });

    this.mapElement.addEventListener("mousemove", debouncedMouseMove);
  }

  public destroy(): void {
    this.areas.forEach(area => {
      area.removeEventListener("mousemove", () => this.showLabel(area));
      area.removeEventListener("mouseleave", this.hideLabel);
    });

    if (this.mapElement) {
      this.mapElement.removeEventListener("mousemove", this.setLabelPosition);
    }
  }
}