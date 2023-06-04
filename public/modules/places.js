"use strict";
import { zipKey } from "./keys.js";
import { showError } from "./exports.js";
import {
  placeChooser,
  choosePlace,
  placeInput,
  userInputPlace,
  zipCode,
  zipChooser,
  places
} from "./accessors.js";

export let postalCode = "";
export let photoPlace = "";
export let stateName = "";
export let userZipInput = "";

// Detect user's location in browser
// Adapted from:
// URL: https://medium.com/@mignunez/how-to-access-a-users-location-with-the-geolocation-api-javascript-91376b7fc720
// Date: November 2022
// Author: Miguel Nunez
export const findUserPlace = async () => {
  if (navigator.geolocation) {
    // Find current location, send to Big Data Cloud to convert to human-readable form
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const geoApi = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&latitude=${position.coords.longitude}`;

        // Pass off result to conversion
        getApi(geoApi);
      },
      (error) => {
        console.error(error.message);
      }
    );
  } else {
    alert(
      "Your browser does not support geolocation, which is necessary for this application to run."
    );
  }
};

export const getApi = (geoApi) => {
  fetch(geoApi)
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      if (data) {
        addPlaceToUi(data);
      } else {
        showError("Could not use the data.", "#gallery");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const addPlaceToUi = (placeInput) => {
  let locality;

  // If we're using the browser location, find the city name
  if (placeInput.locality) {
    locality = placeInput?.locality;
  } else {
    locality = placeInput;
  }
  photoPlace = locality;
  
  if (locality) {
    places.forEach((place) => {
      place.innerText = locality;
      place.classList.remove("loader");
    });
  }
};

// Get user location or let user type it in
choosePlace.addEventListener("click", (e) => {
  if (choosePlace.checked) {
    placeInput.classList.toggle("inactive");
  }
});

placeChooser.addEventListener("submit", (e) => {
  e.preventDefault();
  // Text input for user to enter place
  if (userInputPlace.value) {
    photoPlace = userInputPlace.value;
    postalCode = userInputPlace.value;

    // If this is a postal code, find the city
    const ZIP_API = `https://app.zipcodebase.com/api/v1/search?apikey=${zipKey}&codes=${postalCode}`;

    fetch(ZIP_API)
      .then((resp) => resp.json())
      .then((json) => {
        if (json.error) {
          showError(json.error, "#thinker");
        } else {
          if (Object.entries(json.results)[0]) {
            photoPlace = Object.entries(json.results)[0][1][0].city;
          }
          addPlaceToUi(photoPlace);
        }
      });
  } else {
    // User chose browser-detected location
    zipChooser.classList.toggle("inactive");
    photoPlace = findUserPlace();
    addPlaceToUi(photoPlace);
  }
  userInputPlace.value = "";
  placeInput.className = "inactive";
});
