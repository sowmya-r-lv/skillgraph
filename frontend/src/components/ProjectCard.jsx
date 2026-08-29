export default function ProjectCard({ project }) {
  const matchedSkills = project.matchedSkills || [];
  return <article className="project-card"><div className="card-heading"><div><p className="eyebrow">{project.category}</p><h3>{project.name}</h3></div><strong>{project.matchPercentage}% match</strong></div><p>{project.description}</p><div className="meta"><span>{project.difficulty}</span><span>{project.totalRequiredSkills} skills required</span></div><div className="matched">Matched: {matchedSkills.length ? matchedSkills.join(', ') : 'No shared skills'}</div></article>;
}
