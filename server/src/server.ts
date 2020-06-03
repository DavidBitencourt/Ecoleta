import express from "express";

const app = express();

app.get("/users", (request, response) => {
  return response.json(["aaaaasasasasa", "ssssss"]);
});

app.listen(3333);
