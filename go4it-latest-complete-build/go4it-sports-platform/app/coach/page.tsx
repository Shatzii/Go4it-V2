'use client';
import { useState, useEffect } from 'react';

export default function CoachPage() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Connect to operational coach service endpoints
    fetch('/api/coach/teams').then(res => res.json()).then(setTeams);
    fetch('/api/coach/players').then(res => res.json()).then(setPlayers);
  }, []);

  return (
    <div>
      <h1>Coach Portal</h1>
      <h2>Teams</h2>
      <ul>
        {teams.map(team => (
          <li key={team.id}>{team.name}</li>
        ))}
      </ul>
      <h2>Players</h2>
      <ul>
        {players.map(player => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
}