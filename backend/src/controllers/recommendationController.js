import { getDeveloperById } from '../services/developerService.js';
import { getRecommendations } from '../services/recommendationService.js';

export async function listRecommendations(req, res, next) {
  try {
    const { id } = req.params;
    if (!id || id.length > 100 || !/^[A-Za-z0-9_-]+$/.test(id)) {
      const error = new Error('Developer id must contain only letters, numbers, hyphens, or underscores.');
      error.statusCode = 400;
      throw error;
    }
    const developer = await getDeveloperById(id);
    if (!developer) {
      const error = new Error(`Developer '${id}' was not found.`);
      error.statusCode = 404;
      throw error;
    }
    res.json({ data: await getRecommendations(id) });
  } catch (error) { next(error); }
}
