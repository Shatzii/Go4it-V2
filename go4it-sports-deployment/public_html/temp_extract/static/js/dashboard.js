
fetch('/api/threats')
  .then(res => res.json())
  .then(data => {
    const heatmap = document.getElementById('heatmap');
    heatmap.innerHTML = '';
    data.forEach(threat => {
      const div = document.createElement('div');
      div.className = 'threat-row';
      div.textContent = `${threat.ip} - Threat Score: ${threat.score}`;
      heatmap.appendChild(div);
    });
});
