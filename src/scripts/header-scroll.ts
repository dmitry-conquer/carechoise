class HeaderScroll {
  private header: HTMLElement | null;
  private scrollThreshold: number = 90;

  constructor() {
    this.header = document.getElementById("site-header");
    this.init();
  }

  private init(): void {
    if (!this.header) {
      console.warn('Header element with id "site-header" not found');
      return;
    }

    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  private handleScroll(): void {
    if (!this.header) return;

    const scrollY = window.scrollY;

    if (scrollY >= this.scrollThreshold) {
      this.header.classList.add("is-scroll");
    } else {
      this.header.classList.remove("is-scroll");
    }
  }
}

export default HeaderScroll;
