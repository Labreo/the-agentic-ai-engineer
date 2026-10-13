import React, { useState } from 'react';
import { ExternalLink, HeartHandshake, Search, Sparkles, ChevronDown, ChevronUp, UserPlus, ShieldCheck } from 'lucide-react';
import { haptics } from '../engine/audioHaptics';
import Avatar from './Avatar';

export default function ProfileDossier({ profiles, onSelectForDating, onOpenIngest }) {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

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

  const toggleExpand = (id) => {
    haptics.playClick(190);
    setExpandedId(prev => prev === id ? null : id);
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
              <span className="match-badge high">4 PILLARS & APIFY COMPLIANT</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Each person features an active LinkedIn profile, a public Instagram handle, and an agent persona extracted into 4 pillars: Needs, Hobbies, Interests, and Qualities.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => { haptics.playClick(210); onOpenIngest && onOpenIngest(); }}
              className="tactile-btn tactile-btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', gap: '0.4rem' }}
            >
              <UserPlus size={14} />
              <span>+ Ingest Public Links</span>
            </button>

            <div style={{
              position: 'relative',
              minWidth: '240px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search profiles or roles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.6rem 0.45rem 2rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem'
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
        {filtered.map((p) => {
          const isExpanded = expandedId === p.id;
          const pillars = p.pillars || {
            needs: [p.dating_intent],
            hobbies: p.hobbies,
            interests: [p.headline],
            qualities: { traits: p.traits, green_flags: [p.values[0]], dealbreakers: p.dealbreakers }
          };

          return (
            <div key={p.id} className="tactile-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              {/* Header info */}
              <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                <Avatar
                  src={p.avatar}
                  name={p.name}
                  size={64}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{p.name}</h3>
                    <span className="match-badge" style={{ fontSize: '0.65rem' }}>
                      OPENNESS {p.traits?.openness || 85}%
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
                marginTop: '0.85rem'
              }}>
                {p.bio}
              </p>

              {/* Verified Badges */}
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  • Apify Snapshot
                </span>
                {p.isCustom && (
                  <span className="match-badge high" style={{ fontSize: '0.62rem' }}>
                    USER INGESTED
                  </span>
                )}
              </div>

              {/* 4 Pillars Toggle */}
              <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => toggleExpand(p.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-gold)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.2rem 0'
                  }}
                >
                  <span>{isExpanded ? 'HIDE 4 PROFILE PILLARS' : 'VIEW 4 PROFILE PILLARS'}</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {isExpanded && (
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    fontSize: '0.78rem'
                  }}>
                    <div>
                      <strong style={{ color: 'var(--accent-gold)' }}>1. Needs:</strong>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{pillars.needs?.[0]}</div>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--accent-emerald)' }}>2. Hobbies:</strong>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{pillars.hobbies?.join(', ')}</div>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--accent-cyan)' }}>3. Interests:</strong>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{pillars.interests?.join(' • ')}</div>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--accent-rose)' }}>4. Qualities:</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.2rem' }}>
                        <span style={{ color: 'var(--accent-emerald)', fontSize: '0.7rem' }}>✔ Green: {pillars.qualities?.green_flags?.[0]}</span>
                        <span style={{ color: 'var(--accent-rose)', fontSize: '0.7rem' }}>✖ Avoid: {pillars.qualities?.dealbreakers?.[0]}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action */}
              <div style={{
                marginTop: 'auto',
                paddingTop: '0.85rem',
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => handleSimulate(p)}
                  className="tactile-btn tactile-btn-primary"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}
                >
                  <HeartHandshake size={14} />
                  <span>Simulate Date</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
