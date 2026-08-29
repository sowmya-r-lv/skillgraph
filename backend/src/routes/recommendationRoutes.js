import { Router } from 'express';
import { listRecommendations } from '../controllers/recommendationController.js';

const router = Router();
router.get('/:id/recommendations', listRecommendations);
export default router;
