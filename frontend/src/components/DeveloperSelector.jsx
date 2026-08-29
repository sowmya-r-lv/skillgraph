export default function DeveloperSelector({ developers, selectedId, onChange }) {
  return <label className="selector">Choose a developer<select value={selectedId} onChange={(event) => onChange(event.target.value)} disabled={!developers.length}>{developers.map((developer) => <option key={developer.id} value={developer.id}>{developer.name}</option>)}</select></label>;
}
