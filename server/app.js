import express from "express";
const app = express();
import configRoutesFunction from "./routes/index.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We now have a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
  

