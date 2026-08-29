import * as service from '../services/projectService.js';

export const listProjects = async (req, res, next) => { try { res.json({ data: await service.getProjects() }); } catch (error) { next(error); } };
export const listSkills = async (req, res, next) => { try { res.json({ data: await service.getSkills() }); } catch (error) { next(error); } };
