'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT;
const app = express();
app.use(cors());

app.get('/', (request, response) => {
  response.send('This still works!');
});

// Location Route
app.get('/location', (request, response) => {
  try {
    const geoData = require('./data/geo.json');
    const city = request.query.city;
    const locationData = new Location (city, geoData);
    response.send(locationData);
  }
  catch(error) {
    errorHandler('So sorry, something went wrong.', request, response);
  }
});

// Location Constructor
function Location(city, geoData){
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

// Weather Route
app.get('/weather', (request, response) => {
  try {
    const forecast = require('./data/darksky.json');
    const weatherData = [];
    for (let i = 0; i < forecast.daily.data.length; i++){
      let dailyForecast = forecast.daily.data[i];
      weatherData.push(new Weather(dailyForecast.summary, dailyForecast.time));
    }
    response.send(weatherData);
  }
  catch(error) {
    errorHandler('So sorry, something went wrong.', request, response);
  }
});

// Weather Constructor
function Weather(forecast, time){
  this.forecast = forecast;
  this.time = new Date(time*1000);
  console.log(this.time);
}

// Error Handler
function errorHandler(error, request, response) {
  response.status(500).send(error);
}


app.listen(PORT, () => console.log(`Server up on port ${PORT}`));

