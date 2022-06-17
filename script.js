/*






*/

let clicked = false;

const searchBtn = document.querySelector('.search__btn');
const searchInput = document.querySelector('.search__input');
const mobilePrevious = document.querySelector('.mobile--previous');
const mobilePreviousOverlay = document.querySelector(
  '.mobile__overlay--previous'
);

const mobileSettings = document.querySelector('.mobile--settings-icon');

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

mobilePrevious.addEventListener('click', function () {
  mobilePreviousOverlay.style.transform = 'translateY(0)';
  document
    .querySelector('.mobile--previous__list--heading')
    .addEventListener('click', function () {
      mobilePreviousOverlay.style.transform = 'translateY(-2000px)';
    });
});

mobileSettings.addEventListener('click', function () {
  document.querySelector('.mobile__overlay').style.transform = 'translateY(0)';
});
