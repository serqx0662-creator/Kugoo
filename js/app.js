


document.addEventListener("DOMContentLoaded", () => {
    const catalogBtn = document.querySelector('.catalog-btn');
    const catalogDropdown = document.getElementById('catalogDropdown');

    // Переключение меню
    catalogBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        catalogDropdown.classList.toggle('active');

        // Меняем иконку бургера на крестик в кнопке (опционально)
        const icon = catalogBtn.querySelector('.catalog-icon');
        icon.textContent = catalogDropdown.classList.contains('active') ? '✕' : '☰';
    });

    // Закрытие при клике вне меню
    document.addEventListener('click', (e) => {
        if (!catalogDropdown.contains(e.target) && !catalogBtn.contains(e.target)) {
            catalogDropdown.classList.remove('active');
            catalogBtn.querySelector('.catalog-icon').textContent = '☰';
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const cartBtn = document.getElementById('cartBtn');
    const cartDropdown = document.getElementById('cartDropdown');
    const cartMobileClose = document.getElementById('cartMobileClose');
    const cartItemsContainer = cartDropdown.querySelector('.cart-items');
    const cartCountElement = cartDropdown.querySelector('.cart-count');
    const totalSumElement = cartDropdown.querySelector('.total-sum');
    const checkoutBtn = cartDropdown.querySelector('.checkout-btn');

    // Загружаем корзину из localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Создаем красный кружок-счетчик
    const cartBadge = document.createElement('span');
    cartBadge.className = 'cart-count-badge';
    cartBadge.textContent = '0';
    cartBtn.appendChild(cartBadge);

    // Находим счетчик в мобильном меню
    const mobileCartCount = document.getElementById('mobileCartCount') ||
        document.querySelector('.mobile-cart-count');

    // Функция обновления ВСЕХ счетчиков
    function updateAllCounters() {
        let totalCount = 0;
        let totalSum = 0;

        // Считаем общее количество товаров
        cart.forEach(item => {
            totalCount += item.quantity || 1;
            totalSum += item.price * (item.quantity || 1);
        });

        // 1. Обновляем текст в корзине ("3 товара")
        cartCountElement.textContent = `${totalCount} ${getNoun(totalCount, 'товар', 'товара', 'товаров')}`;

        // 2. Обновляем сумму
        totalSumElement.textContent = `${totalSum.toLocaleString()} ₽`;

        // 3. Обновляем красный кружок на иконке корзины
        cartBadge.textContent = totalCount;
        cartBadge.style.display = totalCount > 0 ? 'flex' : 'none';

        // 4. Обновляем счетчик в мобильном меню
        if (mobileCartCount) {
            mobileCartCount.textContent = totalCount;
            mobileCartCount.style.display = totalCount > 0 ? 'flex' : 'none';
        }

        // Сохраняем в localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Функция обновления отображения товаров в корзине
    function updateCartDisplay() {
        // Очищаем контейнер
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            // Создаем элемент для пустой корзины
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'cart-empty';
            emptyDiv.textContent = 'Ваша корзина пока пуста';
            cartItemsContainer.appendChild(emptyDiv);

            // Блокируем кнопку оформления
            if (checkoutBtn) {
                checkoutBtn.disabled = true;
                checkoutBtn.style.opacity = '0.6';
                checkoutBtn.style.cursor = 'not-allowed';
            }
        } else {
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="item-img-wrapper">
                        <img src="${item.image}" alt="${item.name}" class="item-img">
                    </div>
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">
                            ${item.price.toLocaleString()} ₽ 
                            <span>× ${item.quantity || 1}</span>
                        </div>
                    </div>
                    <button class="item-remove" data-index="${index}">×</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });

            // Активируем кнопку оформления
            if (checkoutBtn) {
                checkoutBtn.disabled = false;
                checkoutBtn.style.opacity = '1';
                checkoutBtn.style.cursor = 'pointer';
            }
        }

        // Обновляем все счетчики
        updateAllCounters();
    }

    // Функция добавления товара в корзину
    function addToCart(product) {
        // Ищем товар в корзине
        const existingIndex = cart.findIndex(item =>
            item.id === product.id && item.name === product.name
        );

        if (existingIndex !== -1) {
            // Увеличиваем количество
            cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
        } else {
            // Добавляем новый товар
            cart.push({
                ...product,
                quantity: 1
            });
        }

        updateCartDisplay();
        showCart();
    }

    // Функция показа корзины
    function showCart() {
        cartDropdown.classList.add('active');
        // На мобильных блокируем скролл
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }
    }

    // Функция скрытия корзины
    function hideCart() {
        cartDropdown.classList.remove('active');
        // На мобильных восстанавливаем скролл
        if (window.innerWidth <= 768) {
            document.body.style.overflow = '';
        }
    }

    // Обработчик клика по крестику
    if (cartMobileClose) {
        cartMobileClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideCart();
        });
    }

    // Обработчик клика по кнопке корзины
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Проверяем, открыта ли корзина
        const isOpen = cartDropdown.classList.contains('active');

        if (isOpen) {
            hideCart();
        } else {
            showCart();
        }
    });

    // Закрытие корзины при клике вне её (только для десктопа)
    document.addEventListener('click', (e) => {
        // На десктопе (шире 768px) закрываем при клике вне
        if (window.innerWidth > 768) {
            const isClickInsideCart = cartDropdown.contains(e.target);
            const isClickOnCartBtn = cartBtn.contains(e.target);

            if (!isClickInsideCart && !isClickOnCartBtn) {
                hideCart();
            }
        }
    });

    // Закрытие корзины по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartDropdown.classList.contains('active')) {
            hideCart();
        }
    });

    // Обработчик клика по кнопке удаления
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('item-remove')) {
            e.preventDefault();
            e.stopPropagation();
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            updateCartDisplay();
        }
    });

    // Обработчик клика по кнопке "Купить в 1 клик"
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('js-buy-btn') ||
            e.target.closest('.js-buy-btn')) {
            e.preventDefault();

            const btn = e.target.classList.contains('js-buy-btn') ?
                e.target : e.target.closest('.js-buy-btn');
            const productCard = btn.closest('.product-card');

            const product = {
                id: Date.now(),
                name: productCard.querySelector('.product-name').textContent.trim(),
                price: parseInt(productCard.querySelector('.new-price').dataset.price),
                image: productCard.querySelector('.ps-item').src
            };

            addToCart(product);

            // Анимация кнопки
            const originalText = btn.textContent;
            btn.textContent = '✓ Добавлено';
            btn.style.background = '#4CAF50';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        }
    });

    // Функция для правильного склонения
    function getNoun(number, one, two, five) {
        let n = Math.abs(number);
        n %= 100;
        if (n >= 5 && n <= 20) return five;
        n %= 10;
        if (n === 1) return one;
        if (n >= 2 && n <= 4) return two;
        return five;
    }

    // Инициализация
    updateCartDisplay();
});

