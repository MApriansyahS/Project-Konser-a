import Pengunjung from "../models/pengunjungModel.js";
import Tiket from "../models/tiketModel.js";
import { Op } from "sequelize";

// ORDER TICKET
export async function orderTicket(req, res) {
  try {
    const { nama, umur, email } = req.body;

    if (!nama || !umur || !email) {
      const msg = `${
        !nama ? "Nama" : !umur ? "Umur" : "Email"
      } field cannot be empty !`;
      const error = new Error(msg);
      error.statusCode = 401;
      throw error;
    }

    const tiket = await Tiket.findOne({
      where: { id: req.params.id },
    });

    if (!tiket) {
      const error = new Error("Tiket tidak ditemukan !");
      error.statusCode = 400;
      throw error;
    }

    if (umur <= 16) {
      const error = new Error("Umur tidak mencukupi !");
      error.statusCode = 400;
      throw error;
    }

    if (tiket.quota < 1) {
      const error = new Error("Quota tiket tidak mencukupi !");
      error.statusCode = 400;
      throw error;
    }

    // Decrease ticket quota by 1
    const updatedQuota = tiket.quota - 1;
    await Tiket.update(
      { quota: updatedQuota },
      {
        where: { id: req.params.id },
      }
    );

    // Find or create pengunjung
    let pengunjung = await Pengunjung.findOne({
      where: { email: email },
    });

    if (!pengunjung) {
      // Create new pengunjung if doesn't exist
      pengunjung = await Pengunjung.create({
        nama: nama,
        umur: umur,
        email: email,
        tiket: [tiket.nama], // Start with the first ticket
      });
    } else {
      // Update existing pengunjung's tickets
      const currentTickets = pengunjung.tiket || [];
      const updatedTickets = [...currentTickets, tiket.nama];

      await Pengunjung.update(
        { tiket: updatedTickets },
        { where: { id: pengunjung.id } }
      );
    }

    res.status(200).json({
      status: "Success",
      message: "Order Created",
      data: {
        pengunjung: pengunjung,
        tiket: tiket.nama,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}
