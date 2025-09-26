import { getClassName } from "../../utils/helpers";
import { openModal } from "../../components/modal";

export default class Markers {
  private mapElement: HTMLElement | null = null;
  private markers: SVGImageElement[] = [];

  constructor() {
    this.mapElement = document.querySelector(".map-svg");
  }

  public renderMarkers(markersData: MarkerData[]): void {
    if (!this.mapElement || !Array.isArray(markersData)) return;

    markersData.forEach((markerData, index) => {
      const markerElement = this.createMarker(markerData, index);
      if (markerElement) {
        this.markers.push(markerElement);
        this.mapElement!.appendChild(markerElement);
      }
    });
  }

  private createMarker(markerData: MarkerData, index: number): SVGImageElement | null {
    if (!markerData.image_src || typeof markerData.x !== "number" || typeof markerData.y !== "number") {
      return null;
    }

    const markerElement = document.createElementNS("http://www.w3.org/2000/svg", "image");

    markerElement.setAttributeNS(null, "href", markerData.image_src);
    markerElement.setAttribute("x", markerData.x.toString());
    markerElement.setAttribute("y", markerData.y.toString());
    markerElement.setAttribute("data-marker-id", index.toString());
    markerElement.setAttribute("data-related", markerData.related);
    markerElement.classList.add(getClassName(".map-marker"));
    markerElement.addEventListener("click", () => this.onMarkerClick(markerData.content));

    return markerElement;
  }

  private onMarkerClick(content: { title: string; address: string; phone: string }): void {
    const container = document.getElementById("location-popup-container");
    if (!container) return;

    const title = container.querySelector("[data-location-title]") as HTMLElement;
    const address = container.querySelector("[data-location-address]") as HTMLElement;
    const phone = container.querySelector("[data-location-phone]") as HTMLElement;

    if (!title || !address || !phone) return;

    title.innerHTML = content.title;
    address.innerHTML = content.address;
    phone.innerHTML = content.phone;

    openModal("location-popup");
  }
}
