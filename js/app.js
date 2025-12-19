const mobileMenu = document.getElementById("mobileMenu");
const mobileBottomMenu = document.getElementById("mobileBottomMenu");
const burgerMenu = document.getElementById("burgerMain");

burgerMenu.addEventListener('click', () => {
    mobileMenu.classList.add("active");
})

document.getElementById("closeMobileMenu").onclick = () => {
    mobileMenu.classList.remove("active");
};


const searchInput = document.querySelector(".search-input");

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        alert("Поиск: " + searchInput.value);
    }
});

const catalogBtn = document.querySelector(".catalog-btn");

catalogBtn.addEventListener("click", () => {
    alert("Каталог открылся (тут будет выпадающее меню)");
});

const plusBtn = document.querySelector(".header-icon-plus");

plusBtn.addEventListener("click", () => {
    alert("Доп. меню (разделы)");
});


document.addEventListener("DOMContentLoaded", () => {
    const scooters = document.querySelectorAll(".hero-scooter");
    const dots = document.querySelectorAll(".dot");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    const titleEl = document.getElementById("hero-title");
    const subtitleEl = document.getElementById("hero-subtitle");

    let index = 0;

    const titles = [
        "ЭЛЕКТРОСАМОКАТЫ KUGOO KIRIN<br>ОТ ОФИЦИАЛЬНОГО ДИЛЕРА",
        "KUGOO KIRIN M4 PRO<br>МОЩНЫЙ И УДОБНЫЙ",
        "KUGOO KIRIN S3<br>ЛЁГКИЙ И БЫСТРЫЙ",
        "KUGOO KIRIN G2 PRO<br>ДЛЯ ПУТЕШЕСТВИЙ"
    ];

    const subtitles = [
        "С бесплатной доставкой по РФ от 1 дня",
        "До 60 км на одном заряде",
        "Вес всего 11 кг — бери с собой куда угодно",
        "Проходимость и комфорт на любом покрытии"
    ];

    function updateSlide() {
        scooters.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));

        scooters[index].classList.add("active");
        dots[index].classList.add("active");

        titleEl.innerHTML = titles[index];
        subtitleEl.innerHTML = subtitles[index];
    }

    nextBtn.addEventListener("click", () => {
        index = (index + 1) % scooters.length;
        updateSlide();
    });

    prevBtn.addEventListener("click", () => {
        index = (index - 1 + scooters.length) % scooters.length;
        updateSlide();
    });

    setInterval(() => {
        index = (index + 1) % scooters.length;
        updateSlide();
    }, 4000);
});