// Модальное окно заказа
const orderModal = document.getElementById('orderModal');
const orderModalClose = document.querySelector('.order-modal-close');
const orderForm = document.getElementById('orderForm');
const phoneInput = orderForm.querySelector('.form-input');

// Открытие модального окна при клике на "Оформить заказ" в корзине
const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        orderModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Закрытие модального окна
orderModalClose.addEventListener('click', () => {
    orderModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Закрытие при клике на оверлей
document.querySelector('.order-modal-overlay').addEventListener('click', () => {
    orderModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Маска для телефона
phoneInput.addEventListener('input', function(e) {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '') + (x[4] ? '-' + x[4] : '');
});

// Отправка формы
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const phone = phoneInput.value.trim();

    if (!phone || phone.length < 10) {
        alert('Пожалуйста, введите корректный номер телефона');
        return;
    }

    // Здесь отправка данных на сервер
    console.log('Заказ оформлен:', {
        phone: phone,
        product: 'KUGOO KIRIN M4'
    });

    // Сообщение об успехе
    alert('Спасибо за заказ! Наш менеджер свяжется с вами в течение 5 минут.');

    // Закрываем модальное окно
    orderModal.classList.remove('active');
    document.body.style.overflow = '';

    // Очищаем форму
    orderForm.reset();
});

document.addEventListener('DOMContentLoaded', function() {
    const phoneToggle = document.getElementById('phoneToggle');
    const phoneDropdown = document.getElementById('phoneDropdown');

    // Переключение видимости телефонов
    phoneToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        phoneDropdown.classList.toggle('active');

        // Поворот иконки
        const img = this.querySelector('img');
        if (phoneDropdown.classList.contains('active')) {
            img.style.transform = 'rotate(45deg)';
        } else {
            img.style.transform = 'rotate(0deg)';
        }
    });

    // Закрытие при клике вне блока
    document.addEventListener('click', function(e) {
        if (!phoneDropdown.contains(e.target) && !phoneToggle.contains(e.target)) {
            phoneDropdown.classList.remove('active');

            // Возврат иконки в исходное положение
            const img = phoneToggle.querySelector('img');
            img.style.transform = 'rotate(0deg)';
        }
    });

    // Закрытие при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            phoneDropdown.classList.remove('active');
            const img = phoneToggle.querySelector('img');
            img.style.transform = 'rotate(0deg)';
        }
    });
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

