import ProjectCard from './ProjectCard.jsx';
export default function RecommendationList({ projects }) { return projects.length ? <div className="project-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <div className="state">No matching projects yet.</div>; }
