import Pengunjung from "../models/pengunjungModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//GET PENGUNJUNG
export const getPengunjung = async(req,res) =>{
    try {
        const pengunjungs = await Pengunjung.findAll();
        res.status(200).json({
            status: "Success",
            message: "Pengunjung Retrieved",
            data: pengunjungs,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error...",
            message: error.message,
        });
    }
}

//GET PENGUNJUNG BY ID
export const getPengunjungById = async(req,res) =>{
    try {
        const pengunjung = await Pengunjung.findOne({ where:{id: req.params.id} });
        if (!pengunjung) {
            const error = new Error("Pengunjung tidak ditemukan !");
            error.statusCode = 400;
            throw error;
          }
          res.status(200).json({
            status: "Success",
            message: "Pengunjung Retrieved",
            data: pengunjung,
          });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error...",
            message: error.message,
        });
    }
}

//ADD PENGUNJUNG
export const addPengunjung = async(req,res) => {
    try {
        const {nama, umur, email, pass} = req.body;
        if (!nama || !umur || !email || !pass) {
            const msg = `${
            !nama ? "Nama" : !umur ? "Umur" : !email ? "Email" : "Password"
            } field cannot be empty !`;
            const error = new Error(msg);
            error.statusCode = 401;
            throw error;
        }

        const existingPengunjung = await Pengunjung.findOne({
            where: { email: email },
        });

        if (existingPengunjung) {
            const error = new Error("Email Sudah Terdaftar !");
            error.statusCode = 400;
            throw error;
        }

        const encryptedpass = await bcrypt.hash(pass, 5);
        await Pengunjung.create({
            nama: nama,
            umur: umur,
            email: email,
            pass: encryptedpass
        });
        
        res.status(201).json({
            status: "Success",
            message: "Pengunjung Added",
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}

//UPDATE PENGUNJUNG
export const updatePengunjung = async(req,res) => {
    try {
        const {nama, umur, email} = req.body;
        const ifPengunjungExist = await Pengunjung.findOne({ where: { id: req.params.id } });
        if (!nama || !umur || !email) {
            const msg = `${
            !nama ? "Nama" : !umur ? "umur" : "email"
            } field cannot be empty !`;
            const error = new Error(msg);
            error.statusCode = 401;
            throw error;
        }
        if (!ifPengunjungExist) {
            const error = new Error("Pengunjung not found !");
            error.statusCode = 400;
            throw error;
          }
          let updatedData = {nama,umur,email};
      
          await Pengunjung.update(updatedData, {
            where: { id: req.params.id },
          });
      
          res.status(200).json({
            status: "Success",
            message: "Pengunjung Updated",
          });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}

//DELETE PENGUNJUNG
export const deletePengunjung = async(req,res) => {
    try {
        const ifPengunjungExist = await Pengunjung.findOne({ where: { id: req.params.id } });
        if (!ifPengunjungExist) {
            const error = new Error("Pengunjung not found !");
            error.statusCode = 400;
            throw error;
          }
      
          await Pengunjung.destroy({ where: { id: req.params.id } });
          res.status(200).json({
            status: "Success",
            message: "Pengunjung Deleted",
          });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}

// LOGIN HANDLER FOR PENGUNJUNG
export const loginHandler = async(req, res) => {
  try {
    const { nama, email, umur, pass } = req.body;
    const pengunjung = await Pengunjung.findOne({
      where: { email: email }
    });

    if (pengunjung) {
      // Verify that nama and umur match
      if (pengunjung.nama !== nama || pengunjung.umur !== parseInt(umur)) {
        return res.status(400).json({
          status: "Failed",
          message: "Data login tidak sesuai",
        });
      }

      const match = await bcrypt.compare(pass, pengunjung.pass);
      if (match) {
        const accessToken = jwt.sign({
          id: pengunjung.id,
          nama: pengunjung.nama,
          email: pengunjung.email,
          umur: pengunjung.umur
        }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '1d'
        });

        const refreshToken = jwt.sign({
          id: pengunjung.id,
          nama: pengunjung.nama,
          email: pengunjung.email,
          umur: pengunjung.umur
        }, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: '1d'
        });

        await Pengunjung.update({
          refresh_token: refreshToken
        }, {
          where: { id: pengunjung.id }
        });

        res.cookie('refreshToken', refreshToken, {
          httpOnly: false,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
          secure: true
        });

        res.json({ 
          status: "Success", 
          message: "Login Berhasil",
          accessToken,
          userData: {
            id: pengunjung.id,
            nama: pengunjung.nama,
            email: pengunjung.email,
            umur: pengunjung.umur
          }
        });
      } else {
        res.status(400).json({
          status: "Failed",
          message: "Password salah"
        });
      }
    } else {
      res.status(400).json({
        status: "Failed",
        message: "Email tidak ditemukan"
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message
    });
  }
}