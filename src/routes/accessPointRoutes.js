// src/routes/accessPointRoutes.js

import express from "express";
import {
  createAccessPoint,
  createAccessPointWithAuth,
  getAccessPointById,
  updateAccessPoint,
  updateAccessPointWithAuth,
  getAllAccessPoints,
  deleteAccessPointWithAuth,
} from "../controller/accessPointController.js";
import { verifyAdmin } from "../controller/adminController.js";

const router = express.Router();

// Genel endpoint'ler (admin doğrulaması yok)
router.post("/access-points", createAccessPoint);
router.get("/access-points/:id", getAccessPointById);
router.get("/access-points", getAllAccessPoints);
router.put("/access-points/:id", updateAccessPoint);

// Admin doğrulamalı endpoint'ler
router.post("/admin/access-points", verifyAdmin, createAccessPointWithAuth);
router.put("/admin/access-points/:id", verifyAdmin, updateAccessPointWithAuth);
router.delete("/admin/access-points/:id", verifyAdmin, deleteAccessPointWithAuth);

export default router;
