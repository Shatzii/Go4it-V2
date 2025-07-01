'use client';
import { useState, useEffect } from 'react';

const StarPathPage = () => {
  const [skillNodes, setSkillNodes] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState(''); // Assuming you have a way to set this

  const loadSkillData = async () => {
    try {
      setLoading(true);
      
      const nodesResponse = await fetch(`/api/skill-tree/nodes?sport=${selectedSport}`);
      const nodesData = await nodesResponse.json();
      setSkillNodes(nodesData.nodes || []);
      
      const userResponse = await fetch('/api/skill-tree/user');
      const userData = await userResponse.json();
      setUserSkills(userData || []);
      
      const statsResponse = await fetch(`/api/skill-tree/stats?sport=${selectedSport}`);
      const statsData = await statsResponse.json();
      setStats(statsData);
      
    } catch (error) {
      console.error('Error loading skill data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkillData();
  }, [selectedSport]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>StarPath</h1>
      {/* Render skill nodes, user skills, and stats here */}
    </div>
  );
};

export default StarPathPage;