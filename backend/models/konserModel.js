import { Sequelize } from "sequelize";
import db from "../config/database.js";

const Konser = db.define(
  "konser",
  {
    nama: Sequelize.STRING,
    tanggal: Sequelize.STRING,
    lokasi: Sequelize.STRING,
    bintangtamu: Sequelize.STRING,
  },
  {
    freezeTableName: true,
  }
);

db.sync().then(() => console.log("Database synced"));

export default Konser;
