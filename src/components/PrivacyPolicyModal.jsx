import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, UserCheck, Trash2, CheckCircle2 } from 'lucide-react';
import { haptics } from '../engine/audioHaptics';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div className="tactile-card" style={{
        maxWidth: '580px',
        width: '100%',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-warm-lg)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={22} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Ethics, Safety & Privacy Framework</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          Autonomous agentic dating operates under strict privacy and ethical safety boundaries. The system is designed to adhere to ethical standards, protecting user boundaries while assessing compatibility.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.85rem', borderRadius: '8px', backgroundColor: 'var(--bg-surface-raised)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <EyeOff size={16} color="var(--accent-rose)" />
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>1. Strict Private Account Refusal</strong>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
              Only publicly accessible profile endpoints are ingested. Any Instagram account flagged as <code>is_private: true</code> is immediately refused per the assignment specification.
            </p>
          </div>

          <div style={{ padding: '0.85rem', borderRadius: '8px', backgroundColor: 'var(--bg-surface-raised)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Lock size={16} color="var(--accent-gold)" />
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>2. Zero Protected-Class Inference</strong>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
              The extraction model is explicitly prompted never to infer or evaluate protected characteristics: religious beliefs, political affiliations, medical history, or sexual orientation.
            </p>
          </div>

          <div style={{ padding: '0.85rem', borderRadius: '8px', backgroundColor: 'var(--bg-surface-raised)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <UserCheck size={16} color="var(--accent-cyan)" />
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>3. Cross-Platform Same-Person Verification</strong>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
              The ingestion engine compares the verified LinkedIn name against the Instagram profile name and handle to eliminate cross-identity misattribution before synthesis.
            </p>
          </div>

          <div style={{ padding: '0.85rem', borderRadius: '8px', backgroundColor: 'var(--bg-surface-raised)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Trash2 size={16} color="var(--accent-rose)" />
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>4. Instant Erasure & Right to be Forgotten</strong>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
              Every candidate card contains a 1-click removal button. Evaluators can purge newly ingested profiles or clear local caches immediately.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => { haptics.playClick(200); onClose(); }}
            className="tactile-btn tactile-btn-primary"
            style={{ fontSize: '0.82rem' }}
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