// Бургер меню с анимациями
const mobileMenu = document.getElementById("mobileMenu");
const burgerMenu = document.getElementById("burgerMain");
const closeMobileMenu = document.getElementById("closeMobileMenu");

// Открытие меню с анимацией
burgerMenu.addEventListener('click', () => {
    mobileMenu.classList.add("active");
    document.body.style.overflow = 'hidden'; // Блокируем скролл

    // Анимация иконки бургера
    burgerMenu.style.transform = 'rotate(90deg)';
    burgerMenu.style.transition = 'transform 0.3s ease';
});

// Закрытие меню с анимацией
closeMobileMenu.addEventListener('click', () => {
    mobileMenu.classList.remove("active");
    document.body.style.overflow = '';

    // Возвращаем иконку бургера
    burgerMenu.style.transform = 'rotate(0deg)';
});

// Закрытие при клике на оверлей
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        mobileMenu.classList.remove("active");
        document.body.style.overflow = '';
        burgerMenu.style.transform = 'rotate(0deg)';
    }
});

// Закрытие при нажатии Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove("active");
        document.body.style.overflow = '';
        burgerMenu.style.transform = 'rotate(0deg)';
    }
});

// Переключение телефонов в мобильном меню
const mobilePhoneToggle = document.getElementById('mobilePhoneToggle');
if (mobilePhoneToggle) {
    mobilePhoneToggle.addEventListener('click', () => {
        const contacts = document.querySelector('.mobile-contacts');
        const plusBtn = mobilePhoneToggle;

        if (contacts.style.display === 'none' || !contacts.style.display) {
            contacts.style.display = 'block';
            plusBtn.textContent = '−';
            plusBtn.style.transform = 'rotate(180deg)';
        } else {
            contacts.style.display = 'none';
            plusBtn.textContent = '+';
            plusBtn.style.transform = 'rotate(0deg)';
        }
    });
}

// Синхронизация счетчика корзины
function updateMobileCartCount(count) {
    const mobileCartCount = document.getElementById('mobileCartCount');
    if (mobileCartCount) {
        mobileCartCount.textContent = count;

        // Анимация обновления счетчика
        mobileCartCount.style.transform = 'scale(1.3)';
        setTimeout(() => {
            mobileCartCount.style.transform = 'scale(1)';
        }, 300);
    }
}

// Открытие корзины из мобильного меню
const mobileCartBtn = document.getElementById('mobileCartBtn');
if (mobileCartBtn) {
    mobileCartBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Закрываем меню
        mobileMenu.classList.remove("active");
        document.body.style.overflow = '';
        burgerMenu.style.transform = 'rotate(0deg)';

        // Открываем корзину
        setTimeout(() => {
            document.getElementById('cartBtn').click();
        }, 300);
    });
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.product-slider').forEach(slider => {
        const track = slider.querySelector('.ps-track');
        const items = slider.querySelectorAll('.ps-item');
        const prev = slider.querySelector('.ps-prev');
        const next = slider.querySelector('.ps-next');

        if (!track || !items.length) return;

        let index = 0;

        function update() {
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        prev?.addEventListener('click', () => {
            index = (index - 1 + items.length) % items.length;
            update();
        });

        next?.addEventListener('click', () => {
            index = (index + 1) % items.length;
            update();
        });

        // свайп
        let startX = 0;
        slider.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
        });

        slider.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (diff > 50) next.click();
            if (diff < -50) prev.click();
        });
    });

});

