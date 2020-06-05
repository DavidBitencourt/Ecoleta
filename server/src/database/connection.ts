import knex from "knex";
import path from "path";

//path é uma biblioteca padrao que resolve os pconfigura os path padrao para cada S.O
const connection = knex({
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "database.sqlite"),
  },
  useNullAsDefault: true,
});

export default connection;
