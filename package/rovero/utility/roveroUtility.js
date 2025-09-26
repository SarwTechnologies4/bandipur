import Aos from "aos";

export const RoveroUtility = {
  animation() {
    Aos.init();
  },
  bgImage() {
    document.querySelectorAll("[data-background]").forEach(function (element) {
      var backgroundUrl = element.getAttribute("data-background");
      element.style.backgroundImage = "url(" + backgroundUrl + ")";
    });
  },
  stickyNav: (enabled = true) => {
    const header = document.getElementById('header-sticky');
    if (!header) return;
    
    if (enabled) {
      header.classList.add('sticky-menu');
    } else {
      header.classList.remove('sticky-menu');
    }
  },
  scrollBtn() {
    var scrollBtn = document.querySelector(".scroll-up");
    if (scrollBtn) {
      scrollBtn.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
    window.addEventListener("scroll", function () {
      var scrolling = window.pageYOffset || document.documentElement.scrollTop;

      if (scrolling > 500) {
        document.querySelector(".scroll-up").classList.add("show");
      } else {
        document.querySelector(".scroll-up").classList.remove("show");
      }
    });
  },
};
