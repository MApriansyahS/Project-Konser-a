import { Sequelize, DataTypes } from "sequelize";
import db from "../config/database.js";

const Pengunjung = db.define(
  "pengunjung",
  {
    nama: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    umur: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    pass: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tiket: {
      type: DataTypes.JSON, // Store tickets as JSON array
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("tiket");
        if (!rawValue) return [];
        return Array.isArray(rawValue) ? rawValue : [rawValue];
      },
      set(value) {
        this.setDataValue("tiket", Array.isArray(value) ? value : [value]);
      },
    },
    refresh_token: {
      type: Sequelize.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

db.sync().then(() => console.log("Database synced"));

export default Pengunjung;
