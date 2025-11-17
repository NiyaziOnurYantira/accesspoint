// src/routes/accessPointRoutes.js

import express from "express";
import { createAccessPoint } from "../controller/accessPointController.js";

const router = express.Router();

// Yeni Access Point oluşturma endpoint'i
// POST /api/access-points
router.post("/access-points", createAccessPoint);

export default router;
