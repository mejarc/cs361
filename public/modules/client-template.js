"use strict";
import {
  unsplashKey,
} from "./keys.js";

import {
  getZipCode,
  showZipCode,
  fetchPhotos,
  fetchMorePhotos,
  startOver,
  zipCode,
  cancelSearch,
  gallery,
  findUserPlace,
  getApi,
  addPlaceToUi,
  stateName,
  userZipInput,
  photoPlace,
} from "./exports.js";

let page = 2;

const showError = (error, elm) => {
  document.querySelector(elm).innerText = error;
};

/* Adapted from Unsplash API documentation
URL: https://unsplash.com/documentation
Authors: @unsplash
Date: April 2023
Adapted by Melanie Archer
*/
const getPhotos = (photoPlace, page) => {
  const UNSPLASH = `https://api.unsplash.com/search/photos?query=${photoPlace},${userZipInput}&client_id=${unsplashKey}&order_by=latest&per_page=6&page=${page}`;

  // Allow fetch to be canceled
  const controller = new AbortController();
  const signal = controller.signal;
  signal.addEventListener("abort", () => {
    console.log("Fetch canceled.");
  });

  // When the user cancels photo search, empty the gallery and return to first screen
  cancelSearch.addEventListener("click", (e) => {
    controller.abort();
    emptyPhotoGallery(gallery);
    showNextScreen("#screen2", "#screen1");
  });

  fetch(UNSPLASH, {
    signal: signal,
  })
    .then((resp) => resp.json())
    .then((json) => {
      if (json.error) {
        showError(json.error, "#thinker");
      } else {
        usePhotos(json.results);
      }
    });
};

// Remove any images already placed
const emptyPhotoGallery = (gallery) => {
  while (gallery.lastChild) {
    gallery.removeChild(gallery.lastChild);
  }
};

const usePhotos = (data) => {
  emptyPhotoGallery(gallery);

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
    gallery.appendChild(li);

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
fetchPhotos.addEventListener("click", (e) => {
  showNextScreen("#screen1", "#screen2");
  getPhotos(photoPlace, 1);
});

fetchMorePhotos.addEventListener("click", (e) => {
  emptyPhotoGallery(gallery);
  showNextScreen("#screen2", "#screen2");
  getPhotos(photoPlace, page);
  page++;
});

startOver.addEventListener("click", (e) => {
  emptyPhotoGallery(gallery);
  page = 2;
  showNextScreen("#screen3", "#screen1");
});

zipCode.addEventListener("click", (e) => {
  getZipCode(photoPlace, stateName);
});
