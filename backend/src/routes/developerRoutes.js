import { Router } from 'express';
import { getDeveloper, listDevelopers, listProjects, listSkills } from '../controllers/developerController.js';

const router = Router();
router.get('/', listDevelopers);
router.get('/:id', getDeveloper);
router.get('/:id/skills', listSkills);
router.get('/:id/projects', listProjects);
export default router;
