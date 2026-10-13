import React, { useState } from 'react';
import { Grid, Sparkles, HeartHandshake, TrendingUp } from 'lucide-react';
import { haptics } from '../engine/audioHaptics';

export default function CompatibilityMatrix({ profiles, matrix, onSelectPair }) {
  const [selectedP1, setSelectedP1] = useState(profiles[0].id);

  // Compute top global pairings
  const allPairs = [];
  for (let i = 0; i < profiles.length; i++) {
    for (let j = i + 1; j < profiles.length; j++) {
      const p1 = profiles[i];
      const p2 = profiles[j];
      const compat = matrix[p1.id] && matrix[p1.id][p2.id];
      if (compat) {
        allPairs.push({
          p1,
          p2,
          score: compat.overall,
          breakdown: compat.breakdown,
          verdict: compat.verdict,
          diagnostic: compat.diagnostic
        });
      }
    }
  }

  allPairs.sort((a, b) => b.score - a.score);
  const top10 = allPairs.slice(0, 10);

  // Top matches for selected profile
  const p1Matches = [];
  const currentP1 = profiles.find(p => p.id === selectedP1) || profiles[0];
  profiles.forEach(p2 => {
    if (p2.id !== selectedP1) {
      const compat = matrix[selectedP1] && matrix[selectedP1][p2.id];
      if (compat) {
        p1Matches.push({
          p2,
          score: compat.overall,
          verdict: compat.verdict,
          diagnostic: compat.diagnostic,
          breakdown: compat.breakdown
        });
      }
    }
  });
  p1Matches.sort((a, b) => b.score - a.score);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Top Header */}
      <div className="tactile-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 className="font-editorial-serif" style={{ fontSize: '1.8rem', fontWeight: 600 }}>
                Autonomous Compatibility Matrix & Leaderboard
              </h2>
              <span className="match-badge high">300 PAIRWISE EVALUATIONS</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Multi-dimensional scoring synthesized from Big Five vector distance, core value synergy, lifestyle pacing, and conversational banter dynamics.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Global Top 10 Leaderboard */}
        <div className="tactile-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <TrendingUp size={18} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Top 10 Global Matches</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {top10.map((pair, idx) => (
              <div
                key={idx}
                onClick={() => {
                  haptics.playClick(230);
                  onSelectPair(pair.p1.id, pair.p2.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={() => haptics.playHover()}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', width: '20px' }}>
                    #{idx + 1}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <img src={pair.p1.avatar} alt={pair.p1.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{pair.p1.name.split(' ')[0]}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>&</span>
                    <img src={pair.p2.avatar} alt={pair.p2.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{pair.p2.name.split(' ')[0]}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="match-badge high" style={{ fontSize: '0.72rem' }}>
                    {pair.score}%
                  </span>
                  <HeartHandshake size={14} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Candidate Deep-Dive */}
        <div className="tactile-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--accent-gold)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Candidate Match Explorer</h3>
            </div>

            <select
              value={selectedP1}
              onChange={e => { setSelectedP1(e.target.value); haptics.playClick(); }}
              style={{
                backgroundColor: 'var(--bg-surface-raised)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '0.35rem 0.6rem',
                fontSize: '0.82rem'
              }}
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
            Showing ranked compatibility matches for <strong>{currentP1.name}</strong> ({currentP1.role}):
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '480px', overflowY: 'auto' }}>
            {p1Matches.slice(0, 7).map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  haptics.playClick(240);
                  onSelectPair(selectedP1, item.p2.id);
                }}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={() => haptics.playHover()}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={item.p2.avatar} alt={item.p2.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.p2.name}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.p2.role}</span>
                  </div>
                  <span className="match-badge high" style={{ fontSize: '0.72rem' }}>
                    {item.score}% MATCH
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  {item.diagnostic}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
