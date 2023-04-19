// Adapted from Assignment 5, CS290 - Web Development
// Date: November 2022
// URL: https://canvas.oregonstate.edu/courses/1896084/assignments/8957631?module_item_id=22416085
// Author: Pam Van Londen
// Adapted by Melanie Archer

import express from "express";
import asyncHandler from "express-async-handler";
import fetch from "node-fetch";

const PORT = 3467;
const app = express();

app.use(express.static("public"));

// TODO: use Unsplash
const API = "https://randomuser.me/api/";


// call the Unsplash API
app.get(
  "/photos",
  asyncHandler(async (req, res) => {
    const resp = await fetch(API);
    const data = await resp.json();
    res.send(data);
  })
);

// Error handler when API doesn't work
app.use((error, req, res, next) => {
  console.log(`Unhandled error ${error}. URL: ${req.originalUrl}`);
  res.status(500).send({ error: `500 - Server Error.` });
});

app.listen(PORT, () => {
  console.log(`Node/Express listening on port ${PORT}...`);
});
