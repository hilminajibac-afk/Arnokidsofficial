let index = 1;
let timer;

function getSlides() {
    return document.getElementById("slides");
}

function getBannerWidth(){

    const slides = getSlides();

    if (!slides.children.length) return 0;

    return slides.children[0].clientWidth;

}

function updatePosition() {

    const slides = getSlides();

    slides.style.transform =
        `translateX(-${getBannerWidth() * index}px)`;

}

function nextSlide() {

    const slides = getSlides();

    if (slides.children.length <= 1) return;

    index++;

    slides.style.transition = "0.5s";

    updatePosition();

}

document.addEventListener("DOMContentLoaded", () => {

    const slides = getSlides();

    slides.addEventListener("transitionend", () => {

        if (index >= slides.children.length - 1) {

            slides.style.transition = "none";

            index = 1;

            updatePosition();

        }

        if (index <= 0) {

            slides.style.transition = "none";

            index = slides.children.length - 2;

            updatePosition();

        }

    });

});

window.addEventListener("resize", updatePosition);

window.addEventListener("load", () => {

    setTimeout(() => {

        updatePosition();

        clearInterval(timer);

        timer = setInterval(nextSlide, 4000);

    }, 300);

});