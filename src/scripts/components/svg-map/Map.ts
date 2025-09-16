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
    labelOffset: { x: 20, y: -63 },
    mouseMoveDebounce: 3,
    shiftThreshold: 140,
  };

  constructor(
    markersData: MarkerData[],
    areasData: string[],
    customConfig: Partial<{
      highlightColor: string;
      breakpoint: number;
      labelOffset: { x: number; y: number };
      mouseMoveDebounce: number;
      shiftThreshold: number;
    }> = {}
  ) {
    this.config = { ...this.config, ...customConfig };
    this.markers = new Markers();

    this.rootElement = document.querySelector(".svg-map");
    this.mapElement = this.rootElement?.querySelector(".map-svg") || null;
    this.areas = Array.from(this.rootElement?.querySelectorAll("[data-area]") || []);
    this.label = this.rootElement?.querySelector(".map-label") || null;

    if (this.rootElement && this.mapElement) {
      this.init(markersData, areasData);
    }
  }

  private init(markersData: MarkerData[], areasData: string[]): void {
    this.fillAreas(areasData);
    this.markers.renderMarkers(markersData);
    this.bindEvents();
  }

  private fillAreas(areasData: string[]): void {
    if (!areasData) return;

    this.areas.forEach(area => {
      const areaId = area.getAttribute("data-area");
      if (areaId && areasData.includes(areaId)) {
        area.setAttribute("fill", this.config.highlightColor);
      }
    });
  }

  private setLabelPosition = (e: MouseEvent): void => {
    if (!this.label || !this.mapElement) return;

    let shiftPosition = 0;
    const rect = this.mapElement.getBoundingClientRect();
    const width = rect.width || this.mapElement.clientWidth || this.mapElement.offsetWidth;

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

    this.areas.forEach(area => {
      area?.addEventListener("mousemove", () => this.showLabel(area));
      area?.addEventListener("mouseleave", this.hideLabel);
    });

    this.mapElement.addEventListener("mousemove", this.setLabelPosition);
  }
}
