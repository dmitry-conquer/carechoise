type HeaderOptions = {
  buttonId: string;
  menuId: string;
};

export class Header {
  private defaults: HeaderOptions;
  private settings: HeaderOptions;
  private button: HTMLButtonElement;
  private menu: HTMLElement;
  private itemHasSubmenuElements: HTMLElement[];

  constructor(options?: Partial<HeaderOptions>) {
    this.defaults = {
      buttonId: "open-menu-button",
      menuId: "header-menu",
    };
    this.settings = { ...this.defaults, ...options };
    this.button = document.getElementById(this.settings.buttonId) as HTMLButtonElement;
    this.menu = document.getElementById(this.settings.menuId) as HTMLButtonElement;
    this.itemHasSubmenuElements = Array.from(this.menu.querySelectorAll(".menu-item-has-children:not(.sub-menu-item)"));
  }
  private preventInit(): boolean {
    if (this.button && this.menu) {
      return false;
    }
    return true;
  }

  public init() {
    if (this.preventInit()) {
      console.warn("Critical elements for Heder's work are missing!");
      return;
    }
    this.initListeners();
  }

  private onDocumentClick = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (target.closest(this.button.id) || target.closest(this.menu.id) || target.closest(".menu-item-has-children:not(.sub-menu)")) return;
    this.itemHasSubmenuElements.forEach(menuItem => {
      const subMenu = menuItem.querySelector("ul") as HTMLElement;
      if (!subMenu) return;
      menuItem?.classList.remove("is-active");
      subMenu.style.maxHeight = "";

      // На мобільних пристроях sub-menu завжди видимі
    });
  };

  private toggleSubmenu(currentIndex: number): void {
    this.itemHasSubmenuElements.forEach((menuItem, index) => {
      const subMenu = menuItem.querySelector("ul") as HTMLElement;
      if (!subMenu) return;
      const active = menuItem.classList.contains("is-active");

      if (currentIndex === index) {
        menuItem?.classList.toggle("is-active");
        subMenu.style.maxHeight = active ? "" : `${subMenu.scrollHeight}px`;

        // На мобільних пристроях sub-menu завжди видимі, тому не керуємо ними
      } else {
        menuItem.classList.remove("is-active");
        subMenu.style.maxHeight = "";
      }
    });
  }

  private handleInteraction(index: number, e: MouseEvent) {
    const menuItem = this.itemHasSubmenuElements[index];
    const isActive = menuItem.classList.contains("is-active");

    if (!isActive) {
      e.preventDefault();
      this.toggleSubmenu(index);
    }
  }

  private initListeners() {
    document.addEventListener("click", this.onDocumentClick);
    this.button.addEventListener("click", () => this.toggleMenu());
    this.itemHasSubmenuElements.forEach((item, index) => {
      (item.querySelector(":scope > a") as HTMLElement | null)?.addEventListener("click", (event: MouseEvent) => {
        if (this.isTouchDevice) {
          this.handleInteraction(index, event);
        }
      });
    });
  }

  get isTouchDevice() {
    return navigator.maxTouchPoints > 0 || window.matchMedia?.("(pointer: coarse)")?.matches;
  }

  private toggleMenu() {
    document.body.classList.toggle("menu-is-open");
    this.button.classList.toggle("menu-is-open");
    this.menu.classList.toggle("menu-is-open");
  }
}
