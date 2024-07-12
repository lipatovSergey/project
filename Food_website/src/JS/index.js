import menuContent from './menuContent';
import { dispose3D, init3D } from './threeModel';

const mainTitle = document.querySelector('.main__title');
const mainTitleDescr = document.querySelector('.main__title-descr');
const mainMenu = document.querySelector('.main__menu');
const logo = document.querySelector('.header__logo-image');

logo.addEventListener('click', () => {
  renderContent('popular')
})

function renderContent(category) {
    const { title ,items } = menuContent[category];
    mainTitle.textContent = title;
    mainMenu.innerHTML = '';
    items.forEach(element => {
        const menuItem = document.createElement('li');
        menuItem.classList.add('main__item');
        menuItem.innerHTML = `
            <a class="main__item-link" href="">
                <img class="main__item-img" src="${element.image}" alt="${element.name}">
                <div class="main__item-information">
                <h3 class="main__item-title">${element.name}</h3>
                <p class="main__item-descr">${element.description}</p>
                <p class="main__item-price">${element.price}</p>
                </div>
            </a>
    `;
    menuItem.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      showModal();
    })
    mainMenu.append(menuItem);
    });
}

function handleMenuClick(category) {
  localStorage.setItem('currentCategory', category);
  history.pushState({category}, '', `?category=${category}`);
  renderContent(category);
}

document.querySelectorAll('.header__menu-link').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const category = link.dataset.category; // Получаем категорию из data-атрибута кнопки
      handleMenuClick(category);
    });
});

const currentCategory = new URLSearchParams(window.location.search).get('category') || localStorage.getItem('currentCategory') || 'popular';
renderContent(currentCategory);

window.onpopstate = function(event) {
  const category = event.state ? event.state.category : "popular"
  renderContent(category);
}

// Modal window
const modal = document.getElementById('modal');
const closeButton = document.getElementById('close-button');

function showModal() {
  document.body.classList.add('modal-open');
  modal.classList.add('show');
  init3D();
};

closeButton.addEventListener('click', () => {
  document.body.classList.remove('modal-open');
  modal.classList.remove('show');
  dispose3D();
})

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    document.body.classList.remove('modal-open');
    modal.classList.remove('show');
    dispose3D();
  }
})