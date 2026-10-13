import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Heart, Sparkles, AlertCircle, ExternalLink, ArrowRight, Zap, RefreshCw, MapPin, Brain } from 'lucide-react';
import { haptics } from '../engine/audioHaptics';
import { buildDynamicDateSimulation, VENUES } from '../engine/simulationEngine';
import { liveLlm } from '../engine/liveAgentLlm';
import Avatar from './Avatar';

export default function SpeedDatingArena({ profiles, matrix, selectedPair, setSelectedPair, isLlmConfigured, onOpenApiKeyModal }) {
  const [p1Id, setP1Id] = useState(selectedPair ? selectedPair[0] : 'andrej-karpathy');
  const [p2Id, setP2Id] = useState(selectedPair ? selectedPair[1] : 'mira-murati');
  const [venueId, setVenueId] = useState('subko-roastery');
  const [useLiveLlm, setUseLiveLlm] = useState(isLlmConfigured);
  const [isGeneratingLive, setIsGeneratingLive] = useState(false);

  useEffect(() => {
    if (selectedPair) {
      setP1Id(selectedPair[0]);
      setP2Id(selectedPair[1]);
    }
  }, [selectedPair]);

  const p1 = profiles.find(p => p.id === p1Id) || profiles[0];
  const p2 = profiles.find(p => p.id === p2Id) || profiles[1];
  const venue = VENUES.find(v => v.id === venueId) || VENUES[0];

  const compat = (matrix[p1.id] && matrix[p1.id][p2.id]) || {
    overall: 88,
    breakdown: { intellectual: 90, values: 85, lifestyle: 88, banter: 89 },
    verdict: "High Chemistry Match",
    diagnostic: "Strong mutual resonance."
  };

  const defaultSim = buildDynamicDateSimulation(p1, p2, compat, venueId);
  const [displayedTurns, setDisplayedTurns] = useState(defaultSim.turns.slice(0, 1));
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showInnerThoughts, setShowInnerThoughts] = useState(true);
  const chatContainerRef = useRef(null);

  // Reset dialogue when pair or venue changes
  useEffect(() => {
    const sim = buildDynamicDateSimulation(p1, p2, compat, venueId);
    setDisplayedTurns(sim.turns.slice(0, 1));
    setCurrentTurnIdx(0);
    setIsPlaying(false);
  }, [p1Id, p2Id, venueId]);

  // Scroll to bottom when turn advances
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [displayedTurns.length, isGeneratingLive]);

  const advanceTurn = async () => {
    const nextIdx = currentTurnIdx + 1;
    if (nextIdx >= defaultSim.turns.length) {
      setIsPlaying(false);
      haptics.playChime();
      return;
    }

    const baseTurn = defaultSim.turns[nextIdx];
    const isP1 = baseTurn.speakerId === p1.id;
    const speaker = isP1 ? p1 : p2;
    const partner = isP1 ? p2 : p1;

    if (useLiveLlm && liveLlm.isConfigured()) {
      setIsGeneratingLive(true);
      try {
        const liveText = await liveLlm.generateTurn(
          speaker,
          partner,
          baseTurn.round,
          baseTurn.title,
          displayedTurns.slice(-3).map(t => ({ speaker: t.speaker, text: t.text }))
        );
        const newTurn = {
          ...baseTurn,
          text: liveText,
          innerThought: `Evaluating ${partner.name.split(' ')[0]}'s response in real-time. Signals indicate authentic values match.`,
          status: "Live Gemini 2.5 Flash Response"
        };
        setDisplayedTurns(prev => [...prev, newTurn]);
        setCurrentTurnIdx(nextIdx);
        haptics.playClick(220 + nextIdx * 10);
        if (nextIdx === defaultSim.turns.length - 1) {
          haptics.playChime();
        }
      } catch (err) {
        console.warn("Live LLM generation fallback:", err);
        setDisplayedTurns(prev => [...prev, baseTurn]);
        setCurrentTurnIdx(nextIdx);
        haptics.playClick(210);
      } finally {
        setIsGeneratingLive(false);
      }
    } else {
      setDisplayedTurns(prev => [...prev, baseTurn]);
      setCurrentTurnIdx(nextIdx);
      haptics.playClick(210 + nextIdx * 12);
      if (nextIdx === defaultSim.turns.length - 1) {
        haptics.playChime();
      }
    }
  };

  useEffect(() => {
    let timer;
    if (isPlaying && currentTurnIdx < defaultSim.turns.length - 1 && !isGeneratingLive) {
      timer = setTimeout(() => {
        advanceTurn();
      }, 3000 / playbackSpeed);
    } else if (currentTurnIdx >= defaultSim.turns.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentTurnIdx, isGeneratingLive, playbackSpeed]);

  const handleStart = () => {
    if (currentTurnIdx >= defaultSim.turns.length - 1) {
      setDisplayedTurns(defaultSim.turns.slice(0, 1));
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
    setDisplayedTurns(defaultSim.turns.slice(0, 1));
    setCurrentTurnIdx(0);
    haptics.playClick(160);
  };

  const activeTurn = displayedTurns[displayedTurns.length - 1] || defaultSim.turns[0];
  const isP1Speaking = activeTurn.speakerId === p1.id;
  const progressPercent = Math.round(((currentTurnIdx + 1) / defaultSim.turns.length) * 100);

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
              Select any two individuals and an atmospheric venue. Agents date across five stages with live subconscious thought logs.
            </p>
          </div>

          {/* Engine Mode Toggle & Venue Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            {/* Venue Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} color="var(--accent-gold)" />
              <select
                value={venueId}
                onChange={e => { setVenueId(e.target.value); haptics.playClick(); }}
                style={{
                  backgroundColor: 'var(--bg-surface-raised)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.5rem',
                  fontSize: '0.78rem'
                }}
              >
                {VENUES.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.location})</option>
                ))}
              </select>
            </div>

            {/* Live LLM Mode Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface-raised)',
              border: '1px solid var(--border-subtle)'
            }}>
              <Zap size={14} color={useLiveLlm ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                {useLiveLlm ? 'LIVE GEMINI 2.5 FLASH' : 'FAST CACHED SIM'}
              </span>
              <input
                type="checkbox"
                checked={useLiveLlm}
                onChange={e => {
                  if (e.target.checked && !liveLlm.isConfigured()) {
                    onOpenApiKeyModal();
                  } else {
                    setUseLiveLlm(e.target.checked);
                    haptics.playClick();
                  }
                }}
                style={{ cursor: 'pointer', accentColor: 'var(--accent-gold)' }}
              />
            </div>

            {/* Quick Candidate Selectors */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>A:</span>
              <select
                value={p1Id}
                onChange={e => { setP1Id(e.target.value); haptics.playClick(); }}
                style={{
                  backgroundColor: 'var(--bg-surface-raised)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.5rem',
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
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>B:</span>
              <select
                value={p2Id}
                onChange={e => { setP2Id(e.target.value); haptics.playClick(); }}
                style={{
                  backgroundColor: 'var(--bg-surface-raised)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.5rem',
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

        {/* Venue Ambience Sub-bar */}
        <div style={{
          marginTop: '0.85rem',
          paddingTop: '0.65rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)'
        }}>
          <div>
            <strong style={{ color: 'var(--accent-gold)' }}>Venue Ambience:</strong> {venue.vibe}
          </div>
          <button
            onClick={() => setShowInnerThoughts(v => !v)}
            style={{
              background: 'none',
              border: 'none',
              color: showInnerThoughts ? 'var(--accent-gold)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Brain size={13} />
            <span>{showInnerThoughts ? 'THOUGHT LOGS ON' : 'THOUGHT LOGS OFF'}</span>
          </button>
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
            <Avatar
              src={p1.avatar}
              name={p1.name}
              size={70}
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
              PILLAR 1: NEEDS & DATING INTENT
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
            <a href={p1.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              LinkedIn <ExternalLink size={11} />
            </a>
            <a href={p1.instagram} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'var(--accent-rose)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Instagram ({p1.handle_ig}) <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Center Live Dialogue Theatre */}
        <div className="tactile-card" style={{ padding: '1.25rem', minHeight: '540px', display: 'flex', flexDirection: 'column' }}>
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
                ROUND {activeTurn.round} OF 5:
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
              maxHeight: '360px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.15rem',
              paddingRight: '0.5rem'
            }}
          >
            {displayedTurns.map((turn, idx) => {
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
                  <Avatar
                    src={turn.avatar}
                    name={turn.speaker}
                    size={36}
                    style={{ borderRadius: '50%' }}
                  />
                  <div className={`dialogue-bubble ${idx === displayedTurns.length - 1 ? 'active-speaker' : ''}`} style={{
                    maxWidth: '84%',
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
                      "{turn.text}"
                    </p>

                    {/* Inner Thought Log */}
                    {showInnerThoughts && turn.innerThought && (
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                        borderLeft: '2px solid var(--accent-gold)',
                        fontSize: '0.74rem',
                        color: 'var(--accent-gold)',
                        fontStyle: 'italic',
                        fontFamily: 'var(--font-mono)',
                        lineHeight: 1.35
                      }}>
                        🧠 <strong>Inner Monologue:</strong> {turn.innerThought}
                      </div>
                    )}

                    <div style={{
                      marginTop: '0.5rem',
                      paddingTop: '0.4rem',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)'
                    }}>
                      <span>✦ {turn.topic}</span>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{
                          color: 'var(--accent-gold)',
                          backgroundColor: 'rgba(226, 186, 125, 0.1)',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '4px'
                        }}>
                          {turn.vibeShift || (idx === 0 ? '▲ +1 Initial Vibe' : idx === 1 ? '▲ +1 Resonance' : idx === 2 ? '▲ +2 Chemistry Peak' : idx === 3 ? '▲ +1 Depth' : '▲ +2 Mutual Spark')}
                        </span>
                        <span style={{ color: 'var(--accent-emerald)' }}>{turn.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Live generation spinner */}
            {isGeneratingLive && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(226, 186, 125, 0.08)',
                border: '1px dashed var(--accent-gold)',
                color: 'var(--accent-gold)',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)'
              }}>
                <RefreshCw size={14} className="spin" />
                <span>Generating live unscripted turn with Gemini 2.5 Flash...</span>
              </div>
            )}
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
                <button onClick={handleStart} disabled={isGeneratingLive} className="tactile-btn tactile-btn-primary">
                  <Play size={15} />
                  <span>{currentTurnIdx >= defaultSim.turns.length - 1 ? 'Replay' : 'Run Date'}</span>
                </button>
              ) : (
                <button onClick={handlePause} className="tactile-btn">
                  <Pause size={15} />
                  <span>Pause</span>
                </button>
              )}

              <button onClick={advanceTurn} disabled={isGeneratingLive || currentTurnIdx >= defaultSim.turns.length - 1} className="tactile-btn">
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
            <Avatar
              src={p2.avatar}
              name={p2.name}
              size={70}
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
              PILLAR 1: NEEDS & DATING INTENT
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
            <a href={p2.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              LinkedIn <ExternalLink size={11} />
            </a>
            <a href={p2.instagram} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'var(--accent-rose)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
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
