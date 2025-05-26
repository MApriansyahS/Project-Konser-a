import { Sequelize } from "sequelize";
import db from "../config/database.js";

const Admin = db.define(
  "admin",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: Sequelize.STRING,
    email: Sequelize.STRING,
    umur: Sequelize.INTEGER,
    pass: Sequelize.STRING,
    refresh_token: Sequelize.TEXT,
  },
  {
    freezeTableName: true,
  }
);

db.sync().then(() => console.log("Database synced"));

export default Admin;
