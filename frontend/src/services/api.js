const API_URL = 'https://skillgraph-pysw.onrender.com/api';

async function request(path) {
  const response = await fetch(`${API_URL}${path}`);
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || 'Unable to load data from SkillGraph.');
  }

  return body.data;
}

export const api = {
  developers: () => request('/developers'),
  skills: (id) => request(`/developers/${encodeURIComponent(id)}/skills`),
  projects: (id) => request(`/developers/${encodeURIComponent(id)}/projects`),
  recommendations: (id) =>
    request(`/developers/${encodeURIComponent(id)}/recommendations`)
};