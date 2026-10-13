import React, { useState } from 'react';
import { Grid, Sparkles, HeartHandshake, TrendingUp, Flame } from 'lucide-react';
import { haptics } from '../engine/audioHaptics';

export default function CompatibilityMatrix({ profiles, matrix, matrixData, onSelectPair }) {
  const activeMatrix = matrixData?.matrix || matrix || {};
  const mutualSparks = matrixData?.mutual_sparks || [];
  const [activeSubTab, setActiveSubTab] = useState('sparks'); // 'sparks' | 'global' | 'explorer'
  const [selectedP1, setSelectedP1] = useState(profiles[0].id);

  // Compute top global pairings
  const allPairs = [];
  for (let i = 0; i < profiles.length; i++) {
    for (let j = i + 1; j < profiles.length; j++) {
      const p1 = profiles[i];
      const p2 = profiles[j];
      const compat = activeMatrix[p1.id] && activeMatrix[p1.id][p2.id];
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

  // Matches for selected candidate
  const p1Matches = [];
  const currentP1 = profiles.find(p => p.id === selectedP1) || profiles[0];
  profiles.forEach(p2 => {
    if (p2.id !== selectedP1) {
      const compat = activeMatrix[selectedP1] && activeMatrix[selectedP1][p2.id];
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
                Compatibility Matrix & Mutual Sparks
              </h2>
              <span className="match-badge high">300 PAIR EVALUATIONS · 23 MUTUAL SPARKS</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Pairwise scoring synthesized from Big Five vector distance, core value synergy, lifestyle pacing, and conversational banter.
            </p>
          </div>

          {/* Sub Navigation */}
          <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'var(--bg-surface-raised)', padding: '0.25rem', borderRadius: '8px' }}>
            <button
              onClick={() => { setActiveSubTab('sparks'); haptics.playClick(220); }}
              className="tactile-btn"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                backgroundColor: activeSubTab === 'sparks' ? 'var(--accent-gold)' : 'transparent',
                color: activeSubTab === 'sparks' ? '#121413' : 'var(--text-secondary)',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              <Flame size={13} />
              <span>Mutual Sparks ({mutualSparks.length})</span>
            </button>
            <button
              onClick={() => { setActiveSubTab('global'); haptics.playClick(210); }}
              className="tactile-btn"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                backgroundColor: activeSubTab === 'global' ? 'var(--accent-gold)' : 'transparent',
                color: activeSubTab === 'global' ? '#121413' : 'var(--text-secondary)',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              <TrendingUp size={13} />
              <span>Top 10 Global</span>
            </button>
            <button
              onClick={() => { setActiveSubTab('explorer'); haptics.playClick(200); }}
              className="tactile-btn"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                backgroundColor: activeSubTab === 'explorer' ? 'var(--accent-gold)' : 'transparent',
                color: activeSubTab === 'explorer' ? '#121413' : 'var(--text-secondary)',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              <Sparkles size={13} />
              <span>Candidate Explorer</span>
            </button>
          </div>
        </div>
      </div>

      {/* View 1: Mutual Sparks */}
      {activeSubTab === 'sparks' && (
        <div className="tactile-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Flame size={18} color="var(--accent-rose)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Mutual Sparks (Reciprocal Top Matches)</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Pairs where <strong>both candidates independently ranked each other in their personal Top 3 matches</strong>. Click any card to launch their date.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1rem'
          }}>
            {mutualSparks.map((spark, idx) => (
              <div
                key={idx}
                onClick={() => {
                  haptics.playClick(240);
                  onSelectPair(spark.p1.id, spark.p2.id);
                }}
                className="tactile-card"
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={() => haptics.playHover()}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span className="match-badge high" style={{ fontSize: '0.72rem' }}>
                    🔥 MUTUAL SPARK
                  </span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                    {spark.score}%
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', margin: '0.75rem 0' }}>
                  <div style={{ textAlign: 'center' }}>
                    <img src={spark.p1.avatar} alt={spark.p1.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.25rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{spark.p1.name.split(' ')[0]}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{spark.p1.role.split(',')[0]}</div>
                  </div>

                  <HeartHandshake size={20} color="var(--accent-gold)" />

                  <div style={{ textAlign: 'center' }}>
                    <img src={spark.p2.avatar} alt={spark.p2.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.25rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{spark.p2.name.split(' ')[0]}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{spark.p2.role.split(',')[0]}</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35, marginTop: '0.5rem', textAlign: 'center' }}>
                  "{spark.diagnostic}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Top 10 Global */}
      {activeSubTab === 'global' && (
        <div className="tactile-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <TrendingUp size={18} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Top 10 Global Compatibility Rankings</h3>
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
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={() => haptics.playHover()}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', width: '24px' }}>
                    #{idx + 1}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={pair.p1.avatar} alt={pair.p1.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{pair.p1.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>&</span>
                    <img src={pair.p2.avatar} alt={pair.p2.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{pair.p2.name}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{pair.verdict}</span>
                  </div>
                  <span className="match-badge high" style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem' }}>
                    {pair.score}% MATCH
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Candidate Match Explorer */}
      {activeSubTab === 'explorer' && (
        <div className="tactile-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--accent-gold)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Candidate Match Explorer</h3>
            </div>

            <select
              value={selectedP1}
              onChange={e => { setSelectedP1(e.target.value); haptics.playClick(); }}
              style={{
                backgroundColor: 'var(--bg-surface-raised)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '0.4rem 0.65rem',
                fontSize: '0.84rem'
              }}
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.role.split(',')[0]})</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Showing ranked compatibility matches for <strong>{currentP1.name}</strong>:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '520px', overflowY: 'auto' }}>
            {p1Matches.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  haptics.playClick(240);
                  onSelectPair(selectedP1, item.p2.id);
                }}
                style={{
                  padding: '0.85rem',
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
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>#{idx + 1}</span>
                    <img src={item.p2.avatar} alt={item.p2.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.p2.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.p2.role}</span>
                  </div>
                  <span className="match-badge high" style={{ fontSize: '0.75rem' }}>
                    {item.score}%
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '0.25rem' }}>
                  {item.diagnostic}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
