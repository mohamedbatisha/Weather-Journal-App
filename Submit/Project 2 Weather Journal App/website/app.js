/* The personal API Key for OpenWeatherMap API & URL */

const key = '4de8f23828879dec98d1f230e00b3bd4';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';

// Weather data from  API
const createWeatherURL = (zipCode) => {
  return baseURL + zipCode + ',us&units=imperial&appid=' + key;
};


// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#generate').addEventListener('click', addEntry);
  // Load existing journal entries
  getData()
    .then((appData) => {
      updateUI(appData);
    });
});


// Async GET Function
const getWeather = async (zipCode) => {

  const weatherURL = createWeatherURL(zipCode);
  const response = await fetch(weatherURL);
  try {

    const weatherData = await response.json();
    weatherData.zipCode = zipCode;

    // Exit promise chain if zip code is not found
    if (weatherData.cod == 404) {
      return Promise.reject(weatherData.message);
    }
    return weatherData;
  } catch (error) {
    console.log(error);
  }
};

// Async POST Function
const postData = async (weatherData) => {
  // Get feelings
  const feelings = document.querySelector('#feelings').value;
  // Create data for app entry
  const date = new Date();
  const entryID = date.getTime();
  const dateString = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;

  const appData = {
    'entryID': entryID,
    'date': dateString,
    'zipCode': weatherData.zipCode,
    'name': weatherData.name,
    'temp': weatherData.main.temp,
    'feelings': feelings
  };
  const response = await fetch('/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appData)
  });
  try {
    const returnData = await response.json();
    return returnData.entryID;
  } catch (error) {
    console.log(error);
  }
};

// get app data from the server
const getData = async () => {
  const response = await fetch('/all');

  try {
    const appData = await response.json();
    return appData;
  } catch (error) {
    console.log(error);
  }

};

// Update user interface
const updateUI = async (appData) => {
  let allEntries = "";
  for (const entry of appData.reverse()) {

    const journalEntry = `
    <div class="journalEntry">
      <div id="date">${entry.date}</div>
      <div id="city">${entry.name}</div>
      <div id="temp">${entry.temp}°F</div>
      <div id="content">${entry.feelings}</div>
    </div>
    `;
    allEntries += journalEntry;
  }

  if (allEntries != "") {
    document.querySelector('#entryHolder').innerHTML = allEntries;
  } else {
    document.querySelector('#entryHolder').innerHTML = "Your journal is currently empty.";
  }

};

// add a entry to the app
const addEntry = () => {
  // user input
  const zipCode = document.querySelector('#zip').value;
  const feelings = document.querySelector('#feelings').value;

  // Check for valid zip and feelings
  if (zipCode.length == 5 && !isNaN(zipCode)) {

    if (feelings.length > 0) {
      getWeather(zipCode)
        .then((weatherData) => {
          return postData(weatherData);
        })
        .then(() => {
          return getData();
        })
        .then((appData) => {
          updateUI(appData);
        })
        .catch((error) => {
          alert(error);
        });

    } else {

      alert("Please enter your feelings.");
      document.querySelector('#feelings').focus();
    }
  } else {

    alert('Please enter a valid 5 digit zip code.');
    document.querySelector('#zip').focus();
  }
};
