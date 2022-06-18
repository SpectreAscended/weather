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
const previousList = document.querySelector('.previous__list');

const key = 'd9819c90d382ddc65dcc500f8e98498f';

const mobileSettings = document.querySelector('.mobile--settings-icon');

const loadSearches = JSON.parse(localStorage.getItem('prevSearches'));

let previousSearches = [];

if (loadSearches) [...previousSearches] = loadSearches;

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

    console.log(data);

    const currentWeatherData = {
      city: data.name,
      currentTemp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main['feels_like']),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      windDir: data.wind.deg,
      windGust: Math.round(data.wind?.gust * 3.6),
      cloudCover: data.clouds.all,
      conditions: data.weather[0].description,
      rain: data?.rain?.['1h'],
      snow: data?.snow?.['1h'] / 10,
      time: data.dt,
    };

    console.log(currentWeatherData);

    const infoBoxMarkup = `
    <div class="info__box--temperature">
    <h1 class="current__temperature">${currentWeatherData.currentTemp}°</h1>
    </div> 
    <div class="info__box--details">
      <h2 class="current__city">${currentWeatherData.city}</h2>
      <p class="current__conditions">${currentWeatherData.conditions}</p>
      
    </div>
    <p class="current__feels-like">Feels like: ${
      currentWeatherData.feelsLike
    }°</p>
    <p class="current__details">${getReportTime(currentWeatherData.time)}</p>
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
    )} ${currentWeatherData.windSpeed} km/h</p>
  </li>
  <li class="current__details--list-item">
    <p class="current__gust">Gusting</p>
    <p class="current__gust--value">${
      currentWeatherData.windGust ? currentWeatherData.windGust : '0'
    } km/h</p>
  </li>`;

    handlePrevSearches(data.name);
    resetValues();

    infoBox.insertAdjacentHTML('beforeend', infoBoxMarkup);
    mobileInfoBox.insertAdjacentHTML('beforeend', infoBoxMarkup);
    currentDetails.insertAdjacentHTML('beforeend', detailsMarkup);

    currentWeatherData.rain &&
      currentDetails.insertAdjacentHTML(
        'beforeend',
        `
        <li class="current__details--list-item">
                  <p class="current__rain">Rain</p>
                  <p class="current__rain--value">${currentWeatherData.rain} mm</p>
                  </li>
      `
      );

    currentWeatherData.snow &&
      currentDetails.insertAdjacentHTML(
        'beforeend',
        `
          <li class="current__details--list-item">
          <p class="current__snow">Snow</p>
          <p class="current__snow--value">${currentWeatherData.snow} cm</p>
          </li>
    `
      );
  } catch (err) {
    console.error('Problem retrieving weather data', err);
  }
};

searchBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const query = searchInput.value;
  localStorage.removeItem('currentCity');
  searchInput.value = '';
  localStorage.setItem('currentCity', query);
  weatherData(query);
});

const init = function () {
  const currentCity = localStorage.getItem('currentCity');
  currentCity && weatherData(currentCity);
};

init();

const resetValues = function () {
  infoBox.innerHTML = '';
  mobileInfoBox.innerHTML = '';
  currentDetails.innerHTML = '';
};

const handlePrevSearches = function (city) {
  // Checks if city name is in array. If it isnt, it adds the city to the array. If it is, it deletes it and adds it again at the beginning.  It deletes the end array item when the array becomes greater than 4.

  if (!previousSearches.includes(city)) {
    previousSearches.unshift(city);
  } else {
    const index = previousSearches.indexOf(city);
    previousSearches.splice(index, 1);
    previousSearches.unshift(city);
  }
  if (previousSearches.length > 4) {
    previousSearches.pop();
  }

  localStorage.setItem('prevSearches', JSON.stringify(previousSearches));

  const loadedSearches = JSON.parse(localStorage.getItem('prevSearches'));

  previousList.innerHTML = '';
  loadedSearches.forEach(item => {
    previousList.insertAdjacentHTML(
      'beforeend',
      `<li class="previous__list--item">${item}</li>`
    );
  });
};
previousList.addEventListener('click', function (e) {
  const city = e.target.innerHTML;
  weatherData(city);
  localStorage.setItem('currentCity', city);
});

const getReportTime = function (epoch) {
  // Multiply by 1000 to convert seconds to miliseconds
  const date = new Date(epoch * 1000);
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };

  return (
    date.toLocaleTimeString() +
    ' - ' +
    date.toLocaleDateString('us-EN', options)
  );
};
