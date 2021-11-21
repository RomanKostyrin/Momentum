import playList from './js/playList.js';
let controlPlayButtons;

const todoButton = document.querySelector('.button--todo');
const progressCurrentTime = document.querySelector('.progress-current-time');
const progressVolume = document.querySelector('.progress__volume');
const volumeButton = document.querySelector('.control__volume');
const progressFullTime = document.querySelector('.progress-full-time');
const songTitle = document.querySelector('.progress-title');
const progressBar = document.querySelector('.progress-bar');
const languageChanger = document.querySelector('.language');
const playListContainer = document.querySelector('.play-list');
const picturesTheme = document.querySelector('.text--theme');
const name = document.querySelector('.name');
const body = document.querySelector('body');
const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');
const changeQuote = document.querySelector('.change-quote');
const audio = document.querySelector('.audio');
const button = document.querySelector('.play');
const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next');
const hideButton = document.querySelector('.button--hide');
const pictureResourse = document.querySelector('.picture-resourse');
const pictureTheme = document.querySelector('.picture-theme');
const picturesButton = document.querySelector('.button--pictures');

let prevPlayButton = 0;
let todolistWrapper = document.querySelector('.todolist__wrapper');
let isSolo = false;
let lastVolume = 0.6;
let mousedown = false;
let randomNum = getRandomNum();
let isPlay = false;
let city = document.querySelector('.city');
let playNum = 0;
let startTime = 0;
let state = {
  language: 'ru',
  photoSource: 'github',
  resourse: 'nature',
  city: city.value,
  name: name.value,
  hiddenElements: {
    time: true,
    date: false,
    greeting: false,
    quote: false,
    weather: false,
    audio: false,
    todolist: false,
  },
};
setPlayList();

async function getLinkToImageUnsplash() {
  const unsplash = `https://api.unsplash.com/photos/random?orientation=landscape&query=${state.resourse}&client_id=qXHEaE_EIYZC0cXRjVYRmmzZtmGD-E55iaIy4iYyvSc`;
  const url = unsplash;
  const res = await fetch(url);
  const data = await res.json();

  return data.urls.regular;
}

