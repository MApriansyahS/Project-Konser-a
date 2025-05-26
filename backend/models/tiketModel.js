import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Konser from "./konserModel.js";

const Tiket = db.define(
  "tiket",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: Sequelize.STRING,
    tanggal: Sequelize.STRING,
    harga: Sequelize.INTEGER,
    quota: Sequelize.INTEGER,
    konser_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'konser',
        key: 'id'
      }
    }
  },
  {
    freezeTableName: true,
  }
);

// Define relationship with Konser
Tiket.belongsTo(Konser, {
  foreignKey: 'konser_id',
  as: 'konser'
});

db.sync().then(() => console.log("Database synced"));

export default Tiket;
