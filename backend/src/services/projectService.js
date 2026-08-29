import { driver } from '../db/connection.js';

export async function getProjects() {
  const session = driver.session();
  try {
    const result = await session.run('MATCH (p:Project) RETURN p ORDER BY p.name');
    return result.records.map((record) => record.get('p').properties);
  } finally { await session.close(); }
}

export async function getSkills() {
  const session = driver.session();
  try {
    const result = await session.run('MATCH (s:Skill) RETURN s ORDER BY s.name');
    return result.records.map((record) => record.get('s').properties);
  } finally { await session.close(); }
}
