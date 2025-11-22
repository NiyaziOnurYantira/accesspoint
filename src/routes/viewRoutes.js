import express from 'express';
import viewController from '../controller/viewController.js';

const router = express.Router();

router.get('/new-access-point', viewController.renderNewAccessPointPage);
router.get('/:id', viewController.renderAccessPointDetailPage);

export default router;
