// src/routes/accessPointRoutes.js

import express from "express";
import {
  createAccessPoint,
  getAccessPointById,
  updateAccessPoint, // <- eklendi
} from "../controller/accessPointController.js";

const router = express.Router();

router.post("/access-points", createAccessPoint);
router.get("/access-points/:id", getAccessPointById);

// YENİ: Güncelleme endpoint'i
router.put("/access-points/:id", updateAccessPoint);

export default router;
