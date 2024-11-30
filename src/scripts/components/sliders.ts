
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
  },
};
