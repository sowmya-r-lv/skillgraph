// All application queries are parameterized. $developerId comes from the route parameter.
MATCH (d:Developer) RETURN d ORDER BY d.name;
MATCH (s:Skill) RETURN s ORDER BY s.name;
MATCH (p:Project) RETURN p ORDER BY p.name;

// Relationship-based recommendation: Developer -> Skill <- Project.
MATCH (d:Developer {id: $developerId})-[:HAS_SKILL]->(skill:Skill)
WITH d, collect(skill) AS developerSkills
MATCH (project:Project)-[:REQUIRES]->(required:Skill)
WITH project, developerSkills, collect(required) AS requiredSkills
WITH project, requiredSkills, [s IN requiredSkills WHERE s IN developerSkills] AS matchedSkills
WHERE size(matchedSkills) > 0
RETURN project, [s IN matchedSkills | s.name] AS matchedSkills,
  size(matchedSkills) AS matchedSkillCount,
  size(requiredSkills) AS totalRequiredSkills,
  100.0 * size(matchedSkills) / size(requiredSkills) AS matchPercentage;

// Two-hop traversal: find companies connected to a developer through projects.
MATCH (d:Developer {id: $developerId})-[:WORKED_ON]->(:Project)-[:OWNED_BY]->(company:Company)
RETURN DISTINCT company;
