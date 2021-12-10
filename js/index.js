new WOW().init()
const CART_TOKEN = 'cart'

new Swiper('.swiper-container', {
    sliderPerView: 1,
    loop: true,
    autoplay: true,
    grabCursor: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
    },
})

const logo = document.querySelector('.logo')
const buttonAuth = document.querySelector('.button-auth')
const buttonLogin = document.querySelector('.button-login')
const modalAuth = document.querySelector('#auth-modal')
const inputLogin = document.querySelector('#login')
const inputPassword = document.querySelector('#password')
const messageAuthError = document.querySelector('#auth-error')
const cardsWrapper = document.querySelector('#cards')
const promoSwiperContainer = document.querySelector('.promo-swiper-container')
const restaurantsHeading = document.querySelector('.section-heading.restaurants')
const inputSearch = document.querySelector('.input-search')

const cart = localStorage.getItem(CART_TOKEN)
    ? {
        products: JSON.parse(localStorage.getItem(CART_TOKEN)),
        totalPrice: JSON.parse(localStorage.getItem(CART_TOKEN)).reduce((total, { price, amount }) => total + price * amount, 0)
    } : {
    products: [],
    totalPrice: 0,
}
const cartBtn = document.querySelector('#cart-button')
const cartModal = document.querySelector('#cart-modal')
const cartModalClose = document.querySelector('#cart-modal-close')
const cartWrapper = document.querySelector('#cart-modal .modal-dialog .modal-body')
const cartPrice = document.querySelector('#cart-price')

let authStatus = JSON.parse(localStorage.getItem('authStatus'))
let authData = JSON.parse(localStorage.getItem('authData'))
let restaurants = []
let openStatus = false;
let goodsVisible = false;

let users = [
    { login: "admin", password: "123" },
];

