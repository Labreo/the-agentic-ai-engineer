import React from 'react';
import { Volume2, VolumeX, Sun, Moon, Sparkles, HeartHandshake, Users, Grid, BookOpen } from 'lucide-react';
import { haptics } from '../engine/audioHaptics';

export default function Header({ activeTab, setActiveTab, theme, setTheme, soundEnabled, setSoundEnabled }) {
  const toggleSound = () => {
    const next = haptics.toggleSound();
    setSoundEnabled(next);
    haptics.playClick(240);
  };

  const toggleTheme = () => {
    const next = theme === 'charcoal' ? 'parchment' : 'charcoal';
    setTheme(next);
    haptics.playClick(200);
  };

  const handleTab = (tab) => {
    setActiveTab(tab);
    haptics.playClick(220);
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-surface)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(12px)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--accent-gold)',
            color: '#121413',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.1rem',
            fontFamily: 'var(--font-serif)'
          }}>
            Ψ
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1
              }}>
                The Agentic AI Engineer
              </span>
              <span className="match-badge high" style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                GATEWAY 01
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Autonomous Multi-Agent Dating Protocol · 25 Real Verified Profiles
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {[
            { id: 'arena', label: 'Dating Arena', icon: HeartHandshake },
            { id: 'profiles', label: '25 Profiles', icon: Users },
            { id: 'matrix', label: 'Match Matrix', icon: Grid },
            { id: 'walkthrough', label: 'Video & Docs', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTab(tab.id)}
                onMouseEnter={() => haptics.playHover()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--accent-gold)' : '1px solid transparent',
                  backgroundColor: isActive ? 'rgba(226, 186, 125, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  transition: 'all 0.18s ease'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sensory Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Haptic Audio' : 'Enable Haptic Audio'}
            className="tactile-btn"
            style={{ padding: '0.45rem 0.65rem' }}
          >
            {soundEnabled ? <Volume2 size={16} color="var(--accent-gold)" /> : <VolumeX size={16} color="var(--text-muted)" />}
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              {soundEnabled ? 'AUDIO ON' : 'MUTED'}
            </span>
          </button>

          <button
            onClick={toggleTheme}
            title="Toggle Charcoal / Parchment Theme"
            className="tactile-btn"
            style={{ padding: '0.45rem 0.65rem' }}
          >
            {theme === 'charcoal' ? <Sun size={16} color="var(--accent-gold)" /> : <Moon size={16} color="var(--text-primary)" />}
          </button>
        </div>
      </div>
    </header>
  );
}
