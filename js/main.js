new WOW().init()

const cartBtn = document.querySelector('#cart-button')
const cartModal = document.querySelector('#cart-modal')
const cartModalClose = document.querySelector('#cart-modal-close')
const cardsWrapper = document.querySelector('#cards')

const mocks = [
    {
        img: './img/rollugol.jpg',
        title: 'Ролл уголь стандарт',
        ingredients: 'Рис, угорь, соус унаги, кунжут, водоросли нори.',
        price: 250,
    },
    {
        img: './img/california.jpg',
        title: 'Калифорния лосось стандарт',
        ingredients: 'Рис, лосось, авокадо, огурец, майонез, икра масаго, водоросли нори.',
        price: 250,
    },
    {
        img: './img/okinava.jpg',
        title: 'Окинава стандарт',
        ingredients: 'Рис, креветка отварная, сыр сливочный, лосось, огурец свежий...',
        price: 250,
    },
    {
        img: './img/cezar.jpg',
        title: 'Цезарь маки xl',
        ingredients: 'Рис, куриная грудка копченая, икра масаго, томат, айсберг, соус цезарь...',
        price: 250,
    },
    {
        img: './img/yasaymaki.jpg',
        title: 'Ясай маки стандарт 185 г',
        ingredients: 'Рис, помидор свежий, перец болгарский, авокадо, огурец, айсберг',
        price: 250,
    },
    {
        img: './img/rollkrevetka.jpg',
        title: 'Ролл с креветкой стандарт',
        ingredients: 'Рис, водоросли нори, креветки отварные, сыр сливочный, огурцы',
        price: 250,
    },
]

mocks.forEach((mock, index) => {
    cardsWrapper.insertAdjacentHTML('beforeend', `
        <div class="card wow fadeInRightBig" data-wow-duration="2s" data-wow-delay="${0.2 * index}s">
            <img src="${mock.img}" alt="image" class="card-image">
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title card-title-reg">${mock.title}</h3>
                </div>
                <div class="card-info">
                    <div class="ingredients">${mock.ingredients}</div>
                </div>
                <div class="card-buttons">
                    <button class="button button-primary">
                        <span class="button-card-text">В корзину</span>
                        <img class="button-card-image" src="img/shopping-cart-white.svg" alt="cart">
                    </button>
                    <strong class="card-price-bold">${mock.price} ₽</strong>
                </div>
            </div>
        </div>
    `)
})

cartBtn.addEventListener('click', toggleModal)
cartModalClose.addEventListener('click', toggleModal)

function toggleModal() {
    cartModal.classList.toggle('active')
}