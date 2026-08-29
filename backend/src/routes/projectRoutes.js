import { Router } from 'express';
import { listProjects, listSkills } from '../controllers/projectController.js';

const router = Router();
router.get('/', listProjects);
export default router;
