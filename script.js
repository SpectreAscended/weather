/*






*/

const searchBtn = document.querySelector('.search__btn');
const searchInput = document.querySelector('.search__input');
const body = document.querySelector('body');

searchBtn.addEventListener('click', function (e) {
  e.preventDefault();
  searchInput.style.transform = 'scaleX(1)';
  searchInput.focus();
  body.addEventListener('click', function () {
    searchInput.style.transform = 'scaleX(0)';
  });
});
