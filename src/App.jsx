import React, { useState } from 'react';
import Header from './components/Header';
import SpeedDatingArena from './components/SpeedDatingArena';
import ProfileDossier from './components/ProfileDossier';
import CompatibilityMatrix from './components/CompatibilityMatrix';
import CandidateIngestion from './components/CandidateIngestion';
import VideoShowcase from './components/VideoShowcase';
import ApiKeyModal from './components/ApiKeyModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';

import profilesData from './data/profiles.json';
import matrixPayload from './data/compatibility_matrix.json';
import { liveLlm } from './engine/liveAgentLlm';
import { haptics } from './engine/audioHaptics';

export default function App() {
  const [activeTab, setActiveTab] = useState('profiles'); // 'profiles' | 'ingest' | 'arena' | 'matrix' | 'walkthrough'
  const [theme, setTheme] = useState('charcoal');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedPair, setSelectedPair] = useState(['andrej-karpathy', 'mira-murati']);
  
  const [profiles, setProfiles] = useState(profilesData);
  const [matrix, setMatrix] = useState(matrixPayload.matrix);
  const [addedCandidates, setAddedCandidates] = useState([]);
  
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isLlmConfigured, setIsLlmConfigured] = useState(liveLlm.isConfigured());

  const handleSelectForDating = (pId) => {
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
    haptics.playClick(240);
  };

  const handleSelectPair = (p1Id, p2Id) => {
    setSelectedPair([p1Id, p2Id]);
    setActiveTab('arena');
    haptics.playClick(230);
  };

  const handleCandidateAdded = (newCandidate) => {
    // 1. Add to profiles list
    setProfiles(prev => [newCandidate, ...prev]);
    setAddedCandidates(prev => [newCandidate, ...prev]);

    // 2. Synthesize pairwise compatibility for newCandidate against all profiles
    const updatedMatrix = { ...matrix };
    const newEntry = {};

    profiles.forEach(p => {
      // Calculate geometric mean compatibility
      const o1 = newCandidate.traits?.openness || 85;
      const o2 = p.traits?.openness || 85;
      const diff = Math.abs(o1 - o2);
      const intellectualScore = Math.max(70, Math.min(96, Math.round(92 - diff * 0.4)));
      const valuesScore = Math.max(68, Math.min(95, Math.round(88 - diff * 0.3)));
      const lifestyleScore = Math.max(65, Math.min(94, Math.round(86 - diff * 0.35)));
      const banterScore = Math.max(65, Math.min(97, Math.round(89 - diff * 0.25)));

      const overall = Math.round(Math.sqrt((intellectualScore * valuesScore * lifestyleScore * banterScore) ** (1 / 4) * 88));

      const verdict = overall >= 85 ? "High Chemistry Match" : overall >= 75 ? "Promising Compatibility" : "Moderate Alignment";
      const diagnostic = `Mutual alignment on ${newCandidate.role} and ${p.role}. Values focus indicates strong reciprocal potential.`;

      const matchData = {
        overall,
        breakdown: {
          intellectual: intellectualScore,
          values: valuesScore,
          lifestyle: lifestyleScore,
          banter: banterScore
        },
        verdict,
        diagnostic
      };

      newEntry[p.id] = matchData;
      if (!updatedMatrix[p.id]) updatedMatrix[p.id] = {};
      updatedMatrix[p.id][newCandidate.id] = matchData;
    });

    updatedMatrix[newCandidate.id] = newEntry;
    setMatrix(updatedMatrix);
  };

  const handleRemoveCandidate = (candidateId) => {
    setProfiles(prev => prev.filter(p => p.id !== candidateId));
    setAddedCandidates(prev => prev.filter(c => c.id !== candidateId));
    haptics.playThud();
  };

  const handleDateCandidate = (candidateId) => {
    handleSelectForDating(candidateId);
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
        isLlmConfigured={isLlmConfigured}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {activeTab === 'profiles' && (
          <ProfileDossier
            profiles={profiles}
            onSelectForDating={handleSelectForDating}
            onOpenIngest={() => setActiveTab('ingest')}
          />
        )}

        {activeTab === 'ingest' && (
          <CandidateIngestion
            onCandidateAdded={handleCandidateAdded}
            addedCandidates={addedCandidates}
            onRemoveCandidate={handleRemoveCandidate}
            onDateCandidate={handleDateCandidate}
          />
        )}

        {activeTab === 'arena' && (
          <SpeedDatingArena
            profiles={profiles}
            matrix={matrix}
            selectedPair={selectedPair}
            setSelectedPair={setSelectedPair}
            isLlmConfigured={isLlmConfigured}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          />
        )}

        {activeTab === 'matrix' && (
          <CompatibilityMatrix
            profiles={profiles}
            matrix={matrix}
            matrixData={matrixPayload}
            onSelectPair={handleSelectPair}
          />
        )}

        {activeTab === 'walkthrough' && (
          <VideoShowcase />
        )}
      </main>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={(configured) => setIsLlmConfigured(configured)}
      />

      {/* Privacy & Safety Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

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
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}
            >
              Privacy & Ethics
            </button>
            <span>25 Real Verified Profiles · Gemini 2.5 Flash Live · 1080p60 Pipeline</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
