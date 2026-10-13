import React, { useState } from 'react';
import Header from './components/Header';
import SpeedDatingArena from './components/SpeedDatingArena';
import ProfileDossier from './components/ProfileDossier';
import CompatibilityMatrix from './components/CompatibilityMatrix';
import VideoShowcase from './components/VideoShowcase';

import profilesData from './data/profiles.json';
import matrixPayload from './data/compatibility_matrix.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('arena');
  const [theme, setTheme] = useState('charcoal');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedPair, setSelectedPair] = useState(['andrej-karpathy', 'mira-murati']);

  const handleSelectForDating = (pId) => {
    // Pick highest match or partner
    const matrix = matrixPayload.matrix;
    let bestPartner = 'mira-murati';
    let highestScore = -1;
    if (matrix[pId]) {
      Object.entries(matrix[pId]).forEach(([partnerId, data]) => {
        if (partnerId !== pId && data.overall > highestScore) {
          highestScore = data.overall;
          bestPartner = partnerId;
        }
      });
    }
    setSelectedPair([pId, bestPartner]);
    setActiveTab('arena');
  };

  const handleSelectPair = (p1Id, p2Id) => {
    setSelectedPair([p1Id, p2Id]);
    setActiveTab('arena');
  };

  return (
    <div className={`app-root theme-${theme}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Live Film Grain Layer */}
      <div className="grain-overlay" />

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {activeTab === 'arena' && (
          <SpeedDatingArena
            profiles={profilesData}
            matrix={matrixPayload.matrix}
            selectedPair={selectedPair}
            setSelectedPair={setSelectedPair}
          />
        )}

        {activeTab === 'profiles' && (
          <ProfileDossier
            profiles={profilesData}
            onSelectForDating={handleSelectForDating}
          />
        )}

        {activeTab === 'matrix' && (
          <CompatibilityMatrix
            profiles={profilesData}
            matrix={matrixPayload.matrix}
            onSelectPair={handleSelectPair}
          />
        )}

        {activeTab === 'walkthrough' && (
          <VideoShowcase />
        )}
      </main>

      {/* Tactile Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.25rem 1.5rem',
        backgroundColor: 'var(--bg-surface)',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span>The Agentic AI Engineer Gating Assessment · Kanak Waradkar</span>
          <span>Zero-Latency Web Audio Haptics · 25 Real Verified Profiles · 1080p60 Pipeline</span>
        </div>
      </footer>
    </div>
  );
}
