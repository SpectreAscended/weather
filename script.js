const searchBtn = document.querySelector('.search__btn');
const searchInput = document.querySelector('.search__input');
const searchForm = document.querySelector('.search__box');
const mobilePrevious = document.querySelector('.mobile--previous');
const mobilePreviousOverlay = document.querySelector(
  '.mobile__overlay--previous'
);
const infoBox = document.querySelector('.info__box');
const mobileInfoBox = document.querySelector('.mobile-info__box');
const currentDetails = document.querySelector('.current__details--list');

const key = 'd9819c90d382ddc65dcc500f8e98498f';

const mobileSettings = document.querySelector('.mobile--settings-icon');

const previousSearches = [];

const windDirection = function (dir) {
  if (dir >= 337.5 || dir < 22.5) return 'N';
  if (dir >= 22.5 && dir < 67.5) return 'NE';
  if (dir >= 67.5 && dir < 112.5) return 'E';
  if (dir >= 112.5 && dir < 157.5) return 'SE';
  if (dir >= 157.5 && dir < 202.5) return 'S';
  if (dir >= 202.5 && dir < 247.5) return 'SW';
  if (dir >= 247.5 && dir < 292.5) return 'W';
  if (dir >= 292.5 && dir < 337.5) return 'NW';
};

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

const weatherData = async function (query) {
  try {
    const url = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=d9819c90d382ddc65dcc500f8e98498f&units=metric`
    );
    const data = await url.json();

    if (data.cod === '404') {
      infoBox.innerHTML = '';
      infoBox.insertAdjacentHTML(
        'beforeend',
        '<p class="info__box--default">Couldn\'t find your city. Please check your spelling at try again</p>'
      );
      throw new Error(`Couldn't find your city.  Please try again`);
    }
    previousSearches.unshift(data.name);
    console.log(data);
    console.log(previousSearches);

    const currentWeatherData = {
      city: data.name,
      currentTemp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      windDir: data.wind.deg,
      windGust: Math.round(data.wind.gust),
      cloudCover: data.clouds.all,
    };

    const infoBoxMarkup = `
    <h1 class="current__temperature">${currentWeatherData.currentTemp}°</h1>
    <div class="info__box--details">
      <h2 class="current__city">${currentWeatherData.city}</h2>
      <p class="current__details">9:25pm Tuesday, June 16</p>
    `;

    const detailsMarkup = `
    <li class="current__details--list-item">
      <p class="current__clouds">Cloud cover</p>
      <p class="current__clouds--value">${currentWeatherData.cloudCover}%</p>
    </li>
    <li class="current__details--list-item">
      <p class="current__humidity">Humidity</p>
      <p class="current__humidity--value">${currentWeatherData.humidity}%</p>
    </li>
  <li class="current__details--list-item">
    <p class="current__wind">Wind</p>
    <p class="current__wind--value">${windDirection(
      currentWeatherData.windDir
    )} ${currentWeatherData.windSpeed}km/h</p>
  </li>
  <li class="current__details--list-item">
    <p class="current__gust">Gusting</p>
    <p class="current__gust--value">${currentWeatherData.windGust}km/h</p>
  </li>
  <li class="current__details--list-item">
    <p class="current__percipitation">Percipitation</p>
    <p class="current__percipitiation--value">0</p>
  </li>
    `;

    resetValues();
    infoBox.insertAdjacentHTML('beforeend', infoBoxMarkup);
    mobileInfoBox.insertAdjacentHTML('beforeend', infoBoxMarkup);
    currentDetails.insertAdjacentHTML('beforeend', detailsMarkup);
  } catch (err) {
    console.error('Problem retrieving weather data', err);
  }
};

searchBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const query = searchInput.value;

  searchInput.value = '';

  weatherData(query);
});

const resetValues = function () {
  infoBox.innerHTML = '';
  mobileInfoBox.innerHTML = '';
  currentDetails.innerHTML = '';
};
