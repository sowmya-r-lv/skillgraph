export default function SkillList({ skills }) {
  if (!skills.length) return <div className="state">No skills found for this developer.</div>;
  return <div className="skill-list">{skills.map((skill) => <span className="skill" key={skill.id}>{skill.name}</span>)}</div>;
}
