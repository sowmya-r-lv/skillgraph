import { driver, closeConnection } from '../src/db/connection.js';

const developers = [
  ['dev-1', 'Aisha Patel', 6, 'Bengaluru'], ['dev-2', 'Daniel Kim', 8, 'Seoul'], ['dev-3', 'Maya Rodriguez', 4, 'Austin'], ['dev-4', 'Noah Williams', 10, 'London'],
  ['dev-5', 'Priya Shah', 3, 'Pune'], ['dev-6', 'Lucas Martin', 5, 'Paris'], ['dev-7', 'Emily Chen', 7, 'Toronto'], ['dev-8', 'Owen Brown', 2, 'Dublin']
];
const skillCategories = {
  JavaScript: 'Language',
  'Node.js': 'Backend',
  'Express.js': 'Backend',
  React: 'Frontend',
  MongoDB: 'Database',
  PostgreSQL: 'Database',
  Python: 'Language',
  Java: 'Language',
  Docker: 'DevOps',
  AWS: 'Cloud',
  Git: 'Tools',
  'REST API': 'Backend'
};
const skills = Object.entries(skillCategories).map(([name, category], i) => [
  `skill-${i + 1}`, name, category
]);
const companies = [['co-1', 'Northstar Labs', 'Fintech'], ['co-2', 'BrightPath Health', 'Healthcare'], ['co-3', 'Orbit Commerce', 'E-commerce'], ['co-4', 'GreenGrid Energy', 'Energy'], ['co-5', 'CivicStack', 'Public sector']];
const projects = [
  ['proj-1', 'Pulse Analytics', 'Real-time dashboards for product teams.', 'Intermediate', 'Analytics'], ['proj-2', 'CareConnect', 'A secure appointment coordination platform.', 'Advanced', 'Healthcare'], ['proj-3', 'MarketNest', 'A scalable marketplace for independent sellers.', 'Intermediate', 'E-commerce'], ['proj-4', 'CloudLedger', 'Serverless expense tracking for small businesses.', 'Advanced', 'Fintech'], ['proj-5', 'CityFix', 'A civic issue reporting and routing tool.', 'Beginner', 'Public sector'], ['proj-6', 'FleetFlow', 'Logistics planning with live vehicle status.', 'Advanced', 'Logistics'], ['proj-7', 'LearnLoop', 'Adaptive learning paths for technical teams.', 'Intermediate', 'Education'], ['proj-8', 'SolarSight', 'Energy production monitoring and alerts.', 'Intermediate', 'Energy'], ['proj-9', 'TeamCanvas', 'Collaborative planning for distributed teams.', 'Beginner', 'Productivity'], ['proj-10', 'SecureVault', 'Role-aware document storage and audit trails.', 'Advanced', 'Security']
];
const developerSkills = [['dev-1', [1, 2, 3, 4, 9, 10, 11, 12]], ['dev-2', [1, 2, 3, 5, 6, 9, 11, 12]], ['dev-3', [1, 4, 7, 9, 11]], ['dev-4', [7, 8, 9, 10, 11, 12]], ['dev-5', [1, 2, 4, 6, 11, 12]], ['dev-6', [1, 4, 7, 9, 11]], ['dev-7', [1, 2, 3, 4, 6, 10, 11]], ['dev-8', [1, 2, 4, 11]]];
const projectSkills = [[1, [1, 4, 9, 11]], [2, [1, 2, 3, 6, 9, 12]], [3, [1, 2, 4, 5, 11]], [4, [2, 6, 9, 10, 12]], [5, [1, 3, 4, 7, 11]], [6, [2, 7, 9, 10, 12]], [7, [1, 4, 7, 11]], [8, [1, 2, 9, 10]], [9, [1, 4, 11]], [10, [2, 6, 9, 11, 12]]];
const projectOwners = [1, 2, 3, 4, 5, 1, 2, 4, 3, 5];
const workedOn = [['dev-1', [1, 4, 9]], ['dev-2', [2, 3, 10]], ['dev-3', [5, 7]], ['dev-4', [4, 6, 8]], ['dev-5', [1, 5, 9]], ['dev-6', [7, 8]], ['dev-7', [2, 3, 10]], ['dev-8', [5, 9]]];

const session = driver.session();
try {
  await session.run('CREATE CONSTRAINT developer_id IF NOT EXISTS FOR (n:Developer) REQUIRE n.id IS UNIQUE');
  await session.run('CREATE CONSTRAINT skill_id IF NOT EXISTS FOR (n:Skill) REQUIRE n.id IS UNIQUE');
  await session.run('CREATE CONSTRAINT project_id IF NOT EXISTS FOR (n:Project) REQUIRE n.id IS UNIQUE');
  await session.run('CREATE CONSTRAINT company_id IF NOT EXISTS FOR (n:Company) REQUIRE n.id IS UNIQUE');
  await session.run('UNWIND $developers AS row MERGE (d:Developer {id: row[0]}) SET d.name=row[1], d.experienceYears=row[2], d.location=row[3]', { developers });
  await session.run('UNWIND $skills AS row MERGE (s:Skill {id: row[0]}) SET s.name=row[1], s.category=row[2]', { skills });
  await session.run('UNWIND $companies AS row MERGE (c:Company {id: row[0]}) SET c.name=row[1], c.industry=row[2]', { companies });
  await session.run('UNWIND $projects AS row MERGE (p:Project {id: row[0]}) SET p.name=row[1], p.description=row[2], p.difficulty=row[3], p.category=row[4]', { projects });
  await session.run('UNWIND $links AS link MATCH (d:Developer {id: link[0]}), (s:Skill {id: link[1]}) MERGE (d)-[:HAS_SKILL]->(s)', { links: developerSkills.flatMap(([id, ids]) => ids.map((skill) => [id, `skill-${skill}`])) });
  await session.run('UNWIND $links AS link MATCH (p:Project {id: link[0]}), (s:Skill {id: link[1]}) MERGE (p)-[:REQUIRES]->(s)', { links: projectSkills.flatMap(([number, ids]) => ids.map((skill) => [`proj-${number}`, `skill-${skill}`])) });
  await session.run('UNWIND $links AS link MATCH (p:Project {id: link[0]}), (c:Company {id: link[1]}) MERGE (p)-[:OWNED_BY]->(c)', { links: projectOwners.map((company, i) => [`proj-${i + 1}`, `co-${company}`]) });
  await session.run('UNWIND $links AS link MATCH (d:Developer {id: link[0]}), (p:Project {id: link[1]}) MERGE (d)-[:WORKED_ON]->(p)', { links: workedOn.flatMap(([id, ids]) => ids.map((project) => [id, `proj-${project}`])) });
  await session.run('UNWIND $links AS link MATCH (d:Developer {id: link[0]}), (c:Company {id: link[1]}) MERGE (d)-[:WORKS_AT]->(c)', { links: developers.map((d, i) => [d[0], `co-${(i % 5) + 1}`]) });
  console.log('Seed completed: 8 developers, 12 skills, 10 projects, and 5 companies.');
} catch (error) { console.error('Seed failed:', error.message); process.exitCode = 1; }
finally { await session.close(); await closeConnection(); }
