// src/routes/adminRoutes.js

import express from "express";
import {
  createAdmin,
  loginAdmin,
  getAllAdmins,
} from "../controller/adminController.js";

const router = express.Router();

// Admin oluşturma (ilk kurulum için)
router.post("/admin/create", createAdmin);

// Admin girişi
router.post("/admin/login", loginAdmin);

// Adminleri listele (geliştirme amaçlı)
router.get("/admin/list", getAllAdmins);

export default router;
