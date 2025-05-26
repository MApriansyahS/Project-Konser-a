import express from "express";
import {
  getAdmin,
  getAdminById,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  loginHandler,
  logout,
} from "../controllers/adminController.js";
import {
  getPengunjung,
  getPengunjungById,
  addPengunjung,
  updatePengunjung,
  deletePengunjung,
} from "../controllers/pengunjungController.js";
import {
  getKonser,
  getKonserById,
  addKonser,
  updateKonser,
  deleteKonser,
} from "../controllers/konserController.js";
import {
  getTiket,
  getTiketById,
  updateTiket,
  deleteTiket,
} from "../controllers/tiketController.js";
import { orderTicket } from "../controllers/orderController.js";
import { refreshToken } from "../controllers/refreshToken.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//endpoint refresh token
router.get("/token", refreshToken);

//endpoint auth
router.post("/register", addAdmin);
router.post("/login", loginHandler);
router.post("/pengunjung/login", loginHandler); // endpoint login untuk pengunjung
router.delete("/logout", logout);

// ADMINS
router.get("/admin", verifyToken, getAdmin);
router.get("/admin/:id", verifyToken, getAdminById);
// router.patch("/admin/:id", verifyToken, updateAdmin);
// router.delete("/admin/:id", verifyToken, deleteAdmin);

// PENGUNJUNG
router.get("/pengunjung", verifyToken, getPengunjung);
router.get("/pengunjung/:id", verifyToken, getPengunjungById);
// Removed direct pengunjung creation - now handled by orderTicket
router.patch("/pengunjung/:id", verifyToken, updatePengunjung);
router.delete("/pengunjung/:id", verifyToken, deletePengunjung);

// KONSER
router.get("/konser", getKonser); // Removed verifyToken to allow public viewing
router.get("/konser/:id", getKonserById); // Removed verifyToken to allow public viewing
router.post("/konser", verifyToken, addKonser);
router.patch("/konser/:id", verifyToken, updateKonser);
router.delete("/konser/:id", verifyToken, deleteKonser);

// TIKET
router.get("/tiket", getTiket); // Removed verifyToken to allow public viewing
router.get("/tiket/:id", getTiketById); // Removed verifyToken to allow public viewing
// Removed addTiket - tickets are created automatically with konser
router.patch("/tiket/:id", verifyToken, updateTiket);
// Removed deleteTiket - tickets are deleted automatically with konser

// ORDER TIKET
router.post("/order/:id", orderTicket); // Changed to POST and removed verifyToken for public access

export default router;
