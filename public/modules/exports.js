import { getZipCode, showZipCode } from "./zipcode.js";
import {
  fetchPhotos,
  fetchMorePhotos,
  startOver,
  cancelSearch,
  gallery,
  placeChooser,
  choosePlace,
  placeInput,
  userInputPlace,
  zipCode,
  zipChooser
} from "./accessors.js";

import {
  findUserPlace,
  getApi,
  addPlaceToUi,
  stateName,
  userZipInput,
  photoPlace,
  postalCode
} from "./places.js";

export const showError = (error, elm) => {
  document.querySelector(elm).innerText = error;
};

export {
  getZipCode,
  showZipCode,
  fetchPhotos,
  fetchMorePhotos,
  startOver,
  cancelSearch,
  gallery,
  placeChooser,
  choosePlace,
  placeInput,
  userInputPlace,
  zipCode,
  findUserPlace,
  getApi,
  addPlaceToUi,
  stateName,
  userZipInput,
  photoPlace,
  zipChooser,
  postalCode
};
