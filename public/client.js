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
        showError("Could not use the data.", '#gallery');
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

const showError = (error, elm) => {
  document.querySelector(elm).innerText = error;
};

/* Adapted from Unsplash API documentation
URL: https://unsplash.com/documentation
Authors: @unsplash
Date: April 2023
Adapted by Melanie Archer
*/

async function getPhotos(place, page) {
  const UNSPLASH = `https://api.unsplash.com/photos?client_id=${key}&order_by=latest&per_page=6&page=${page}`;

  // Allow fetch to be canceled
  const controller = new AbortController();
  const signal = controller.signal;
  signal.addEventListener("abort", () => {
    console.log("Fetch canceled.");
  });

  // When the user cancels photo search, empty the gallery and return to first screen
  const cancelSearch = document.getElementById("cancelSearch");
  cancelSearch.addEventListener("click", (e) => {
    e.preventDefault();
    controller.abort();
    emptyPhotoGallery();
    showNextScreen("#screen2", "#screen1");
  });

  // TODO you must take the photo id of each photo and then get its location in a separate call
  fetch(UNSPLASH, {
    signal: signal,
  })
    .then((resp) => resp.json())
    .then((json) => {
      if (json.error) {
        showError(json.error, '#thinker');
      } else {
        usePhotos(json);
      }
    });
}

// Remove any images already placed
const emptyPhotoGallery = () => {
  const gallery = document.querySelector("#gallery .cards");
  while (gallery.lastChild) {
    gallery.removeChild(gallery.lastChild);
  }
};

const usePhotos = (data) => {
  const cards = document.querySelector("#gallery .cards");
  emptyPhotoGallery();

  for (let i = 0; i < data.length; i++) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const img = document.createElement("img");
    const p = document.createElement("p");
    li.className = "card";
    a.setAttribute("href", data[i].links.html);
    img.setAttribute("src", data[i].urls.thumb);
    img.setAttribute("alt", data[i].alt_description);
    p.innerText = data[i].user.name;

    a.appendChild(img);
    li.appendChild(a);
    li.append(p);
    cards.appendChild(li);

    // Show gallery screen
    showNextScreen("#screen2", "#screen3");
  }
};

const showNextScreen = (elm, nextScreen) => {
  const trigger = document.querySelector(elm);
  const next = document.querySelector(nextScreen);
  trigger.classList.toggle("active");

  next.classList.toggle("inactive");
  next.className = "active";

  trigger.className = "inactive";
};


// Event listeners
document.addEventListener("DOMContentLoaded", (evt) => {
  let locale = findUserPlace();
  addPlace(locale);

  const fetchPhotos = document.getElementById("fetchPhotos");
  fetchPhotos.addEventListener("click", (e) => {
    e.preventDefault();
    showNextScreen("#screen1", "#screen2");
    getPhotos(locale.locality, 1);
  });
  const fetchMorePhotos = document.getElementById("fetchMorePhotos");
  fetchMorePhotos.addEventListener("click", (e) => {
    e.preventDefault();
    showNextScreen("#screen2", "#screen2");
    getPhotos(locale.locality, 2);
  });

  const startOver = document.getElementById('startOver');
  startOver.addEventListener('click', (e) => {
    e.preventDefault();
    emptyPhotoGallery();
    showNextScreen("#screen3", '#screen1');
  });


});