const getData = async (url) => {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Error! Address: ${url}. Status code: ${response.status}!`)
    }

    return await response.json()
}

const createRestaurant = (restaurant) => {
    const {
        image,
        kitchen,
        name,
        price,
        stars,
        products,
        time_of_delivery: timeOfDelivery
    } = restaurant;

    cardsWrapper.insertAdjacentHTML('beforeend', `
        <a data-products="${products}" data-name="${name}" data-price="${price}" data-stars="${stars}" data-kitchen="${kitchen}" class="card">
            <img src="${image}" alt="image" class="card-image">
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${name}</h3>
                    <span class="card-tag tag">${timeOfDelivery}</span>
                </div>
                <div class="card-info">
                    <div class="rating">
                        <img src="./img/star.svg" alt="rating" class="rating-star">
                        ${stars}
                    </div>
                    <div class="price">От ${price} ₽</div>
                    <div class="category">${kitchen}</div>
                </div>
            </div>
        </a>
    `)
}

const createGood = (good, index) => {
    const {
        id,
        description,
        image,
        name,
        price
    } = good;

    cardsWrapper.insertAdjacentHTML('beforeend', `
        <div class="card wow fadeInRightBig" data-id="${id}" data-name="${name}" data-price="${price}" data-wow-duration="0.5s" data-wow-delay="${0.2 * index}s">
            <img src="${image}" alt="image" class="card-image">
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title card-title-reg">${name}</h3>
                </div>
                <div class="card-info">
                    <div class="ingredients">${description}</div>
                </div>
                <div class="card-buttons">
                    <button class="button button-primary">
                        <span class="button-card-text">В корзину</span>
                        <img class="button-card-image" src="img/shopping-cart-white.svg" alt="cart">
                    </button>
                    <strong class="card-price-bold">${price} ₽</strong>
                </div>
            </div>
        </div>
    `)
}

const createCartItem = (product) => {
    const {
        id,
        name,
        price,
        amount,
    } = product;

    cartWrapper.insertAdjacentHTML('beforeend', `
        <div class="food-row" data-id="${id}" >
            <span class="food-name">${name}</span>
            <strong class="food-price">${price} ₽</strong>
            <div class="food-counter">
                <button class="counter-button">-</button>
                <span class="counter">${amount}</span>
                <button class="counter-button">+</button>
            </div>
        </div>
    `)
}

const setRestaurantHeading = ({ name, stars, price, kitchen }) => {
    restaurantsHeading.innerHTML = ''

    restaurantsHeading.insertAdjacentHTML('beforeend', `
        <h2 class="section-title">${name}</h2>
        <div class="card-info">
            ${stars
                ? `
                    <div class="rating">
                        <img src="./img/star.svg" alt="rating" class="rating-star">
                        ${stars}
                    </div>
                `
                : ''}
            ${price ? `<div class="price">От ${price} ₽</div>` : ''}
            <div class="category">${kitchen}</div>
        </div>
    `)
}

const openGoods = (event) => {
    event.preventDefault()
    const restaurant = event.target.closest('.card');

    if (authStatus) {
        if (restaurant && !goodsVisible) {
            const { name, price, stars, kitchen } = restaurant.dataset

            promoSwiperContainer.classList.add('hide');
            cardsWrapper.innerHTML = ''

            setRestaurantHeading({ name, price, stars, kitchen })

            getData(`./db/${restaurant.dataset.products}`).then((data) => {
                cardsWrapper.innerHTML = ''
                goodsVisible = !goodsVisible

                data.forEach(createGood);
            });
        }
    }
    else {
        toggleModalAuth();
    }
}

const toggleModalAuth = () => {
    modalAuth.classList.toggle('active');
    openStatus = !openStatus;

    inputLogin.style.borderColor = '';
    inputLogin.value = '';
    inputPassword.style.borderColor = '';
    inputPassword.value = '';

    document.body.style.overflow = openStatus ? 'hidden' : 'visible';
}

const toggleAuthMessageError = () => {
    messageAuthError.classList.toggle('visible')
}

const toggleModalCart = () => {
    cartModal.classList.toggle('active')
}

(() => {
    inputSearch.addEventListener('keypress', (event) => {
        if (event.charCode === 13) {
            getData('./db/partners.json')
                .then((data) => data.map((partner) => partner.products))
                .then((links) => {
                    promoSwiperContainer.classList.add('hide');
                    cardsWrapper.innerHTML = ''
                    goodsVisible = true

                    setRestaurantHeading({ name: 'Результаты поиска', kitchen: 'Разная' })

                    links.forEach((link) => {
                        getData(`./db/${link}`).then((data) => {
                            goodsVisible = !goodsVisible

                            data
                                .filter((prod) => prod.name.toLowerCase()
                                    .includes(inputSearch.value.toLowerCase()))
                                .forEach(createGood);
                        })
                    })
                })
        }
    })

    cartBtn.addEventListener('click', () => {
        cart.products.forEach(createCartItem)

        toggleModalCart()
    })

    cartModal.addEventListener('click', ({ target }) => {
        if (
            target.id === cartModal.id
            || target === cartModalClose
            || (target.classList.contains('button') && target.innerHTML === 'Отмена')
        ) {
            toggleModalCart()

            cartWrapper.innerHTML = ''
        } else if (target.classList.contains('counter-button')) {
            const { id } = target.closest('.food-row').dataset

            cart.products = cart.products.map((product) => {
                if (product.id === id) {
                    if (target.innerHTML === '+') {
                        return { ...product, amount: product.amount + 1 }
                    } else {
                        return product.amount - 1 > 0 ? { ...product, amount: product.amount - 1 } : null
                    }
                }

                return product
            })
            cart.products = cart.products.filter((product) => product)
            localStorage.setItem(CART_TOKEN, JSON.stringify(cart.products))

            cartWrapper.innerHTML = ''
            cart.products.forEach(createCartItem)
            cartPrice.innerHTML = cart.products.reduce((total, { price, amount }) => total + price * amount, 0) + ' ₽'
        }
    })

    modalAuth.addEventListener('click', ({ target }) => {
        if (target.id === modalAuth.id) {
            toggleModalAuth()
        }
    })

    buttonAuth.addEventListener('click', () => {
        if (authStatus === false) {
            toggleModalAuth();
        } else {
            if (confirm('Вы хотите разлогиниться?') === true) {
                localStorage.setItem('authStatus', false);
                localStorage.setItem('authData', null);
                authStatus = false;
                authData = null;
                document.getElementById('login-text').innerText = "Войти";
            }
        }
    })

    buttonLogin.addEventListener('click', () => {
        const isExist = users.some((user) => {
            if (user.login === inputLogin.value && user.password === inputPassword.value) {
                localStorage.setItem('authStatus', true);
                localStorage.setItem('authData', JSON.stringify(user));
                authData = user
                authStatus = true;
                document.getElementById('login-text').innerText = inputLogin.value;

                toggleModalAuth();

                return true
            }

            return false
        })

        if (!isExist) {
            toggleAuthMessageError()

            !inputLogin.value && (inputLogin.style.borderColor = '#C10000')
            !inputPassword.value && (inputPassword.style.borderColor = '#C10000')

            setTimeout(() => {
                toggleAuthMessageError()
                inputLogin.style.borderColor = 'initial'
                inputPassword.style.borderColor = 'initial'
            }, 3000)
        }
    })

    cardsWrapper.addEventListener('click', (event) => {
        const { target: { classList } } = event

        if (!classList.contains('cards')) {
            if (classList.contains('button-card-text') || classList.contains('button-card-image') || classList.contains('button')) {
                const { id, name, price } = event.target.closest('.card').dataset;
                let exist = false

                cart.products = cart.products.map((product) => {
                    if (product.id === id) {
                        exist = true

                        return { ...product, amount: product.amount + 1 }
                    }

                    return product
                })

                if (!exist) {
                    cart.products.push({ id, name, price, amount: 1 })
                }

                localStorage.setItem(CART_TOKEN, JSON.stringify(cart.products))

                cart.totalPrice += parseInt(price)
                cartPrice.innerHTML = cart.totalPrice + ' ₽'
            } else {
                openGoods(event)
            }
        }
    })

    logo.addEventListener('click', () => {
        promoSwiperContainer.classList.remove('hide');
        goodsVisible = false;
    })

    if (authData !== null) {
        document.getElementById('login-text').innerText = authData.login;
    }

    getData('./db/partners.json').then((restaurants) => {
        cardsWrapper.innerHTML = ''

        restaurants.forEach(createRestaurant)
    })

    cartPrice.innerHTML = cart.totalPrice + ' ₽'
})()