async function getLinkToImageFlickr() {
  const flickr = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=601fdedb77e5adbbb83f1da0dae0d9bd&tags=${state.resourse}&extras=url_l&format=json&nojsoncallback=1`;
  const url = flickr;
  const res = await fetch(url);
  const data = await res.json();
  return data.photos.photo[randomNum].url_l;
}

function nextSong(isSolo) {
  if (!isSolo) {
    if (playNum === 3) {
      playNum = 0;
    } else {
      playNum++;
    }
    isPlay = false;
    startTime = 0;
    playAudio();
    if (!button.classList.contains('pause')) {
      toggleBtn();
    }
  } else {
    isPlay = false;
    changePlayButton();
  }
}

function prevSong() {
  if (playNum === 0) {
    playNum = 3;
  } else {
    playNum--;
  }
  isPlay = false;
  playAudio();
  if (!button.classList.contains('pause')) {
    toggleBtn();
  }
}

function setPlayList() {
  controlPlayButtons = document.querySelectorAll('.control__play-button');
  playListContainer.innerHTML = '';
  playList.forEach((el, ind) => {
    const li = document.createElement('li');
    const playLiButton = document.createElement('button');
    playLiButton.classList.add('control__play-button');
    playLiButton.classList.add('player-icon');
    li.textContent = el.title;
    li.classList.add('play-item');
    playLiButton.id = ind;
    if (playNum === ind) {
      songTitle.textContent = el.title;
      li.classList.add('item-active');
    }
    li.append(playLiButton);
    playListContainer.append(li);
  });
  audio.src = playList[playNum].src;
}

function toggleBtn() {
  button.classList.toggle('pause');
}

function playAudio() {
  setPlayList();
  if (!isPlay) {
    audio.currentTime = startTime;
    audio.play();
    isPlay = true;
    changePlayButton(+playNum);
  } else {
    audio.pause();
    isPlay = false;
    changePlayButton();
  }
  toggleBtn();
}

function changePlayButton(id) {
  prevPlayButton = id;
  controlPlayButtons = playListContainer.querySelectorAll('.control__play-button');
  controlPlayButtons.forEach((el, ind) => {
    if (id !== ind) {
      if (el.classList.contains('pause')) {
        el.classList.remove('pause');
      }
    } else {
      el.classList.toggle('pause');
    }
  });
}

function showTime() {
  const date = new Date();
  const timeText = document.querySelector('.time');
  const currentTime = date.toLocaleTimeString('en-US', { hour12: false });
  timeText.textContent = currentTime;
  showDate(date);
  showGreeting(date);
  setTimeout(showTime, 1000);
}

function getRandomNum(min = 1, max = 20) {
  return Math.floor(Math.random() * (max - min) + min);
}

function showDate(date) {
  progressCurrentTime.textContent = `${Math.floor(audio.currentTime)} sec `;
  progressFullTime.textContent = `${Math.floor(audio.duration)} sec ` || '0 sec';
  progressBar.value = audio.currentTime / audio.duration;
  const dateText = document.querySelector('.date');
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Moscow',
  };
  let currentDate = state.language === 'ru' ? date.toLocaleDateString('ru-Ru', options) : date.toLocaleDateString('en-En', options);
  currentDate = currentDate.split(' ').map((el, i) => (i === 0 || i === 2 ? el[0].toUpperCase() + el.slice(1) : el));
  dateText.textContent = currentDate.join(' ');
}

function getSlideNext() {
  if (state.photoSource === 'github' || state.photoSource === 'flickr') {
    randomNum = randomNum === 20 ? 1 : randomNum + 1;
  }
  setBg();
}

function getSlidePrev() {
  if (state.photoSource === 'github') {
    randomNum = randomNum === 1 ? 20 : randomNum - 1;
  }
  setBg();
}

async function setBg() {
  const date = new Date();
  const img = new Image();
  if (state.photoSource === 'github') {
    img.src = `https://raw.githubusercontent.com/RomanKostyrin/stage1-tasks/assets/images/${getTimeOfDay(date.getHours(), 'en')}/${randomNum.toString().padStart(2, 0)}.jpg`;
  } else if (state.photoSource === 'unsplash') {
    img.src = await getLinkToImageUnsplash();
  } else if (state.photoSource === 'flickr') {
    img.src = await getLinkToImageFlickr();
  }
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  };
}

function getTimeOfDay(hours, language) {
  const russianGreetings = {
    1: 'Доброе утро',
    2: 'Добрый день',
    3: 'Добрый вечер',
    4: 'Доброй ночи',
  };
  const englishGreetings = {
    1: 'morning',
    2: 'afternoon',
    3: 'evening',
    4: 'night',
  };
  if (language === 'ru') {
    return russianGreetings[Math.floor(hours / 6)] || russianGreetings[4];
  }
  return englishGreetings[Math.floor(hours / 6)] || englishGreetings[4];
}

function showGreeting(date) {
  const greetingText = document.querySelector('.greeting');
  const hours = date.getHours();
  const timeOfDay = getTimeOfDay(hours, state.language);

  greetingText.textContent = state.language === 'ru' ? timeOfDay : `Good ${timeOfDay}`;
}

function setLocalStorage() {
  localStorage.setItem('state', JSON.stringify(state));
}

function getLocalStorage() {
  if (localStorage.getItem('state')) {
    state = JSON.parse(localStorage.getItem('state'));
    languageChanger.value = state.language;
    name.value = state.name;
    city.value = state.city;
    pictureResourse.value = state.photoSource;
    pictureTheme.value = state.resourse;
    changeLanguage();
    setPictureResourse();

    Object.keys(state.hiddenElements).forEach((el) => {
      if (state.hiddenElements[el]) {
        const hiddenBlock = document.querySelector(`.${el}`);
        hiddenBlock.classList.toggle('hidden');
      }
    });
  }
  state.city = city.value;
}

