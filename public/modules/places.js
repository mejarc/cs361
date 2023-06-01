"use strict";
import { zipKey } from "./keys.js";

import {
  placeChooser,
  choosePlace,
  placeInput,
  userInputPlace,
  zipCode,
  zipChooser,
} from "./accessors.js";

export let photoPlace;
export let stateName = "";
export let zip = "";
export let latitude = "";
export let longitude = "";

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
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
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
        addPlace(data);
      } else {
        showError("Could not use the data.", "#gallery");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const addPlace = (data) => {
  if (data) {
    let locality;
    if (data.locality) {
      locality = data?.locality;
    } else {
      locality = data;
    }
    photoPlace = locality;

    // Detect USA
    if (data?.countryCode === "US") {
      stateName = data?.principalSubdivision;
    }
    const places = document.querySelectorAll(".place");
    if (locality) {
      places.forEach((place) => {
        place.innerText = locality;
        place.classList.remove("loader");
      });
    }
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
    // If this is a ZIP code, find the city
    const ZIP_API = `https://app.zipcodebase.com/api/v1/search?apikey=${zipKey}&codes=${userInputPlace.value}`;

    fetch(ZIP_API)
      .then((resp) => resp.json())
      .then((json) => {
        if (json.error) {
          showError(json.error, "#thinker");
        } else {
          const locator = Object.entries(json.results)[0][1][0].city;
          console.log(locator);
          photoPlace = locator;
          // Add this place to UI display
          addPlace(photoPlace);
        }
      });
  } else {
    // User chose browser-detected location
    zipChooser.classList.toggle("inactive");
    photoPlace = findUserPlace();
    // Add this place to UI display
    addPlace(photoPlace);
  }
  userInputPlace.value = "";
  placeInput.className = "inactive";
});
