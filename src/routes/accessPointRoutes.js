// src/routes/accessPointRoutes.js

import express from 'express';
import {
  createAccessPoint,
  getAccessPointById,
} from '../controller/accessPointController.js';

const router = express.Router();

// Yeni Access Point oluşturma endpoint'i
// POST /api/access-points
router.post('/access-points', createAccessPoint);

// Belirli bir Access Point çekme endpoint'i
// GET /api/access-points/:id
router.get('/access-points/:id', getAccessPointById);

export default router;
