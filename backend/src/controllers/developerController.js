import * as service from '../services/developerService.js';

function validateId(id) {
  return typeof id === 'string' && id.length > 0 && id.length <= 100 && /^[A-Za-z0-9_-]+$/.test(id);
}

async function requireDeveloper(id) {
  if (!validateId(id)) {
    const error = new Error('Developer id must contain only letters, numbers, hyphens, or underscores.');
    error.statusCode = 400;
    throw error;
  }

  const developer = await service.getDeveloperById(id);
  if (!developer) {
    const error = new Error(`Developer '${id}' was not found.`);
    error.statusCode = 404;
    throw error;
  }
  return developer;
}

export async function listDevelopers(req, res, next) {
  try { res.json({ data: await service.getDevelopers() }); } catch (error) { next(error); }
}

export async function getDeveloper(req, res, next) {
  try { res.json({ data: await requireDeveloper(req.params.id) }); } catch (error) { next(error); }
}

export async function listSkills(req, res, next) {
  try {
    await requireDeveloper(req.params.id);
    res.json({ data: await service.getDeveloperSkills(req.params.id) });
  } catch (error) { next(error); }
}

export async function listProjects(req, res, next) {
  try {
    await requireDeveloper(req.params.id);
    res.json({ data: await service.getDeveloperProjects(req.params.id) });
  } catch (error) { next(error); }
}
