/*






*/

let clicked = false;

const searchBtn = document.querySelector('.search__btn');
const searchInput = document.querySelector('.search__input');
searchBtn.addEventListener('click', function (e) {
  if (!clicked) {
    e.preventDefault();
    searchInput.style.transform = 'scaleX(1)';
    searchInput.focus();
    clicked = true;
  }
  if (clicked) {
    searchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      searchInput.style.transform = 'scaleX(0)';
      searchInput.blur();
      clicked = false;
    });
  }
});
