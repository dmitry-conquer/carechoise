export const Sliders = {
  init() {
    if (document.querySelector("#testimonials-slider")) {
      //@ts-ignore
      new Swiper("#testimonials-slider", {
        wrapperClass: "testimonials__wrapper",
        slideClass: "testimonial",
        slidesPerView: "auto",
        centeredSlides: true,
        speed: 800,
        loop: true,
        autoplay: {
          delay: 2300,
        },
        breakpoints: {
          0: {
            spaceBetween: 19,
          },
          768: {
            spaceBetween: 26,
          },
        },
      });
    }

    if (document.getElementById("gradient-slider")) {
      //@ts-ignore
      new Swiper("#gradient-slider", {
        slidesPerView: 3.55,
        speed: 800,
        spaceBetween: 20,
        breakpoints: {
          0: {
            slidesPerView: 1.1,
          },
          480: {
            slidesPerView: 1.5,
          },
          576: {
            slidesPerView: 2.2,
          },
          640: {
            slidesPerView: 2.5,
          },
          768: {
            slidesPerView: 3.55,
          },
        },
        navigation: {
          nextEl: ".gradient-slider__button",
        },
      });
    }

    if (document.getElementById("base-slider")) {
      //@ts-ignore
      new Swiper("#base-slider", {
        slidesPerView: 3,
        speed: 800,
        loop: false,
        spaceBetween: 20,
        navigation: {
          nextEl: ".base-slider__controls-button--next",
          prevEl: ".base-slider__controls-button--prev",
        },
        pagination: {
          el: ".base-slider__controls-pagination",
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 1.1,
          },
          480: {
            slidesPerView: 1.4,
          },
          576: {
            slidesPerView: 2.1,
          },
          768: {
            slidesPerView: 2.3,
          },
          992: {
            slidesPerView: 3,
          },
        },
      });
    }
  },
};