document.addEventListener('DOMContentLoaded', () => {

    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.product-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {

            // активная кнопка
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            cards.forEach(card => {
                const categories = card.dataset.category.split(' ');

                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

        });
    });

});

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.catalog-more');
    const extra = document.querySelector('.extra-products');

    if (!btn || !extra) return;

    btn.addEventListener('click', () => {
        extra.classList.toggle('open');

        btn.textContent = extra.classList.contains('open')
            ? 'Свернуть'
            : 'Смотреть все';
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
    const btn = document.getElementById('showMoreBtn');
    const extraGrid = document.getElementById('extraGrid');

    if (btn && extraGrid) {
        btn.addEventListener('click', function() {
            // Переключаем класс видимости (если есть — уберет, если нет — добавит)
            const isVisible = extraGrid.classList.toggle('is-visible');

            // Меняем текст кнопки в зависимости от состояния
            if (isVisible) {
                btn.textContent = 'Свернуть';
            } else {
                btn.textContent = 'Смотреть все';

                // Опционально: плавно скроллим вверх к началу секции при сворачивании
                extraGrid.closest('.popular-categories').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
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

document.addEventListener('DOMContentLoaded', function() {
    const subscribeForm = document.querySelector('.subscribe-form'); // Найди свою форму
    const modal = document.getElementById('successModal');
    const closeBtn = document.querySelector('.modal-close');

    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Отменяем перезагрузку страницы

            // Здесь можно добавить проверку, ввел ли пользователь email
            const emailInput = subscribeForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim() !== "") {
                modal.classList.add('active'); // Показываем модалку
                subscribeForm.reset(); // Очищаем поле ввода
            }
        });
    }

    // Закрытие при клике на крестик
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });

    // Закрытие при клике вне контента (на темный фон)
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// ===== CALLBACK POPUP =====
const callbackPopup = document.getElementById('callbackPopup');
const callbackCloseBtn = document.getElementById('callbackPopupClose');
const callbackForm = document.querySelector('.callback-form');
const callbackPhoneInput = document.querySelector('.callback-phone-input');
const callbackOpenBtn = document.querySelector('.callback-link'); // "Заказать звонок"

// Открытие модалки
if (callbackOpenBtn) {
    callbackOpenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        callbackPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Закрытие по крестику
callbackCloseBtn.addEventListener('click', () => {
    callbackPopup.classList.remove('active');
    document.body.style.overflow = '';
});

// Закрытие по клику вне окна
callbackPopup.addEventListener('click', (e) => {
    if (e.target === callbackPopup) {
        callbackPopup.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Маска телефона
callbackPhoneInput.addEventListener('input', function (e) {
    let x = e.target.value
        .replace(/\D/g, '')
        .match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);

    e.target.value = !x[2]
        ? x[1]
        : '(' + x[1] + ') ' + x[2]
        + (x[3] ? '-' + x[3] : '')
        + (x[4] ? '-' + x[4] : '');
});

// Выбор соцсети
const socialButtons = document.querySelectorAll('.callback-social-item');
let selectedSocial = 'phone';

socialButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        socialButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn.classList.contains('viber')) selectedSocial = 'viber';
        if (btn.classList.contains('whatsapp')) selectedSocial = 'whatsapp';
        if (btn.classList.contains('telegram')) selectedSocial = 'telegram';
    });
});

// Отправка формы
callbackForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const phone = callbackPhoneInput.value.trim();

    if (!phone || phone.length < 10) {
        alert('Введите корректный номер телефона');
        return;
    }

    console.log('Заявка на звонок:', {
        phone: phone,
        contact_method: selectedSocial
    });

    alert('Спасибо! Мы свяжемся с вами в течение 5 минут.');

    callbackPopup.classList.remove('active');
    document.body.style.overflow = '';
    callbackForm.reset();

    socialButtons.forEach(b => b.classList.remove('active'));
    selectedSocial = 'phone';
});

