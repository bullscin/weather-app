import conditions from "./conditions.js";

console.log(conditions);

const apiKey = "5a7119d47b6e4591b9395810230706";

// Эл-ты на странице
const header = document.querySelector(".header");
const form = document.querySelector("#form");
const input = document.querySelector("#inputCity");

function removeCard() {
  // Удаляем предыдущую карточку
  const prevCard = document.querySelector(".card");
  if (prevCard) prevCard.remove();
}

function showError(errorMessage) {
  // Отобразить карточку с ошибкой
  const html = `<div class="card">${errorMessage}</div>`;

  //   Отображаем карточку на странице
  header.insertAdjacentHTML("afterend", html);
}

function showCard({ name, country, temp, condition }) {
  //   Разметка для карточки
  const html = ` <div class="card">
  <h2 class="card-city">
   ${name}
    <span>${country}</span>
  </h2>

  <div class="card-weather">
    <div class="card-value">${temp}<sup>°C</sup></div>
    <img class="card-img" src="/img/example.png" alt="Weather" />
  </div>

  <div class="class-desc">${condition}</div>
</div>`;

  //   Отображаем карточку на странице
  header.insertAdjacentHTML("afterend", html);
}

async function getWeather(city) {
  // Адресс запроса
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  return data;
}

// Слушаем отправку формы
form.onsubmit = async function (e) {
  //Отменяем отправку формы
  e.preventDefault();

  //Берем значение из инпута, обрезаем пробелы
  let city = input.value.trim();

  // Получаем данные с сервера
  const data = await getWeather(city);

  // Проверка на ошибку
  if (data.error) {
    // Если есть ошибка - вывводим её
    removeCard();
    showError(data.error.message);
  } else {
    // Если ошибки нет - вывводим карточку
    removeCard();

    console.log(data.current.condition.code);

    // conditions.filter((el) => {
    //   el.code;
    // });
    const info = conditions.find(
      (obj) => obj.code === data.current.condition.code
    );

    console.log(info);
    console.log(info.languages[23]["day_text"]);

    const condition = data.current.is_day
      ? info.languages[23]["day_text"]
      : info.languages[23]["night_text"];

    const weatherData = {
      name: data.location.name,
      country: data.location.country,
      temp: data.current.temp_c,
      condition: condition,
    };

    showCard(weatherData);
  }
};
