// If user is in USA, offer way to retrieve ZIP code
export const getZipCode = (city, state) => {
  // Call microservice for ZIP code
  const URL = "http://localhost:4500/zipcode";
  event.preventDefault();
  fetch(URL)
    .then((result) => {
      return result.json();
    })
    .then((json) => {
      showZipCode(json.postcode);
    });
};

export const showZipCode = (zip) => {
  let zipButton = document.getElementById("zip");
  zipButton.insertAdjacentHTML("afterend", `<p>Your ZIP code: ${zip}</p>`);
};
