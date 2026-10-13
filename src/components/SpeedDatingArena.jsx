import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Heart, Sparkles, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { haptics } from '../engine/audioHaptics';
import { buildDynamicDateSimulation } from '../engine/simulationEngine';

export default function SpeedDatingArena({ profiles, matrix, selectedPair, setSelectedPair }) {
  const [p1Id, setP1Id] = useState(selectedPair ? selectedPair[0] : 'andrej-karpathy');
  const [p2Id, setP2Id] = useState(selectedPair ? selectedPair[1] : 'mira-murati');

  useEffect(() => {
    if (selectedPair) {
      setP1Id(selectedPair[0]);
      setP2Id(selectedPair[1]);
    }
  }, [selectedPair]);

  const p1 = profiles.find(p => p.id === p1Id) || profiles[0];
  const p2 = profiles.find(p => p.id === p2Id) || profiles[1];

  const compat = (matrix[p1.id] && matrix[p1.id][p2.id]) || {
    overall: 88,
    breakdown: { intellectual: 90, values: 85, lifestyle: 88, banter: 89 },
    verdict: "High Chemistry Match",
    diagnostic: "Strong mutual resonance."
  };

  const simData = buildDynamicDateSimulation(p1, p2, compat);
  const turns = simData.turns;

  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const chatContainerRef = useRef(null);

  // Playback timer
  useEffect(() => {
    let timer;
    if (isPlaying && currentTurnIdx < turns.length - 1) {
      timer = setTimeout(() => {
        setCurrentTurnIdx(prev => {
          const next = prev + 1;
          haptics.playClick(210 + next * 15);
          if (next === turns.length - 1) {
            haptics.playChime();
          }
          return next;
        });
      }, 2600 / playbackSpeed);
    } else if (currentTurnIdx >= turns.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentTurnIdx, turns.length, playbackSpeed]);

  // Scroll to bottom when turn advances
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentTurnIdx]);

  const handleStart = () => {
    if (currentTurnIdx >= turns.length - 1) {
      setCurrentTurnIdx(0);
    }
    setIsPlaying(true);
    haptics.playClick(250);
  };

  const handlePause = () => {
    setIsPlaying(false);
    haptics.playClick(180);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTurnIdx(0);
    haptics.playClick(160);
  };

  const handleStep = () => {
    if (currentTurnIdx < turns.length - 1) {
      setCurrentTurnIdx(prev => prev + 1);
      haptics.playClick(220);
      if (currentTurnIdx + 1 === turns.length - 1) {
        haptics.playChime();
      }
    }
  };

  const activeTurn = turns[currentTurnIdx];
  const isP1Speaking = activeTurn.speakerId === p1.id;
  const progressPercent = Math.round(((currentTurnIdx + 1) / turns.length) * 100);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Header controls & Selection */}
      <div className="tactile-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 className="font-editorial-serif" style={{ fontSize: '1.8rem', fontWeight: 600 }}>
                Autonomous Speed Dating Arena
              </h2>
              <span className="match-badge high">LIVE DIALOGUE RUNNER</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Select any two individuals. Their autonomous agents converse across four rounds, testing values, lifestyle rhythm, and boundary tolerances.
            </p>
          </div>

          {/* Quick Selectors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>AGENT A:</span>
              <select
                value={p1Id}
                onChange={e => { setP1Id(e.target.value); setCurrentTurnIdx(0); setIsPlaying(false); haptics.playClick(); }}
                style={{
                  backgroundColor: 'var(--bg-surface-raised)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.4rem 0.6rem',
                  fontSize: '0.82rem'
                }}
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id} disabled={p.id === p2Id}>{p.name}</option>
                ))}
              </select>
            </div>

            <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>&</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>AGENT B:</span>
              <select
                value={p2Id}
                onChange={e => { setP2Id(e.target.value); setCurrentTurnIdx(0); setIsPlaying(false); haptics.playClick(); }}
                style={{
                  backgroundColor: 'var(--bg-surface-raised)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.4rem 0.6rem',
                  fontSize: '0.82rem'
                }}
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id} disabled={p.id === p1Id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Arena Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* Candidate 1 Dossier Card */}
        <div className={`tactile-card ${isP1Speaking ? 'active-speaker' : ''}`} style={{
          padding: '1.25rem',
          border: isP1Speaking ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
          transform: isP1Speaking ? 'scale(1.01)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <img
              src={p1.avatar}
              alt={p1.name}
              style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-warm)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{p1.name}</h3>
                {isP1Speaking && <span className="match-badge high" style={{ fontSize: '0.65rem' }}>SPEAKING</span>}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 500 }}>{p1.role}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p1.location}</div>
            </div>
          </div>

          <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
              DATING INTENT:
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {p1.dating_intent}
            </p>
          </div>

          <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {p1.values.map(v => (
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

          <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem' }}>
            <a
              href={p1.linkedin}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.72rem',
                color: 'var(--accent-cyan)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              LinkedIn <ExternalLink size={11} />
            </a>
            <a
              href={p1.instagram}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.72rem',
                color: 'var(--accent-rose)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              Instagram ({p1.handle_ig}) <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Center Live Dialogue Theatre */}
        <div className="tactile-card" style={{ padding: '1.25rem', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
          {/* Status bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '1rem'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                ROUND {activeTurn.round} OF 4:
              </span>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent-gold)' }}>
                {activeTurn.title}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                COMPATIBILITY:
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                {compat.overall}%
              </div>
            </div>
          </div>

          {/* Conversation Stream */}
          <div
            ref={chatContainerRef}
            style={{
              flex: 1,
              maxHeight: '340px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              paddingRight: '0.5rem'
            }}
          >
            {turns.slice(0, currentTurnIdx + 1).map((turn, idx) => {
              const isP1 = turn.speakerId === p1.id;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: isP1 ? 'row' : 'row-reverse',
                    gap: '0.75rem',
                    alignItems: 'flex-start'
                  }}
                >
                  <img
                    src={turn.avatar}
                    alt={turn.speaker}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1px solid var(--border-warm)'
                    }}
                  />
                  <div className={`dialogue-bubble ${idx === currentTurnIdx ? 'active-speaker' : ''}`} style={{
                    maxWidth: '82%',
                    backgroundColor: isP1 ? 'var(--bg-surface-raised)' : 'rgba(226, 186, 125, 0.08)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: isP1 ? 'var(--text-primary)' : 'var(--accent-gold)' }}>
                        {turn.speaker}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {turn.delta}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.45, color: 'var(--text-secondary)' }}>
                      {turn.text}
                    </p>
                    <div style={{
                      marginTop: '0.5rem',
                      paddingTop: '0.4rem',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)'
                    }}>
                      <span>✦ {turn.topic}</span>
                      <span style={{ color: 'var(--accent-emerald)' }}>{turn.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controls Bar */}
          <div style={{
            marginTop: '1rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {!isPlaying ? (
                <button onClick={handleStart} className="tactile-btn tactile-btn-primary">
                  <Play size={15} />
                  <span>{currentTurnIdx >= turns.length - 1 ? 'Replay' : 'Run Date'}</span>
                </button>
              ) : (
                <button onClick={handlePause} className="tactile-btn">
                  <Pause size={15} />
                  <span>Pause</span>
                </button>
              )}

              <button onClick={handleStep} disabled={currentTurnIdx >= turns.length - 1} className="tactile-btn">
                <ArrowRight size={15} />
                <span>Next</span>
              </button>

              <button onClick={handleReset} className="tactile-btn">
                <RotateCcw size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setPlaybackSpeed(s => s === 1 ? 2 : 1)}
                className="tactile-btn"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
              >
                <FastForward size={14} />
                <span>{playbackSpeed}x</span>
              </button>

              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {progressPercent}% Complete
              </div>
            </div>
          </div>
        </div>

        {/* Candidate 2 Dossier Card */}
        <div className={`tactile-card ${!isP1Speaking ? 'active-speaker' : ''}`} style={{
          padding: '1.25rem',
          border: !isP1Speaking ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
          transform: !isP1Speaking ? 'scale(1.01)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <img
              src={p2.avatar}
              alt={p2.name}
              style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-warm)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{p2.name}</h3>
                {!isP1Speaking && <span className="match-badge high" style={{ fontSize: '0.65rem' }}>SPEAKING</span>}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 500 }}>{p2.role}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p2.location}</div>
            </div>
          </div>

          <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
              DATING INTENT:
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {p2.dating_intent}
            </p>
          </div>

          <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {p2.values.map(v => (
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

          <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem' }}>
            <a
              href={p2.linkedin}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.72rem',
                color: 'var(--accent-cyan)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              LinkedIn <ExternalLink size={11} />
            </a>
            <a
              href={p2.instagram}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.72rem',
                color: 'var(--accent-rose)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              Instagram ({p2.handle_ig}) <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* Matchmaker Diagnostic Card */}
      <div className="tactile-card" style={{ marginTop: '1.5rem', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="var(--accent-gold)" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Matchmaker Verdict & Synthesis</h4>
              <span className="match-badge high">{compat.verdict}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '0.35rem', maxWidth: '850px' }}>
              {compat.diagnostic}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>INTELLECTUAL</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold)' }}>{compat.breakdown.intellectual}%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>VALUES</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>{compat.breakdown.values}%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>LIFESTYLE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{compat.breakdown.lifestyle}%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>BANTER</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-rose)' }}>{compat.breakdown.banter}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
