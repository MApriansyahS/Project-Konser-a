import Konser from "../models/konserModel.js";
import Tiket from "../models/tiketModel.js";

//GET TIKET
export const getTiket = async (req, res) => {
  try {
    const tikets = await Tiket.findAll();
    res.status(200).json({
      status: "Success",
      message: "Tiket Retrieved",
      data: tikets,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error...",
      message: error.message,
    });
  }
};

//GET TIKET BY ID
export const getTiketById = async (req, res) => {
  try {
    const tiket = await Tiket.findOne({ where: { id: req.params.id } });
    if (!tiket) {
      const error = new Error("Tiket tidak ditemukan !");
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({
      status: "Success",
      message: "Tiket Retrieved",
      data: tiket,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error...",
      message: error.message,
    });
  }
};

//UPDATE TIKET
export const updateTiket = async (req, res) => {
  try {
    const { harga, quota } = req.body;
    const ifTiketExist = await Tiket.findOne({ where: { id: req.params.id } });

    if (!harga || !quota) {
      const msg = `${!harga ? "Harga" : "Quota"} field cannot be empty !`;
      const error = new Error(msg);
      error.statusCode = 401;
      throw error;
    }
    if (!ifTiketExist) {
      const error = new Error("Tiket not found !");
      error.statusCode = 400;
      throw error;
    }

    await Tiket.update(
      {
        harga: harga,
        quota: quota,
      },
      {
        where: { id: req.params.id },
      }
    );

    res.status(200).json({
      status: "Success",
      message: "Tiket Updated",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

//DELETE TIKET (Only used internally by konserController)
export const deleteTiket = async (req, res) => {
  try {
    const ifTiketExist = await Tiket.findOne({ where: { id: req.params.id } });
    if (!ifTiketExist) {
      const error = new Error("Tiket not found !");
      error.statusCode = 400;
      throw error;
    }

    await Tiket.destroy({
      where: { id: req.params.id },
    });

    res.status(200).json({
      status: "Success",
      message: "Tiket Deleted",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};
