import {
  placeChooser,
  choosePlace,
  placeInput,
  userInputPlace,
  zipCode,
} from "./exports.js";

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
    // TODO: debug. showing up for "France". Data is always defined
    if (data?.countryCode === "US") {
      stateName = data?.principalSubdivision;
      zipCode.classList.toggle("inactive");
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
  if (userInputPlace.value) {
    photoPlace = userInputPlace.value;
    addPlace(photoPlace);

    
    // Get lat/longitude of user-entered place
    let placeAPI = `https://nominatim.openstreetmap.org/search.php?city=${photoPlace}&format=jsonv2`;
    fetch(placeAPI)
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      latitude = data[0].lat;
      longitude = data[0].lon;
      // TODO: use geoApi to get postcode
    });
  } else {
    photoPlace = findUserPlace();
  }
  userInputPlace.value = "";
  placeInput.className = "inactive";
});
