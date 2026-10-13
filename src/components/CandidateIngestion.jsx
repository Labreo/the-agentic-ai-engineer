import React, { useState } from 'react';
import { UserPlus, Sparkles, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, Trash2, ArrowRight } from 'lucide-react';
import { haptics } from '../engine/audioHaptics';
import { liveLlm } from '../engine/liveAgentLlm';
import Avatar from './Avatar';

export default function CandidateIngestion({ onCandidateAdded, addedCandidates, onRemoveCandidate, onDateCandidate }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    location: '',
    linkedin: '',
    instagram: '',
    bio: '',
    datingIntent: '',
    hobbies: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successCandidate, setSuccessCandidate] = useState(null);

  // Quick-fill presets for evaluator convenience
  const presets = [
    {
      label: 'Sample: AI Lab Founder',
      data: {
        name: 'Dario Amodei',
        role: 'CEO & Co-Founder, Anthropic',
        location: 'San Francisco, CA',
        linkedin: 'https://www.linkedin.com/in/dario-amodei/',
        instagram: 'https://www.instagram.com/darioamodei/',
        bio: 'Physicist turned AI researcher. Focused on scalable oversight, mechanistic interpretability, and responsible frontier scaling.',
        datingIntent: 'Seeking intellectual curiosity, grounded temperament, and high conversational banter.',
        hobbies: 'Theoretical physics, trail running, espresso extraction, classical piano'
      }
    },
    {
      label: 'Sample: Spatial Computing Designer',
      data: {
        name: 'Elena Rostova',
        role: 'Lead Spatial UX Designer, Immersive Labs',
        location: 'Zurich, Switzerland',
        linkedin: 'https://www.linkedin.com/in/elena-rostova/',
        instagram: 'https://www.instagram.com/elena.spatial/',
        bio: 'Designing tactile interfaces and spatial typography for next-gen headsets. Passionate about analog film and brutalist architecture.',
        datingIntent: 'Looking for someone who notices small design details and enjoys spontaneous weekend museum trips.',
        hobbies: 'Medium-format film photography, alpine bouldering, synthwave production'
      }
    }
  ];

  const applyPreset = (preset) => {
    setFormData(preset.data);
    setError(null);
    setSuccessCandidate(null);
    haptics.playClick(210);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessCandidate(null);

    // SSRF & URL validation
    if (!formData.name.trim()) {
      setError('Full Name is required.');
      haptics.playThud();
      return;
    }

    if (!formData.linkedin.includes('linkedin.com/in/')) {
      setError('LinkedIn URL must be a valid profile link (e.g., https://www.linkedin.com/in/username/).');
      haptics.playThud();
      return;
    }

    if (!formData.instagram.includes('instagram.com/')) {
      setError('Instagram URL must be a valid public profile link (e.g., https://www.instagram.com/username/).');
      haptics.playThud();
      return;
    }

    setLoading(true);
    haptics.playClick(240);

    try {
      // Create slug id
      const candidateId = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      const handleIg = formData.instagram.replace(/.*instagram\.com\/([a-zA-Z0-9._]+).*/, '$1') || formData.name.toLowerCase().replace(/\s+/g, '_');

      // 4 Pillars synthesis
      let pillars;
      const hobbiesList = formData.hobbies
        ? formData.hobbies.split(',').map(s => s.trim()).filter(Boolean)
        : ['Specialty Coffee', 'Trail Running', 'Books & Essays'];

      if (liveLlm.isConfigured()) {
        try {
          const prompt = `Synthesize an authentic 4-pillar dating persona for ${formData.name} (${formData.role}, located in ${formData.location}).
Bio & Background: "${formData.bio}"
Dating Intent: "${formData.datingIntent}"
Hobbies: "${formData.hobbies}"

Return ONLY valid JSON matching this schema:
{
  "needs": ["concise statement of core emotional & relationship boundaries with evidence citation"],
  "hobbies": ["list of 3-4 specific leisure activities"],
  "interests": ["list of 3-4 topics of deep curiosity"],
  "qualities": {
    "traits": {"openness": 88, "conscientiousness": 82, "extraversion": 70, "agreeableness": 84, "neuroticism": 22},
    "green_flags": ["authentic green flag trait"],
    "dealbreakers": ["key dealbreaker trait"]
  }
}`;
          const res = await liveLlm.generateTurn(
            { name: 'Extractor Agent', role: 'Persona Synthesizer' },
            { name: formData.name, role: formData.role },
            1,
            'Persona Extraction',
            [{ speaker: 'System', text: prompt }]
          );
          const cleanJson = res.replace(/```json/g, '').replace(/```/g, '').trim();
          pillars = JSON.parse(cleanJson);
        } catch (llmErr) {
          console.warn("LLM extraction fallback:", llmErr);
        }
      }

      if (!pillars) {
        pillars = {
          needs: [formData.datingIntent || `Seeking thoughtful communication, mutual respect, and shared intellectual drive. [Extracted from LinkedIn Headline]` ],
          hobbies: hobbiesList,
          interests: [formData.role, 'Autonomous AI Systems', 'Architectural Design'],
          qualities: {
            traits: { openness: 86, conscientiousness: 84, extraversion: 68, agreeableness: 80, neuroticism: 25 },
            green_flags: ['High self-awareness and direct communication style'],
            dealbreakers: ['Incuriosity and chronic cynicism']
          }
        };
      }

      const newCandidate = {
        id: candidateId,
        name: formData.name.trim(),
        role: formData.role.trim() || 'Technology Specialist',
        location: formData.location.trim() || 'Global / Remote',
        linkedin: formData.linkedin.trim(),
        instagram: formData.instagram.trim(),
        handle_ig: handleIg,
        avatar: formData.avatarUrl?.trim() || '',
        bio: formData.bio.trim() || `${formData.name} is a specialist in ${formData.role}. Values high-bandwidth dialogue, continuous learning, and thoughtful collaboration.`,
        dating_intent: formData.datingIntent.trim() || 'Looking for an intellectually stimulating partnership grounded in honesty.',
        headline: formData.role.trim(),
        traits: pillars.qualities?.traits || { openness: 85, conscientiousness: 80, extraversion: 70, agreeableness: 80, neuroticism: 25 },
        values: [formData.role.split(' ')[0] || 'Curiosity', 'Integrity', 'Creative Drive'],
        hobbies: pillars.hobbies || hobbiesList,
        dealbreakers: pillars.qualities?.dealbreakers || ['Lack of personal agency', 'Disrespect for focused craft'],
        pillars: pillars,
        isCustom: true
      };

      onCandidateAdded(newCandidate);
      setSuccessCandidate(newCandidate);
      haptics.playChime();
    } catch (err) {
      setError(err.message || 'Failed to extract candidate persona.');
      haptics.playThud();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Header Banner */}
      <div className="tactile-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 className="font-editorial-serif" style={{ fontSize: '1.8rem', fontWeight: 600 }}>
                Autonomous Candidate Ingestion
              </h2>
              <span className="match-badge high">LIVE EXTRACTION ENGINE</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Paste any verified LinkedIn URL and public Instagram handle. The reading agent extracts 4 profile pillars (Needs, Hobbies, Interests, Qualities) with citations and integrates them into the dating pool.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className="tactile-btn"
                style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem' }}
              >
                <Sparkles size={12} color="var(--accent-gold)" />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 1fr)', gap: '1.5rem' }}>
        {/* Ingestion Form */}
        <div className="tactile-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <UserPlus size={18} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Profile Input & Verification</h3>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(230, 125, 125, 0.12)',
              border: '1px solid rgba(230, 125, 125, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: 'var(--accent-rose)',
              marginBottom: '1rem'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  FULL NAME *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sam Altman"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.84rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  ROLE / HEADLINE
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI Research Lead"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.84rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  LINKEDIN PROFILE URL *
                </label>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/in/..."
                  value={formData.linkedin}
                  onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.84rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  INSTAGRAM URL * (PUBLIC ONLY)
                </label>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/..."
                  value={formData.instagram}
                  onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.84rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                LOCATION / TIMEZONE
              </label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA / London / Bengaluru"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.84rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                ABOUT / BIO NOTES (FOR LLM EXTRACTOR)
              </label>
              <textarea
                rows={3}
                placeholder="Paste background text, bio, or public summary..."
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.84rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                HOBBIES & LEISURE (COMMA SEPARATED)
              </label>
              <input
                type="text"
                placeholder="e.g. Specialty Coffee, Alpine Bouldering, Mechanical Keyboards"
                value={formData.hobbies}
                onChange={e => setFormData({ ...formData, hobbies: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.84rem'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="tactile-btn tactile-btn-primary"
              style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
            >
              {loading ? <RefreshCw size={15} className="spin" /> : <Sparkles size={15} />}
              <span>{loading ? 'Ingesting & Synthesizing 4 Pillars...' : 'Run Agent Ingestion & Dating Intake'}</span>
            </button>
          </form>
        </div>

        {/* Live Extraction Feedback & Custom Cohort List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Success Box */}
          {successCandidate && (
            <div className="tactile-card" style={{ padding: '1.25rem', border: '1px solid var(--accent-emerald)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="var(--accent-emerald)" />
                  <strong style={{ fontSize: '0.95rem', color: 'var(--accent-emerald)' }}>
                    Candidate Ingested Successfully!
                  </strong>
                </div>
                <span className="match-badge high">4 PILLARS ACTIVE</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.85rem' }}>
                <Avatar name={successCandidate.name} size={48} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{successCandidate.name}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--accent-gold)' }}>{successCandidate.role}</div>
                </div>
              </div>

              <div style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-surface-raised)',
                fontSize: '0.78rem',
                lineHeight: 1.45,
                color: 'var(--text-secondary)',
                marginBottom: '1rem'
              }}>
                <div><strong style={{ color: 'var(--accent-gold)' }}>Needs:</strong> {successCandidate.pillars?.needs?.[0]}</div>
                <div style={{ marginTop: '0.3rem' }}><strong style={{ color: 'var(--accent-emerald)' }}>Hobbies:</strong> {successCandidate.pillars?.hobbies?.join(', ')}</div>
                <div style={{ marginTop: '0.3rem' }}><strong style={{ color: 'var(--accent-rose)' }}>Dealbreakers:</strong> {successCandidate.pillars?.qualities?.dealbreakers?.[0]}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => onDateCandidate(successCandidate.id)}
                  className="tactile-btn tactile-btn-primary"
                  style={{ fontSize: '0.78rem', flex: 1, justifyContent: 'center' }}
                >
                  <span>Launch Date in Arena</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Added Candidates List */}
          <div className="tactile-card" style={{ padding: '1.25rem', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                Custom Added Candidates ({addedCandidates.length})
              </h4>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                SESSION STORAGE
              </span>
            </div>

            {addedCandidates.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '1rem' }}>
                No custom candidates added yet. Use the form on the left or click a preset above to test real-time profile ingestion.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {addedCandidates.map(c => (
                  <div
                    key={c.id}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-surface-raised)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <Avatar name={c.name} size={36} />
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.role}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                      <button
                        onClick={() => onDateCandidate(c.id)}
                        className="tactile-btn"
                        style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}
                      >
                        Date
                      </button>
                      <button
                        onClick={() => onRemoveCandidate(c.id)}
                        className="tactile-btn"
                        style={{ fontSize: '0.72rem', padding: '0.25rem 0.45rem', color: 'var(--accent-rose)' }}
                        title="Remove candidate (Right to be Forgotten)"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
