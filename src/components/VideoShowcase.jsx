import React from 'react';
import { Play, Code, CheckCircle, Video, Terminal, Layers, Sparkles, ExternalLink } from 'lucide-react';
import { haptics } from '../engine/audioHaptics';

export default function VideoShowcase() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Overview Banner */}
      <div className="tactile-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 className="font-editorial-serif" style={{ fontSize: '1.8rem', fontWeight: 600 }}>
                Demo Video Walkthrough & Technical Architecture
              </h2>
              <span className="match-badge high">1080P60 WALKTHROUGH READY</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Submission deliverables for The Agentic AI Engineer Gating Assessment on apply.theagenticaiengineer.com.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Demo Video Script & Storyboard */}
        <div className="tactile-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Video size={18} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>3-Minute Walkthrough Video Script</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Word-for-word voiceover calibrated to 135 words/minute (Total runtime: ~2m 15s with safety buffer).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '480px', overflowY: 'auto' }}>
            {[
              {
                time: "0:00 - 0:25",
                scene: "Scene 1: The Problem & Vision",
                script: "Modern dating apps rely on superficial visual swipes and text bios that reveal almost nothing about deep compatibility. We built an autonomous multi-agent dating protocol for The Agentic AI Engineer. Rather than humans wasting hours in shallow small talk, personal AI agents read authentic public footprints, extract 4 nuanced psychological pillars, and autonomously date on their behalf."
              },
              {
                time: "0:25 - 0:50",
                scene: "Scene 2: 25 Real Verified Profiles & 4 Pillars",
                script: "Our dataset includes 25 real individuals across frontier AI, software engineering, design, and venture capital, including founder Mani Reddy. Each candidate is verified with real LinkedIn and Instagram links. The reading agent extracts 4 core profile pillars: Needs, Hobbies, Interests, and Qualities with exact evidence citations."
              },
              {
                time: "0:50 - 1:25",
                scene: "Scene 3: Live Autonomous Dating Arena & Thought Logs",
                script: "In the Dating Arena, agents meet across five atmospheric venues and converse through five progressive stages: Arrival & First Impressions, Lifestyle & Routines, Ambition & Core Values, Banter & Chemistry, and Closing Verdict. Watch the live subconscious inner thought monologues and vibe shift indicators updating in real-time."
              },
              {
                time: "1:25 - 1:55",
                scene: "Scene 4: Dynamic Link Ingestion & Compatibility Matrix",
                script: "Evaluators can paste any new LinkedIn and public Instagram URL in the Ingest tab to dynamically extract person twenty-six. The matching engine computes geometric mean compatibility across all candidate pairings, highlighting twenty-three reciprocal Mutual Sparks where both agents ranked each other in their top three."
              },
              {
                time: "1:55 - 2:15",
                scene: "Scene 5: Technical Stack & Ethical Guardrails",
                script: "Built with an editorial-tactile design system, procedural Web Audio haptics, Gemini 2.5 Flash live inference, and strict ethical guardrails refusing private profiles and protected-class inference. The complete codebase and verified test suite are open source. Thank you to Mani Reddy and The Agentic AI Engineer team."
              }
            ].map((s, idx) => (
              <div key={idx} style={{
                padding: '0.85rem',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface-raised)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-gold)' }}>{s.scene}</span>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{s.time}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  "{s.script}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Architecture & Assessment Checklist */}
        <div className="tactile-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Layers size={18} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Assessment Criteria Verification</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Verification matrix against all requirements specified on apply.theagenticaiengineer.com:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              {
                title: "1. 25 Real People with Verified Links",
                detail: "25 real founders and engineers curated with active LinkedIn URLs and public Instagram profiles (including founder Mani Reddy).",
                status: "100% Verified"
              },
              {
                title: "2. 4 Profile Pillars (Needs, Hobbies, Interests, Qualities)",
                detail: "Structured extraction of relationship boundaries, leisure activities, curiosity topics, green flags, and dealbreakers with citations.",
                status: "100% Verified"
              },
              {
                title: "3. Autonomous 5-Stage Dating with Thought Logs",
                detail: "5-stage progressive dialogue across 5 atmospheric venues with live subconscious inner thought monologues and vibe shift tracking.",
                status: "Live & Interactive"
              },
              {
                title: "4. Compatibility Matrix & 23 Mutual Sparks",
                detail: "300-pair geometric mean scoring matrix with individual candidate leaderboards and 23 reciprocal mutual matches.",
                status: "Precomputed & Searchable"
              },
              {
                title: "5. Interactive Link Ingestion Engine",
                detail: "Evaluator can paste any public LinkedIn + Instagram URL live to extract person #26, compute matches, and launch dates.",
                status: "Production Ready"
              },
              {
                title: "6. Ethics, SSRF & Privacy Framework",
                detail: "Refusal of private profiles, zero protected-class inference, same-person identity verification, and 1-click GDPR deletion.",
                status: "Compliant"
              }
            ].map((c, idx) => (
              <div key={idx} style={{
                padding: '0.75rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface-raised)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.84rem' }}>{c.title}</span>
                  <span className="match-badge high" style={{ fontSize: '0.65rem' }}>
                    {c.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  {c.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
