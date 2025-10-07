export class HeadingAnim {
  private element: HTMLElement;
  private parts: NodeListOf<HTMLElement>;
  private interval: number;
  private delay: number;

  constructor(element: HTMLElement, interval: number = 300, delay: number = 0) {
    this.element = element;
    this.interval = interval;
    this.delay = delay;
    this.parts = this.element.querySelectorAll(".heading-anim-part");
    this.animate();
  }

  private animate(): void {
    // Затримка перед початком всієї анімації
    setTimeout(() => {
      this.parts.forEach((part, index) => {
        setTimeout(() => {
          part.style.display = "inline";
        }, index * this.interval);
      });
    }, this.delay);
  }
}
