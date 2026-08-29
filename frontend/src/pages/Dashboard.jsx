import { useEffect, useState } from 'react';
import DeveloperSelector from '../components/DeveloperSelector.jsx';
import SkillList from '../components/SkillList.jsx';
import RecommendationList from '../components/RecommendationList.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { api } from '../services/api.js';

export default function Dashboard() {
  const [developers, setDevelopers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [details, setDetails] = useState({ skills: [], projects: [], recommendations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const selected = developers.find((developer) => developer.id === selectedId);

  useEffect(() => {
    api.developers()
      .then((items) => {
        setDevelopers(items);
        setSelectedId(items[0]?.id || '');
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    setError('');
    Promise.all([api.skills(selectedId), api.projects(selectedId), api.recommendations(selectedId)])
      .then(([skills, projects, recommendations]) => setDetails({
        skills,
        projects,
        recommendations: [...recommendations].sort((a, b) => b.matchPercentage - a.matchPercentage)
      }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedId]);

  if (loading && !developers.length) return <LoadingState label="Connecting to the skill graph..." />;
  if (error && !developers.length) return <ErrorState message={error} />;
  if (!developers.length) return <main><header><p className="eyebrow">Developer intelligence</p><h1>SkillGraph</h1><p>Explore developer skills and discover matching projects</p></header><div className="state">No developers are available yet.</div></main>;

  return <main>
    <header><p className="eyebrow">Developer intelligence</p><h1>SkillGraph</h1><p>Explore developer skills and discover matching projects</p></header>
    <section className="toolbar"><DeveloperSelector developers={developers} selectedId={selectedId} onChange={(id) => { setError(''); setSelectedId(id); }} /></section>
    {selected && <>
      <section className="profile"><div><p className="eyebrow">Selected developer</p><h2>{selected.name}</h2><p>{selected.location} · {selected.experienceYears} years experience</p></div><div className="stat"><strong>{details.skills.length}</strong><span>skills</span></div><div className="stat"><strong>{details.projects.length}</strong><span>projects</span></div></section>
      {error ? <ErrorState message={error} /> : loading ? <LoadingState /> : <>
        <section className="section"><div className="section-title"><h2>Skills</h2><span>{details.skills.length} connected</span></div><SkillList skills={details.skills} /></section>
        <section className="section"><div className="section-title"><h2>Recommended projects</h2><span>Ranked by skill overlap</span></div><RecommendationList projects={details.recommendations} /></section>
      </>}
    </>}
  </main>;
}
