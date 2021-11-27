const cartButton = document.querySelector('#cart-button');
const modal = document.querySelector('.modal-cart');
const modalList = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('.close');


cartButton.addEventListener('click', function(event) {
    modal.classList.add('is-open');
});

for(i in closeBtns) {
    closeBtns[i].addEventListener('click', function(event) {
        for (j in modalList) {
            try {
                modalList[j].classList.remove('is-open');
            }
            catch {}
        }
});
}

