import MicroModal from "micromodal";

export function InitModals() {
  MicroModal.init({
    disableScroll: true,
  });
}

export function openModal(modalId: string) {
  MicroModal.show(modalId, {
    disableScroll: true,
  });
}
