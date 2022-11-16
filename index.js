const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoText = inputPart.querySelector(".info-text"),
  inputField = inputPart.querySelector("input"),
  locationButton = inputPart.querySelector("button"),
  weatherIcon = document.querySelector(".weather-part img");
const arrowBack = wrapper.querySelector(".arrow-back");
let api;
// listen input field
inputPart.addEventListener("keyup", (e) => {
  // if user enter btn and input value is not empty
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});
// listen location btn
locationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("您的浏览器不支持定位");
  }
});

function onSuccess(position) {
  // get lat and lon of user device form coords obj
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=8f11050154f425e4cf69a46234ff4aa4&units=metric`;
}
function onError(error) {
  infoText.innerText = error.message;
  infoText.classList.add("error");
}

// call weather api
function requestApi(city) {
  // const api = `https://api.qweather.com/v7/weather/now?location=&key=d5bd2d4a38094d98906071d63527dcc7`;和风天气
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8f11050154f425e4cf69a46234ff4aa4&units=metric
  `;
  fetchDate();
}

function fetchDate() {
  infoText.innerText = "获取天气...";
  infoText.classList.add("pending");

  // get api response and return it with parsing into js obj and in another
  // then function call weather details function with passing api result as an argument
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}
// control infotext and check city name
function weatherDetails(info) {
  infoText.classList.replace("pending", "error");
  if (info.cod == "404") {
    infoText.innerText = `${inputField.value} 不是城市地址`;
  } else {
    // get required properties form api
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const feels_like = info.main.feels_like;
    const humidity = info.main.humidity;
    const temp = info.main.temp;

    // change weather icons
    if (id == 800) {
      weatherIcon.src = "./icons/sunny.png";
    } else if (id >= 801 && id <= 804) {
      weatherIcon.src = "./icons/cloudy.png";
    } else if (id >= 600 && id <= 622) {
      weatherIcon.src = "./icons/snow.png";
    } else if (id >= 500 && id <= 531) {
      weatherIcon.src = "./icons/rain.png";
    } else if (id >= 300 && id <= 321) {
      weatherIcon.src = "./icons/drizzle.png";
    } else if (id >= 200 && id <= 232) {
      weatherIcon.src = "./icons/thunderstorm.png";
    } else if (id >= 701 && id <= 781) {
      weatherIcon.src = "./icons/haze.png";
    }

    // pass values to a particular html element
    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city},${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    infoText.classList.remove("pending", "error");
    wrapper.classList.add("active");
  }
  console.log(info);
}

// back main page
arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
  inputField.value = "";
});
