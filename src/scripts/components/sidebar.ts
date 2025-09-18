type TypeSidebarOptions = {
  buttonId: string;
  sidebarId: string;
};

type TypeStickySidebarOptions = {
  sidebarId: string;
  containerId: string;
  breakpoint: number;
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

export class StickySidebar {
  private sidebar: HTMLElement;
  private container: HTMLElement;
  private options: TypeStickySidebarOptions;
  private isFixed: boolean = false;
  private originalTop: number = 0;
  private containerTop: number = 0;
  private containerHeight: number = 0;
  private sidebarHeight: number = 0;

  constructor(options: TypeStickySidebarOptions) {
    this.options = options;
    this.sidebar = document.getElementById(this.options.sidebarId) as HTMLElement;
    this.container = document.getElementById(this.options.containerId) as HTMLElement;
  }

  public init() {
    if (!this.sidebar || !this.container) {
      return;
    }

    this.calculatePositions();
    this.initListeners();
  }

  private calculatePositions() {
    if (!this.sidebar || !this.container) return;

    const sidebarRect = this.sidebar.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    this.originalTop = sidebarRect.top + scrollTop;
    this.containerTop = containerRect.top + scrollTop;
    this.containerHeight = containerRect.height;
    this.sidebarHeight = sidebarRect.height;
  }

  private initListeners() {
    window.addEventListener('scroll', () => this.handleScroll());
    window.addEventListener('resize', () => this.handleResize());
  }

  private handleScroll() {
    if (window.innerWidth < this.options.breakpoint) {
      return; // Не працюємо на малих екранах
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const containerBottom = this.containerTop + this.containerHeight;

    // Якщо sidebar досяг верху контейнера і ще не зафіксований
    if (scrollTop + this.originalTop >= this.containerTop && !this.isFixed) {
      this.setFixed();
    }
    // Якщо sidebar досяг низу контейнера і зафіксований
    else if (scrollTop + this.sidebarHeight >= containerBottom && this.isFixed) {
      this.setAbsolute(containerBottom - this.sidebarHeight);
    }
    // Якщо прокрутили назад і sidebar вище контейнера
    else if (scrollTop + this.originalTop < this.containerTop && this.isFixed) {
      this.setSticky();
    }
  }

  private handleResize() {
    this.calculatePositions();
    // Скидаємо стан при зміні розміру на малих екранах
    if (window.innerWidth < this.options.breakpoint && this.isFixed) {
      this.setSticky();
    }
  }

  private setFixed() {
    if (!this.sidebar) return;
    
    this.isFixed = true;
    this.sidebar.style.position = 'fixed';
    this.sidebar.style.top = '24px';
    this.sidebar.style.left = `${this.sidebar.getBoundingClientRect().left}px`;
    this.sidebar.style.width = `${this.sidebar.getBoundingClientRect().width}px`;
  }

  private setAbsolute(bottomPosition: number) {
    if (!this.sidebar) return;
    
    this.isFixed = true;
    this.sidebar.style.position = 'absolute';
    this.sidebar.style.top = 'auto';
    this.sidebar.style.bottom = `${document.documentElement.scrollHeight - bottomPosition}px`;
  }

  private setSticky() {
    if (!this.sidebar) return;
    
    this.isFixed = false;
    this.sidebar.style.position = 'sticky';
    this.sidebar.style.top = '24px';
    this.sidebar.style.left = 'auto';
    this.sidebar.style.width = 'auto';
    this.sidebar.style.bottom = 'auto';
  }
}
