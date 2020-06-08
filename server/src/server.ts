import { errors } from "celebrate";
import cors from "cors";
import express from "express";
import path from "path";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.use(errors());
var porta = process.env.PORT || 3333;
console.log(porta);

app.listen(porta);
