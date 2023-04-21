import "dotenv/config";
import express from "express";
import asyncHandler from "express-async-handler";
import fetch from "node-fetch";

const PORT = 3467;
const app = express();

app.use(express.static("public"));

// Respond using an error handler middleware function when it doesn't work.
app.use((error, req, res, next) => {
  console.log(`Unhandled error ${error}. URL: ${req.originalUrl}`);
  res.status(500).send({ error: `500 - Server Error.` });
});

// Note: Don't add or change anything below this line.
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});