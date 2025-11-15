import { useState } from 'react';

export default function GARInput({ enrollmentId, initialScore, approved, onSubmit, onApprove }) {
  const [score, setScore] = useState(initialScore || '');
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(score);
    setSubmitting(false);
  };
  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 8 }}>
      <label>GAR Score (0-100): </label>
      <input type="number" min={0} max={100} value={score} onChange={e => setScore(e.target.value)} disabled={approved} />
      <button type="submit" disabled={submitting || approved}>Submit</button>
      {approved && <span style={{ marginLeft: 8, color: 'green' }}>Approved</span>}
      {!approved && onApprove && (
        <button type="button" onClick={onApprove} style={{ marginLeft: 8 }}>Approve</button>
      )}
    </form>
  );
}
