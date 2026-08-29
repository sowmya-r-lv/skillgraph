import { driver } from '../db/connection.js';

export async function getRecommendations(developerId) {
  const query = `
    MATCH (d:Developer {id: $developerId})-[:HAS_SKILL]->(skill:Skill)
    WITH d, collect(skill) AS developerSkills
    MATCH (project:Project)-[:REQUIRES]->(required:Skill)
    WITH d, developerSkills, project, collect(required) AS requiredSkills
    WITH project, requiredSkills,
      [skill IN requiredSkills WHERE skill IN developerSkills] AS matchedSkills
    WHERE size(matchedSkills) > 0
    RETURN project,
      [skill IN matchedSkills | skill.name] AS matchedSkills,
      size(matchedSkills) AS matchedSkillCount,
      size(requiredSkills) AS totalRequiredSkills,
      CASE WHEN size(requiredSkills) = 0 THEN 0.0
        ELSE round((100.0 * size(matchedSkills) / size(requiredSkills)) * 100) / 100 END AS matchPercentage
    ORDER BY matchPercentage DESC, project.name
  `;
  const session = driver.session();
  try {
    const result = await session.run(query, { developerId });
    return result.records.map((record) => ({
      ...record.get('project').properties,
      matchedSkills: record.get('matchedSkills'),
      matchedSkillCount: record.get('matchedSkillCount').toNumber(),
      totalRequiredSkills: record.get('totalRequiredSkills').toNumber(),
      matchPercentage: record.get('matchPercentage')
    }));
  } finally { await session.close(); }
}
