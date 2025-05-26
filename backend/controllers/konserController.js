import Konser from "../models/konserModel.js";
import Tiket from "../models/tiketModel.js";

//GET KONSER
export const getKonser = async (req, res) => {
  try {
    const konsers = await Konser.findAll();
    res.status(200).json({
      status: "Success",
      message: "Konser Retrieved",
      data: konsers,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error...",
      message: error.message,
    });
  }
};

//GET KONSER BY ID
export const getKonserById = async (req, res) => {
  try {
    const konser = await Konser.findOne({ where: { id: req.params.id } });
    if (!konser) {
      const error = new Error("Konser tidak ditemukan !");
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({
      status: "Success",
      message: "Konser Retrieved",
      data: konser,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error...",
      message: error.message,
    });
  }
};

//ADD KONSER
export const addKonser = async (req, res) => {
  try {
    const { nama, tanggal, lokasi, bintangtamu, harga, quota } = req.body;
    if (!nama || !tanggal || !lokasi || !bintangtamu || !harga || !quota) {
      const msg = `${
        !nama
          ? "Nama"
          : !tanggal
          ? "Tanggal"
          : !lokasi
          ? "Lokasi"
          : !bintangtamu
          ? "Bintang Tamu"
          : !harga
          ? "Harga"
          : "Quota"
      } field cannot be empty !`;
      const error = new Error(msg);
      error.statusCode = 401;
      throw error;
    }

    // Create konser first
    const konser = await Konser.create({
      nama: nama,
      tanggal: tanggal,
      lokasi: lokasi,
      bintangtamu: bintangtamu,
    });

    // Automatically create corresponding ticket
    await Tiket.create({
      nama: nama,
      tanggal: tanggal,
      harga: harga,
      quota: quota,
      konser_id: konser.id,
    });

    res.status(201).json({
      status: "Success",
      message: "Konser & Tiket Added",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

//UPDATE KONSER
export const updateKonser = async (req, res) => {
  try {
    const { nama, tanggal } = req.body;
    const ifKonserExist = await Konser.findOne({
      where: { id: req.params.id },
    });

    if (!nama || !tanggal) {
      const msg = `${!nama ? "Nama" : "Tanggal"} field cannot be empty !`;
      const error = new Error(msg);
      error.statusCode = 401;
      throw error;
    }
    if (!ifKonserExist) {
      const error = new Error("Konser not found !");
      error.statusCode = 400;
      throw error;
    }

    // Update concert
    await Konser.update(
      {
        nama: nama,
        tanggal: tanggal,
      },
      {
        where: { id: req.params.id },
      }
    );

    // Also update the corresponding ticket's name and date
    await Tiket.update(
      {
        nama: nama,
        tanggal: tanggal,
      },
      {
        where: { konser_id: req.params.id },
      }
    );

    res.status(200).json({
      status: "Success",
      message: "Konser & Tiket Updated",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

//DELETE KONSER
export const deleteKonser = async (req, res) => {
  try {
    const ifKonserExist = await Konser.findOne({
      where: { id: req.params.id },
    });
    if (!ifKonserExist) {
      const error = new Error("Konser not found !");
      error.statusCode = 400;
      throw error;
    }

    // Delete associated ticket first
    await Tiket.destroy({
      where: { konser_id: req.params.id },
    });

    // Then delete the concert
    await Konser.destroy({
      where: { id: req.params.id },
    });

    res.status(200).json({
      status: "Success",
      message: "Konser & Tiket Deleted",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};
