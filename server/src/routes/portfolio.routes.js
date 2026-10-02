import { Router } from 'express';
import { getAll, sectionHandler, listProjects, getProject } from '../controllers/portfolio.controller.js';

const router = Router();

router.get('/portfolio', getAll);
router.get('/profile', sectionHandler('profile'));
router.get('/socials', sectionHandler('socials'));
router.get('/stats', sectionHandler('stats'));
router.get('/marquee', sectionHandler('marquee'));
router.get('/hero-cards', sectionHandler('heroCards'));
router.get('/skills', sectionHandler('skills'));
router.get('/services', sectionHandler('services'));
router.get('/experience', sectionHandler('experience'));
router.get('/education', sectionHandler('education'));
router.get('/certificates', sectionHandler('certificates'));
router.get('/projects', listProjects);
router.get('/projects/:slug', getProject);

export default router;
