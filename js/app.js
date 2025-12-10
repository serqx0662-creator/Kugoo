// === Поиск ===
const searchInput = document.querySelector(".search-input");

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        alert("Поиск: " + searchInput.value);
    }
});

// === Кнопка 'Каталог' (майбутнее меню) ===
const catalogBtn = document.querySelector(".catalog-btn");

catalogBtn.addEventListener("click", () => {
    alert("Каталог открылся (тут будет выпадающее меню)");
});

// === Кнопка '+' (доп. меню) ===
const plusBtn = document.querySelector(".header-icon-plus");

plusBtn.addEventListener("click", () => {
    alert("Доп. меню (разделы)");
});


const dots = document.querySelectorAll(".dot");
const prev = document.querySelector(".hero-arrow.prev");
const next = document.querySelector(".hero-arrow.next");
const scooterImg = document.querySelector(".hero-image");

let current = 0;

const images = [
    "./img/scooter.png",
    "./img/scooter2.png",
    "./img/scooter3.png",
    "./img/scooter4.png",
    "./img/scooter5.png"
];

function updateSlider(index) {
    current = index;
    scooterImg.src = images[current];

    dots.forEach(d => d.classList.remove("active"));
    dots[current].classList.add("active");
}

dots.forEach(dot => {
    dot.addEventListener("click", () => {
        updateSlider(Number(dot.dataset.slide));
    });
});

prev.addEventListener("click", () => {
    current = (current - 1 + images.length) % images.length;
    updateSlider(current);
});

next.addEventListener("click", () => {
    current = (current + 1) % images.length;
    updateSlider(current);
});
