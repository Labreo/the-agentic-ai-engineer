import React, { useState } from 'react';
import { ExternalLink, HeartHandshake, Search, Sparkles } from 'lucide-react';
import { haptics } from '../engine/audioHaptics';

export default function ProfileDossier({ profiles, onSelectForDating }) {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  const filtered = profiles.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.role.toLowerCase().includes(search.toLowerCase()) ||
                          p.bio.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleSimulate = (p) => {
    haptics.playClick(240);
    onSelectForDating(p.id);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Search & Header */}
      <div className="tactile-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 className="font-editorial-serif" style={{ fontSize: '1.8rem', fontWeight: 600 }}>
                The 25 Real Verified Profiles
              </h2>
              <span className="match-badge high">100% VERIFIED URLS</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Each person features a public LinkedIn profile, an active Instagram handle, and an autonomous persona extracted by their agent.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '280px' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search profiles, roles, or interests..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.6rem 0.5rem 2.2rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.84rem'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 25 Profile Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '1.25rem'
      }}>
        {filtered.map((p) => (
          <div key={p.id} className="tactile-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
            {/* Header info */}
            <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
              <img
                src={p.avatar}
                alt={p.name}
                style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-warm)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{p.name}</h3>
                  <span className="match-badge" style={{ fontSize: '0.65rem' }}>
                    OPENNESS {p.traits.openness}%
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 500, lineHeight: 1.3, marginTop: '0.15rem' }}>
                  {p.role}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {p.location}
                </div>
              </div>
            </div>

            {/* Bio */}
            <p style={{
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              marginTop: '0.85rem',
              flex: 1
            }}>
              {p.bio}
            </p>

            {/* Dating Intent */}
            <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                RELATIONSHIP INTENT:
              </div>
              <p style={{ fontSize: '0.79rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>
                "{p.dating_intent}"
              </p>
            </div>

            {/* Core Values */}
            <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {p.values.map(v => (
                <span key={v} style={{
                  fontSize: '0.68rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(240, 235, 225, 0.06)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  ✦ {v}
                </span>
              ))}
            </div>

            {/* Verified Links & Action */}
            <div style={{
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <a
                  href={p.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--accent-cyan)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                >
                  LinkedIn <ExternalLink size={11} />
                </a>
                <a
                  href={p.instagram}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--accent-rose)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                >
                  Instagram ({p.handle_ig}) <ExternalLink size={11} />
                </a>
              </div>

              <button
                onClick={() => handleSimulate(p)}
                className="tactile-btn tactile-btn-primary"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              >
                <HeartHandshake size={13} />
                <span>Simulate Date</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