document.addEventListener("DOMContentLoaded", () => {
    const burger = document.getElementById('burgerMain');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMobileMenu');
    const mobileInner = document.querySelector('.mobile-menu-inner');
    const mobileNavContainer = document.getElementById('mobileNavLinks');

    if (!burger || !mobileMenu || !closeMenu || !mobileInner) {
        console.warn('Mobile menu: required elements not found. Check IDs: burgerMain, mobileMenu, closeMobileMenu, .mobile-menu-inner');
        return;
    }

    // 1) Копируем ссылки из desktop sub-nav (если есть)
    const subNav = document.getElementById('subNav');
    if (subNav && mobileNavContainer) {
        // очистим на всякий случай
        mobileNavContainer.innerHTML = '';
        subNav.querySelectorAll('a').forEach(link => {
            const clone = link.cloneNode(true);
            // убираем лишние классы/стили, если нужно
            clone.classList.remove('badge-blue');
            // добавляем класс для мобильного меню
            clone.classList.add('mobile-link-item');
            mobileNavContainer.appendChild(clone);
        });
    }

    // 2) Копируем поиск из desktop (.search-wrapper) внутрь mobileMenu (в начало, после крестика)
    const desktopSearch = document.querySelector('.search-wrapper');
    if (desktopSearch) {
        // сделаем клон формы, но уберём события/атрибуты ненужные
        const searchClone = desktopSearch.cloneNode(true);
        // адаптируем классы
        searchClone.classList.add('mobile-search-clone');
        // вставляем под крестиком (в начало inner)
        mobileInner.insertBefore(searchClone, mobileInner.children[1] || null);
    } else {
        // Если нет .search-wrapper — оставляем уже существующий мобильный поиск (если он есть)
        // или можно создать пустой поисковый блок при желании.
    }

    // Функция открытия/закрытия + блокировка скролла
    function openMenu() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closedMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // События
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        openMenu();
    });

    closeMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        closedMenu();
    });

    // Закрываем по клику вне панели (по затемнению)
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) closedMenu();
    });

    // Закрываем по Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closedMenu();
    });

    // Улучшение: делегируем клики по мобильным ссылкам чтобы меню закрывалось при навигации
    mobileMenu.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (!a) return;
        const href = a.getAttribute('href') || '';
        // если ссылка ведёт на якорь или внешний ресурс, закрываем меню
        if (href.startsWith('#') || href.startsWith('/') || href.startsWith('http')) {
            // небольшая задержка, чтобы переход произошёл после анимации
            setTimeout(closedMenu, 150);
        }
    });

    if (!mobileNavContainer || mobileNavContainer.children.length === 0) {
    }

    mobileMenu.addEventListener('transitionend', () => {
        const input = mobileMenu.querySelector('input[type="text"], .search-input');
        if (input && mobileMenu.classList.contains('active')) {
            input.focus({ preventScroll: true });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            // Скрыть весь контент
            panes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');

            const targetId = tab.dataset.tab;
            const targetPane = document.getElementById(targetId);

            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const playerWrapper = document.getElementById('videoPlayer');
    const previewImg = playerWrapper.querySelector('.video-preview-img');
    const playButton = playerWrapper.querySelector('.play-button-overlay');
    const iframeContainer = playerWrapper.querySelector('.video-iframe-container');
    const videoIframe = document.getElementById('videoIframe');

    const videoURL = "https://www.youtube.com/embed/GjcQPwIVACU?autoplay=1&rel=0";

    playerWrapper.addEventListener('click', function() {
        previewImg.classList.add('hidden');
        playButton.classList.add('hidden');

        iframeContainer.classList.remove('hidden');

        videoIframe.src = videoURL;
    });
});


document.querySelectorAll('.reviews-row').forEach(row => {
    const track = row.querySelector('.reviews-track');
    const direction = row.dataset.direction;

    let speed = 0.4;
    let pos = 0;
    let paused = false;

    // 1. Клонируем контент
    track.innerHTML += track.innerHTML;

    const trackWidth = track.scrollWidth / 2;

    row.addEventListener('mouseenter', () => paused = true);
    row.addEventListener('mouseleave', () => paused = false);

    function loop() {
        if (!paused) {
            if (direction === 'left') {
                pos -= speed;
                if (Math.abs(pos) >= trackWidth) {
                    pos += trackWidth;
                }
            } else {
                pos += speed;
                if (pos >= 0) {
                    pos -= trackWidth;
                }
            }

            track.style.transform = `translateX(${pos}px)`;
        }

        requestAnimationFrame(loop);
    }

    loop();
});

document.addEventListener('DOMContentLoaded', function () {
    const track = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Устанавливает .active на первый слайд
    function updateActive() {
        // Сначала убираем у всех
        track.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
        // Добавляем первому
        if (track.firstElementChild) {
            track.firstElementChild.classList.add('active');
        }
    }

    // Инициализация кликов
    function initClickHandlers() {
        track.querySelectorAll('.slide').forEach(slide => {
            // Убираем старые обработчики (защита от дублей)
            slide.removeEventListener('click', handleSlideClick);
            slide.addEventListener('click', handleSlideClick);
        });
    }

    function handleSlideClick() {
        const isFirst = this === track.firstElementChild;
        if (isFirst) {
            // Запуск видео (только для активного)
            const videoId = this.getAttribute('data-video-id');
            const container = this.querySelector('.video-container');
            if (!container.innerHTML.trim()) {
                // ⚠️ Убрали лишний пробел перед ${videoId}
                container.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                this.querySelector('.preview-img').style.opacity = '0';
                this.querySelector('.play-overlay').style.opacity = '0';
            }
        } else {
            // Клик по неактивному — переключаем вперёд
            moveNext();
        }
    }

    function moveNext() {
        document.querySelectorAll('.video-container').forEach(c => c.innerHTML = '');

        const first = track.firstElementChild;
        const second = first?.nextElementSibling;
        if (!first || !second) return;

        // 1️⃣ сразу меняем active
        track.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
        second.classList.add('active');

        // 2️⃣ ждём, пока браузер применит width
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {

                const slideWidth = second.offsetWidth + 30;

                track.style.transition = 'transform 0.5s ease-in-out';
                track.style.transform = `translateX(-${slideWidth}px)`;

                setTimeout(() => {
                    track.appendChild(first);

                    track.style.transition = 'none';
                    track.style.transform = 'translateX(0)';

                    initClickHandlers();
                }, 500);

            });
        });
    }



    function movePrev() {
        document.querySelectorAll('.video-container').forEach(c => c.innerHTML = '');

        const last = track.lastElementChild;
        if (!last) return;

        // Сразу переносим в начало
        track.prepend(last);

        // Ширина "активного" слайда (650px) + gap
        const fakeWidth = 650 + 30;
        track.style.transition = 'none';
        track.style.transform = `translateX(-${fakeWidth}px)`;

        // Анимируем возврат
        setTimeout(() => {
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = 'translateX(0)';
            updateActive();
            initClickHandlers();
        }, 1);
    }

    // Кнопки
    nextBtn.addEventListener('click', moveNext);
    prevBtn.addEventListener('click', movePrev);

    // Инициализация
    updateActive();
    initClickHandlers();
});

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.blog-slider');
    const track = document.querySelector('.blog-track');
    const prevBtn = document.querySelector('.blog-btn.prev');
    const nextBtn = document.querySelector('.blog-btn.next');

    const gap = 30;
    let index = 0;
    let visibleCount = 0;
    let cardWidth = 0;
    let isAnimating = false;

    function setup() {
        const cards = Array.from(track.children);
        cardWidth = cards[0].offsetWidth + gap;
        visibleCount = Math.floor(slider.offsetWidth / cardWidth);

        // клонируем
        for (let i = 0; i < visibleCount; i++) {
            track.appendChild(cards[i].cloneNode(true));
            track.prepend(cards[cards.length - 1 - i].cloneNode(true));
        }

        index = visibleCount;
        track.style.transform = `translateX(-${index * cardWidth}px)`;
    }

    function move() {
        track.style.transition = 'transform 0.4s ease';
        track.style.transform = `translateX(-${index * cardWidth}px)`;
    }

    function next() {
        if (isAnimating) return;
        isAnimating = true;
        index++;
        move();
    }

    function prev() {
        if (isAnimating) return;
        isAnimating = true;
        index--;
        move();
    }

    track.addEventListener('transitionend', () => {
        const cards = track.children.length;

        track.style.transition = 'none';

        if (index >= cards - visibleCount) {
            index = visibleCount;
        }

        if (index < visibleCount) {
            index = cards - visibleCount * 2;
        }

        track.style.transform = `translateX(-${index * cardWidth}px)`;

        isAnimating = false;
    });

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    setup();
});

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const icon = button.querySelector('.faq-icon');

        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
            icon.style.transform = 'rotate(0deg)';
        } else {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.style.transform = 'rotate(45deg)';
        }
    });
});