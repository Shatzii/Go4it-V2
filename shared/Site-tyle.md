/* === GO4IT SPORTS GLOBAL STYLE === */

:root {
  --electric-blue: #00ffff;
  --deep-black: #000000;
  --soft-white: #ffffff;
  --font-primary: 'Bebas Neue', sans-serif;
  --font-secondary: 'Montserrat', sans-serif;
  --glow-blue: 0 0 8px #00ffff, 0 0 16px #00ffff, 0 0 32px #00ffff;
}

/* === GENERAL RESET & LAYOUT === */
html, body {
  margin: 0;
  padding: 0;
  background-color: var(--deep-black);
  color: var(--soft-white);
  font-family: var(--font-secondary);
  scroll-behavior: smooth;
}

section {
  padding: 4rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* === GLOBAL TYPOGRAPHY === */
h1, h2, h3, h4, h5 {
  font-family: var(--font-primary);
  color: var(--electric-blue);
  letter-spacing: 1px;
  text-shadow: var(--glow-blue);
  text-transform: uppercase;
}

p, span, li {
  font-family: var(--font-secondary);
  line-height: 1.6;
}

/* === GLOWING UI BOXES === */
.card, .profile-box, .stat-box, .cta-button {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid var(--electric-blue);
  box-shadow: var(--glow-blue);
  border-radius: 12px;
  padding: 1.5rem;
  color: var(--soft-white);
  transition: transform 0.2s ease-in-out;
}

.card:hover, .cta-button:hover {
  transform: scale(1.02);
  box-shadow: 0 0 12px var(--electric-blue), 0 0 24px var(--electric-blue);
}

/* === CTA BUTTONS === */
.cta-button {
  background: var(--electric-blue);
  color: var(--deep-black);
  font-weight: bold;
  border: none;
  cursor: pointer;
  padding: 1rem 2rem;
  text-transform: uppercase;
  font-family: var(--font-primary);
  letter-spacing: 2px;
  text-shadow: none;
}

.cta-button.secondary {
  background: transparent;
  color: var(--electric-blue);
  border: 2px solid var(--electric-blue);
}

/* === ATHLETE PROFILE CARDS === */
.athlete-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid var(--electric-blue);
  border-radius: 16px;
  box-shadow: var(--glow-blue);
  padding: 2rem;
  max-width: 400px;
  color: var(--soft-white);
  font-family: var(--font-secondary);
  text-align: center;
}

.athlete-card .name {
  font-family: var(--font-primary);
  font-size: 2.5rem;
  color: var(--electric-blue);
  text-shadow: var(--glow-blue);
  margin-bottom: 0.5rem;
}

.athlete-card .stat {
  font-size: 1.1rem;
  margin: 0.25rem 0;
  color: var(--soft-white);
}

.athlete-card .badge {
  background: var(--electric-blue);
  color: var(--deep-black);
  padding: 0.3rem 0.75rem;
  font-weight: bold;
  border-radius: 999px;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  text-transform: uppercase;
}

/* === NAVIGATION === */
nav {
  background-color: #000000cc;
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--electric-blue);
  box-shadow: var(--glow-blue);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}

nav a {
  color: var(--electric-blue);
  text-decoration: none;
  margin-right: 2rem;
  font-family: var(--font-primary);
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

nav a:hover {
  color: #00cccc;
}

/* === FOOTER === */
footer {
  background: #000;
  border-top: 1px solid var(--electric-blue);
  text-align: center;
  padding: 2rem 1rem;
  font-size: 0.9rem;
  color: var(--soft-white);
  opacity: 0.75;
}

/* === UTILITIES === */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.text-glow {
  color: var(--electric-blue);
  text-shadow: var(--glow-blue);
}

/* === RESPONSIVE === */
@media screen and (max-width: 768px) {
  .grid-2, .grid-3 {
    grid-template-columns: 1fr;
  }

  nav a {
    margin-right: 1rem;
    font-size: 1rem;
  }
}