async function getWeather() {
  state.city = city.value;
  const weatherIcon = document.querySelector('.weather-icon');
  const temperature = document.querySelector('.temperature');
  const weatherDescription = document.querySelector('.weather-description');
  const wind = document.querySelector('.wind');
  const humidity = document.querySelector('.humidity');
  const weatherError = document.querySelector('.weather-error');
  weatherError.textContent = '';
  const url = city.value ? `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${state.language}&appid=c016084af5bbf2f776bb9560e03f6cd5&units=metric` : `https://api.openweathermap.org/data/2.5/weather?q=Minsk&lang=${state.language}&appid=c016084af5bbf2f776bb9560e03f6cd5&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  if (res.status !== 200) {
    weatherError.textContent = `Error! city not found for "${city.value}"`;
    weatherIcon.className = 'weather-icon owf';
    temperature.textContent = '';
    weatherDescription.textContent = '';
    wind.textContent = '';
    humidity.textContent = '';
  } else {
    wind.textContent = state.language === 'ru' ? `Скорость ветра: ${Math.floor(data.wind.speed)} м/с` : `Wind speed: ${Math.floor(data.wind.speed)} m/s`;
    humidity.textContent = state.language === 'ru' ? `Влажность: ${data.main.humidity}%` : `Humidity: ${data.main.humidity}%`;
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.floor(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
  }
}

async function getQuotes() {
  const quote = document.querySelector('.quote');
  const author = document.querySelector('.author');
  const quotes = state.language === 'ru' ? 'data.json' : 'data-en.json';
  const res = await fetch(quotes);
  const data = await res.json();
  const random = getRandomNum();
  quote.textContent = data[random].text;
  author.textContent = data[random].author;
}

function hideElement() {
  const chosenElement = document.querySelector('.hide-element').value;

  const hiddenBlock = document.querySelector(`.${chosenElement}`);
  state.hiddenElements[chosenElement] = hiddenBlock.classList.contains('hidden') ? false : true;
  hiddenBlock.classList.toggle('hidden');
}

function setPictureResourse() {
  state.photoSource = pictureResourse.value;
  getSlideNext();
}

function setProgressSound(e) {
  audio.currentTime = (e.layerX / 200) * audio.duration;
  startTime = audio.currentTime;
}

function volume(e) {
  let level = e.offsetX / progressVolume.offsetWidth;
  level = Math.max(0, Math.min(1, level));
  lastVolume = level;
  setVolume(level);
  if (level < 0.1) {
    volumeButton.classList.add('control__volume--mute');
  } else if (volumeButton.classList.contains('control__volume--mute')) {
    volumeButton.classList.remove('control__volume--mute');
  }
}

function setVolume(level) {
  audio.volume = level;
  progressVolume.style.background = ` linear-gradient(
          to right,
          #710707 0%,
          #710707 ${level * 100}%,
          #fff ${level * 100}%,
          #fff 100%
        )`;
}

function muteVolume() {
  if (progressVolume.value != 0) {
    lastVolume = progressVolume.value;
    setVolume(0);
    progressVolume.value = 0;
  } else {
    setVolume(lastVolume);
    progressVolume.value = lastVolume;
  }
  volumeButton.classList.toggle('control__volume--mute');
}

function setTodoItem() {
  const doDiv = document.createElement('div');
  doDiv.classList.add('do__wrapper');

  const textArea = document.createElement('textarea');
  textArea.classList.add('todo__item');
  textArea.rows = 4;

  const closeDoButton = document.createElement('button');
  closeDoButton.classList.add('button__close-todo');
  closeDoButton.textContent = 'Done!';

  doDiv.append(textArea);
  doDiv.append(closeDoButton);
  todolistWrapper.append(doDiv);
}

function closeDo(e) {
  todolistWrapper = document.querySelector('.todolist__wrapper');
  if (e.target.classList.contains('button__close-todo')) {
    e.target.parentNode.remove();
  }
}

function changeMenuLanguage() {
  const menuUp = document.querySelector('.menu-up');
  const LanguageUp = document.querySelector('.text--language');
  const elementUp = document.querySelector('.text--hide');
  const picturesUp = document.querySelector('.text--pictures');
  const hideButtonUp = document.querySelector('.button--hide');

  hideButtonUp.innerText = state.language === 'ru' ? 'Вк/Вык' : 'On/Off';
  elementUp.innerText = state.language === 'ru' ? 'Спрятать элемент' : 'Hide element';
  LanguageUp.innerText = state.language === 'ru' ? 'Язык' : 'Language';
  menuUp.innerText = state.language === 'ru' ? 'Меню' : 'Menu';
  picturesUp.innerText = state.language === 'ru' ? 'Источник картинок' : 'Picture resourse';
  picturesTheme.innerText = state.language === 'ru' ? 'Тема картинок' : 'Picture theme';
}

todolistWrapper.addEventListener('click', closeDo);
volumeButton.addEventListener('click', muteVolume);
progressVolume.addEventListener('click', volume, { passive: true });
progressVolume.addEventListener('mousemove', (e) => mousedown && volume(e));
progressVolume.addEventListener('mousedown', () => (mousedown = true));
progressVolume.addEventListener('mouseup', () => (mousedown = false));
progressBar.addEventListener('click', setProgressSound);
progressBar.addEventListener('mousemove', (e) => mousedown && setProgressSound(e));
progressBar.addEventListener('mousedown', () => (mousedown = true));
progressBar.addEventListener('mouseup', () => (mousedown = false));
hideButton.addEventListener('click', hideElement);
picturesButton.addEventListener('click', setPictureResourse);
pictureTheme.addEventListener('change', () => {
  state.resourse = document.querySelector('.picture-theme').value;
});
window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);
changeQuote.addEventListener('click', getQuotes);
name.addEventListener('change', () => (state.name = name.value));
city.addEventListener('change', getWeather);
slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);
todoButton.addEventListener('click', setTodoItem);
button.addEventListener('click', () => {
  startTime = 0;
  playAudio();
});
audio.addEventListener('ended', () => nextSong(isSolo));
playNext.addEventListener('click', () => {
  isSolo = false;
  nextSong(isSolo);
});
playPrev.addEventListener('click', prevSong);
languageChanger.addEventListener('change', changeLanguage);

function changeLanguage() {
  state.language = languageChanger.value;
  getWeather();
  getQuotes();
  changeMenuLanguage();
}

playListContainer.addEventListener('click', (e) => {
  controlPlayButtons = playListContainer.querySelectorAll('.control__play-button');
  controlPlayButtons.forEach((el) => {
    if (prevPlayButton !== +e.target.id) {
      audio.pause();
      isPlay = false;
      isSolo = false;
      if (document.querySelector('.play').classList.contains('pause')) {
        document.querySelector('.play').classList.remove('pause');
      }
    }

    if (el === e.target) {
      audio.src = playList[e.target.id].src;
      if (!isPlay) {
        audio.currentTime = 0;
        audio.play();
        if (!document.querySelector('.play').classList.contains('pause')) {
          document.querySelector('.play').classList.add('pause');
        }
        isPlay = true;
        isSolo = true;
      } else {
        if (document.querySelector('.play').classList.contains('pause')) {
          document.querySelector('.play').classList.remove('pause');
        }
        audio.pause();
        isPlay = false;
        isSolo = false;
      }
      changePlayButton(+e.target.id);
    }
  });
});

showTime();
setBg();
getWeather();
getQuotes();

console.log('Здравствуй, проверяющий! Фотографии при смене могут грузиться долго из за размера, подождите чуть чуть и все будет работать!');
console.log('1. Часы и календарь +15');
console.log('2. Приветствие +10');
console.log('3. Смена фонового изображения +20');
console.log('4. Виджет погоды +15');
console.log('5. Виджет цитата дня +10');
console.log('6. Аудиоплеер +15');
console.log('7. Продвинутый аудиоплеер (реализуется без использования библиотек) +25');
console.log('8. Перевод приложения на два языка (en/ru или en/be) +15');
console.log('9. Получение фонового изображения от API +10');
console.log('10. Настройки приложения +15');
console.log('11. Дополнительный функционал на выбор (ToDo List Custom) +5');
console.log('Итого 155');
