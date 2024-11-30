type HeaderOptions = {
  buttonId: string;
  menuId: string;
};

export class Header {
  private defaults: HeaderOptions;
  private settings: HeaderOptions;
  private button: HTMLButtonElement;
  private menu: HTMLElement;
  constructor(options?: Partial<HeaderOptions>) {
    this.defaults = {
      buttonId: "open-menu-button",
      menuId: "header-menu",
    };
    this.settings = { ...this.defaults, ...options };
    this.button = document.getElementById(this.settings.buttonId) as HTMLButtonElement;
    this.menu = document.getElementById(this.settings.menuId) as HTMLButtonElement;
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
  private initListeners() {
    this.button.addEventListener("click", () => this.toggleMenu());
  }
  private toggleMenu() {
    document.body.classList.toggle("menu-is-open");
    this.button.classList.toggle("menu-is-open");
    this.menu.classList.toggle("menu-is-open");
  }
}
