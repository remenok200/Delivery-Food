'use strict';

new WOW().init();

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const loginForm = document.querySelector('#login-form');
const loginInput = document.querySelector('#input-login');
const buttonLogout = document.querySelector('#button-logout');
const inputPassword = document.querySelector('#input-password');
const authMsg = document.querySelector('#auth-msg');
const cardsRestaraurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logoHref');
const cardsMenu = document.querySelector('.cards-menu');


let login = localStorage.getItem('gloDelivery');

function toggleModalAuth() {
    modalAuth.classList.toggle("is-open");
    loginInput.classList.remove('invalid-input');
    inputPassword.classList.remove('invalid-input');
    authMsg.textContent = '';
    if (modalAuth.classList.contains("is-open")) {
        disabledScroll();
    }
    else {
        enabledScroll();
    }
}

function autorized() {
    function logOut() {
        login=null;
        localStorage.removeItem('gloDelivery');
        buttonLogout.removeEventListener('click', logOut);
        checkAuth();
    }
    console.log('авторизован');
    buttonAuth.style.display = "none";
    buttonLogout.style.display = "flex";
    buttonLogout.addEventListener('click', logOut);


}

function notAutorized() {
    buttonAuth.style.display = "flex";
    buttonLogout.style.display = "none";
    console.log('Не авторизован');
    function logIn(event) {
        event.preventDefault();
        login = loginInput.value;
        let password = inputPassword.value;
        loginInput.classList.remove('invalid-input');
        inputPassword.classList.remove('invalid-input');

        if(login && password) {
            localStorage.setItem('gloDelivery', login);
            
            toggleModalAuth();
            buttonAuth.removeEventListener('click', toggleModalAuth);
            loginForm.removeEventListener('submit', logIn);
            loginForm.reset();
            checkAuth();
        }
        else {
            authMsg.textContent = 'Поля должны быть заполнены';
            if(!login) loginInput.classList.add('invalid-input');
            if(!password) inputPassword.classList.add('invalid-input');
        }
    }

    buttonAuth.addEventListener('click', toggleModalAuth);
    loginForm.addEventListener('submit', logIn);
    modalAuth.addEventListener('click', function(event) {
        if (event.target.classList.contains('is-open')) {
            toggleModalAuth();
        }
    });
}

function checkAuth() {
    if(login) {
        autorized();
    }
    else {
        notAutorized();
    }
}

function createCardReustarants() {
    const card = `
        <a class="card card-restaurant wow animate__animated animate__fadeInUp" data-wow-delay="0">
            <img src="img/pizza-plus.png" alt="image" class="card-image">
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">
                        Пицца плюс
                    </h3>
                    <span class="card-tag tag">
                        50 мин
                    </span>
                </div>
                <div class="card-info">
                    <div class="rating">
                        <img src="img/star.svg" alt="star" class="rating-star">
                        4.5
                    </div>
                    <div class="price">
                        От 900 ₽
                    </div>
                    <div class="category">
                        Пицца
                    </div>
                </div>
            </div>
    </a>
    `
    cardsRestaraurants.insertAdjacentHTML('beforeend', card);
}

function createCardGood() {
    const card = document.createElement('div');
    card.className = 'card wow animate__animated animate__fadeInUp';
    card.setAttribute('data-wow-delay', 0);
    card.insertAdjacentHTML('beforeend', `
        <div class="card wow animate__animated animate__fadeInUp" data-wow-delay="0">
            <img src="img/rol.jpg" alt="image" class="card-image">
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title card-title-reg">
                        Ролл угорь стандарт
                    </h3>
                </div>
                <div class="card-info">
                    <div class="ingredietns">
                        Рис, угорь, соус унаги, кунжут, водоросли нори.
                    </div>
                </div>
                <div class="card-buttons">
                    <button class="button button-primary">
                        <span class="button-card-text">В корзину</span>
                        <img src="img/cart2.svg" alt="shopping-cart" class="card-button-image">
                    </button>
                    <strong class="card-price-bold">250 ₽</strong>
                </div>
            </div>
    </div>
    `);
    cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
    if(login){
        const target = event.target;
    
        const restourant = target.closest('.card-restaurant');
    
        cardsMenu.textContent = '';
        
        if (restourant) {
            containerPromo.classList.add('hidden');
            restaurants.classList.add('hidden');
            menu.classList.remove('hidden');
    
            createCardGood();
            createCardGood();
            createCardGood();
            createCardGood();
            createCardGood();
        }
    }
    else {
        toggleModalAuth();
    }
}

function closeGoods() {
    containerPromo.classList.remove('hidden');
    restaurants.classList.remove('hidden');
    menu.classList.add('hidden');
}

cardsRestaraurants.addEventListener('click', openGoods);
logo.addEventListener('click', function() {
    closeGoods();
})

checkAuth();


createCardReustarants();
createCardReustarants();
createCardReustarants();
createCardReustarants();
createCardReustarants();
