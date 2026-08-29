import { driver } from '../db/connection.js';

async function run(query, params = {}) {
  const session = driver.session();
  try { return (await session.run(query, params)).records.map((record) => record.toObject()); }
  finally { await session.close(); }
}

function toPlainProperties(properties) {
  return Object.fromEntries(
    Object.entries(properties).map(([key, value]) => [
      key,
      value && typeof value.toNumber === 'function' ? value.toNumber() : value
    ])
  );
}

export function getDevelopers() {
  return run('MATCH (d:Developer) RETURN d ORDER BY d.name')
    .then((rows) => rows.map(({ d }) => toPlainProperties(d.properties)));
}

export function getDeveloperById(id) {
  return run('MATCH (d:Developer {id: $id}) RETURN d', { id })
    .then((rows) => rows[0] ? toPlainProperties(rows[0].d.properties) : null);
}

export function getDeveloperSkills(id) {
  return run('MATCH (d:Developer {id: $id})-[:HAS_SKILL]->(s:Skill) RETURN s ORDER BY s.name', { id })
    .then((rows) => rows.map(({ s }) => toPlainProperties(s.properties)));
}

export function getDeveloperProjects(id) {
  return run('MATCH (d:Developer {id: $id})-[:WORKED_ON]->(p:Project) RETURN p ORDER BY p.name', { id })
    .then((rows) => rows.map(({ p }) => toPlainProperties(p.properties)));
}
