
"use strict";
const key = "NNu9H9hYedeITLk_PuCxWDs5R7B41fXawA-pURd-yYE";


// Detect user's location on window load
// Adapted from:
// URL: https://medium.com/@mignunez/how-to-access-a-users-location-with-the-geolocation-api-javascript-91376b7fc720
// Date: November 2022
// Author: Miguel Nunez
const findUserPlace = async () => {
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

const getApi = (geoApi) => {
  fetch(geoApi)
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      if (data) {
        addPlace(data);
      } else {
        showError("Could not use the data.");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const addPlace = (data) => {
  if (data) {
    const locality = data?.locality;
    const places = document.querySelectorAll(".place");
    if (locality) {
      places.forEach((place) => {
        place.innerText = locality;
        place.classList.remove("loader");
      });
    }
  }
};

const showError = (error) => {
  const places = document.querySelectorAll(".place");
  places.forEach((place) => {
    place.innerText = error;
  });
};

/* Adapted from Unsplash API documentation
URL: https://unsplash.com/documentation
Authors: @unsplash
Date: April 2023
Adapted by Melanie Archer
*/

async function getPhotos(locale) {
  const UNSPLASH = `https://api.unsplash.com/photos?client_id=${key}&order_by=latest&location=${locale}`;
  fetch(UNSPLASH)
    .then((resp) => resp.json())
    .then((json) => {
      if (json.error) {
        // TODO: add text content
        showError(json.error);
      } else {
        console.log(`using ${locale}`);
        usePhotos(json);
      }
    });
}
const usePhotos = (data) => {
  const cards = document.querySelector('#gallery .cards');
  for (let i = 0; i < data.length; i++){
    const li = document.createElement('li');
    const a = document.createElement('a');
    const img = document.createElement('img');
    const p = document.createElement('p');
    li.className = 'card';
    a.setAttribute('href', data[i].links.html);
    img.setAttribute('src', data[i].urls.thumb);
    img.setAttribute('alt', data[i].alt_description);
    a.appendChild(img);
    li.appendChild(a);
    cards.appendChild(li);

  }
};
// Event listeners
document.addEventListener("DOMContentLoaded", (evt) => {
  let locale = findUserPlace();
  addPlace(locale);
  
const fetchPhotos = document.getElementById("fetchPhotos");
fetchPhotos.addEventListener("click", getPhotos(locale));
});
