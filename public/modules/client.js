"use strict";
import { unsplashKey } from "./keys.js";

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
  postalCode,
  showError,
} from "./exports.js";

let page = 2;

const createPhotoCard = (href, src, alt, name) => {
  const li = document.createElement("li");
  const a = document.createElement("a");
  const img = document.createElement("img");
  const p = document.createElement("p");
  li.className = "card";
  a.setAttribute("href", href);
  img.setAttribute("src", src);
  img.setAttribute("alt", alt);
  p.innerText = name;
  a.appendChild(img);
  li.appendChild(a);
  li.append(p);
  return li;
};

/* Adapted from Unsplash API documentation
URL: https://unsplash.com/documentation
Authors: @unsplash
Date: April 2023
Adapted by Melanie Archer
*/
const getPhotos = (photoPlace, page) => {
  const UNSPLASH = `https://api.unsplash.com/search/photos?query=${photoPlace},${postalCode}&client_id=${unsplashKey}&order_by=latest&per_page=6&page=${page}`;
  const controller = new AbortController();
  const signal = controller.signal;
  signal.addEventListener("abort", () => {
    console.log("Fetch canceled.");
  });

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
        emptyPhotoGallery(gallery);
        usePhotos(json.results);
        showNextScreen("#screen2", "#screen3");
      }
    });
};

const emptyPhotoGallery = (gallery) => {
  while (gallery.lastChild) {
    gallery.removeChild(gallery.lastChild);
  }
};

const usePhotos = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      let card = createPhotoCard(
        data[i].links.html,
        data[i].urls.thumb,
        data[i].alt_description,
        data[i].user.name
      );
      gallery.appendChild(card);
    }
  } else {
    showError("No photos found.", "#gallery");
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
