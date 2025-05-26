import { Error } from "sequelize";
import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//GET ADMIN
export const getAdmin = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.status(200).json({
      status: "Success",
      message: "Admins Retrieved",
      data: admins,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error...",
      message: error.message,
    });
  }
};

//GET ADMIN BY ID
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!admin) {
      const error = new Error("Admin tidak ditemukan !");
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({
      status: "Success",
      message: "Admin Retrieved",
      data: admin,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error...",
      message: error.message,
    });
  }
};

//ADD ADMIN
export const addAdmin = async (req, res) => {
  try {
    const { nama, email, umur, pass } = req.body;
    if (!nama || !email || !umur || !pass) {
      const msg = `${
        !nama ? "Nama" : !email ? "Email" : !umur ? "Umur" : "pass"
      } field cannot be empty !`;
      const error = new Error(msg);
      error.statusCode = 401;
      throw error;
    }

    const existingAdmin = await Admin.findOne({
      where: { email: email },
    });

    if (existingAdmin) {
      const error = new Error("Email Sudah Terdaftar !");
      error.statusCode = 400;
      throw error;
    }

    const encryptedpass = await bcrypt.hash(pass, 5);
    await Admin.create({
      nama: nama,
      email: email,
      umur: umur,
      pass: encryptedpass,
    });
    res.status(201).json({
      status: "Success",
      message: "Admin Added",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

//UPDATE ADMIN
export const updateAdmin = async (req, res) => {
  try {
    const { nama, email, pass } = req.body;
    const ifAdminExist = await Admin.findOne({ where: { id: req.params.id } });
    if (!nama || !email || !umur || !pass) {
      const msg = `${
        !nama ? "Nama" : !email ? "Email" : !umur ? "Umur" : "pass"
      } field cannot be empty !`;
      const error = new Error(msg);
      error.statusCode = 401;
      throw error;
    }
    if (!ifAdminExist) {
      const error = new Error("Admin not found !");
      error.statusCode = 400;
      throw error;
    }

    const encryptedpass = await bcrypt.hash(pass, 5);
    let updatedData = { nama, email, encryptedpass };

    await Admin.update(updatedData, {
      where: { id: req.params.id },
    });

    res.status(200).json({
      status: "Success",
      message: "Admin Updated",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

//DELETE ADMIN
export const deleteAdmin = async (req, res) => {
  try {
    const ifAdminExist = await Admin.findOne({ where: { id: req.params.id } });
    if (!ifAdminExist) {
      const error = new Error("Admin not found !");
      error.statusCode = 400;
      throw error;
    }

    await Admin.destroy({ where: { id: req.params.id } });
    res.status(200).json({
      status: "Success",
      message: "Admin Deleted",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// LOGIN HANDLER
export async function loginHandler(req, res) {
  try {
    const { nama, email, umur, pass } = req.body;
    const admin = await Admin.findOne({
      where: {
        email: email,
      },
    });

    if (admin) {
      const adminPlain = admin.toJSON();
      const { pass: _, refresh_token: __, ...safeAdminData } = adminPlain;

      // Verify that nama and umur match
      if (admin.nama !== nama || admin.umur !== parseInt(umur)) {
        return res.status(400).json({
          status: "Failed",
          message: "Data login tidak sesuai",
        });
      }

      const decryptPassword = await bcrypt.compare(pass, admin.pass);
      if (decryptPassword) {
        const accessToken = jwt.sign(
          { ...safeAdminData, nama, umur },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        const refreshToken = jwt.sign(
          { ...safeAdminData, nama, umur },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );

        await Admin.update(
          { refresh_token: refreshToken },
          {
            where: {
              id: admin.id,
            },
          }
        );

        res.cookie("refreshToken", refreshToken, {
          httpOnly: false,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
          secure: true,
        });

        res.status(200).json({
          status: "Success",
          message: "Login Berhasil",
          safeAdminData: { ...safeAdminData, nama, umur },
          accessToken,
        });
      } else {
        res.status(400).json({
          status: "Failed",
          message: "Password atau email salah",
        });
      }
    } else {
      res.status(400).json({
        status: "Failed",
        message: "Password atau email salah",
      });
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
    });
  }
}

// LOGOUT
export async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const admin = await Admin.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!admin.refresh_token) return res.sendStatus(204);
  const adminId = admin.id;
  await Admin.update(
    { refresh_token: null },
    {
      where: {
        id: adminId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
}
