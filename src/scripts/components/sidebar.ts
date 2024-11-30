type TypeSidebarOptions = {
  buttonId: string;
  sidebarId: string;
};
export class Sidebar {
  private button: HTMLButtonElement;
  private sidebar: HTMLElement;
  private options: TypeSidebarOptions;
  private state: boolean;
  constructor(options: TypeSidebarOptions) {
    this.state = false;
    this.options = options;
    this.button = document.getElementById(this.options.buttonId) as HTMLButtonElement;
    this.sidebar = document.getElementById(this.options.sidebarId) as HTMLElement;
  }
  public init() {
    if (!this.button || !this.sidebar) {
      return;
    }
    this.clickOutside();
    this.initListeners();
  }

  private initListeners() {
    this.button?.addEventListener("click", () => this.toggle());
  }
  private clickOutside() {
    document.body.addEventListener("click", (e: Event) => {
      const target = e.target as Element | null;
      const isInsideSidebar = target?.closest(`#${this.options.sidebarId}`);
      if (!isInsideSidebar && this.state) {
        this.toggle();
      }
    });
  }

  private toggle() {
    this.state = !this.state;
    document.body.classList.toggle("sidebar-is-open");
  }
}
