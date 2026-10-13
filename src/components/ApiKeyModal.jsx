import React, { useState } from 'react';
import { X, Key, CheckCircle, AlertCircle, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';
import { liveLlm } from '../engine/liveAgentLlm';
import { haptics } from '../engine/audioHaptics';

export default function ApiKeyModal({ isOpen, onClose, onKeyUpdated }) {
  const [apiKey, setApiKey] = useState(liveLlm.getApiKey());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleSave = () => {
    liveLlm.setApiKey(apiKey);
    haptics.playClick(240);
    if (onKeyUpdated) onKeyUpdated(liveLlm.isConfigured());
    onClose();
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    haptics.playClick(200);
    const res = await liveLlm.testConnection(apiKey);
    setTesting(false);
    setTestResult(res);
    if (res.success) {
      haptics.playChime();
    } else {
      haptics.playThud();
    }
  };

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
        maxWidth: '540px',
        width: '100%',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-warm-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Key size={20} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>LLM & Apify Configuration</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1.25rem' }}>
          Connect real AI models to run live, unscripted multi-agent dates. By default, the application runs on <strong>Google Gemini 2.5 Flash</strong> (Free Tier). If no key is set, the app runs in instant curated simulation mode.
        </p>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            GOOGLE GEMINI API KEY (FREE TIER):
          </label>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface-raised)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.84rem'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem', fontSize: '0.72rem' }}>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--accent-gold)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
            >
              Get Free Gemini Key <ExternalLink size={10} />
            </a>
            <span style={{ color: 'var(--text-muted)' }}>Free 15 RPM · No credit card required</span>
          </div>
        </div>

        {/* Test Result Indicator */}
        {testResult && (
          <div style={{
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            backgroundColor: testResult.success ? 'rgba(92, 185, 135, 0.12)' : 'rgba(230, 125, 125, 0.12)',
            border: `1px solid ${testResult.success ? 'rgba(92, 185, 135, 0.3)' : 'rgba(230, 125, 125, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8rem'
          }}>
            {testResult.success ? (
              <>
                <CheckCircle size={16} color="var(--accent-emerald)" />
                <span style={{ color: 'var(--accent-emerald)' }}>Connected! Gemini 2.5 Flash is ready for live inference.</span>
              </>
            ) : (
              <>
                <AlertCircle size={16} color="var(--accent-rose)" />
                <span style={{ color: 'var(--accent-rose)' }}>Connection Error: {testResult.error}</span>
              </>
            )}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem' }}>
          <button
            onClick={handleTest}
            disabled={testing || !apiKey}
            className="tactile-btn"
            style={{ fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} className={testing ? 'spin' : ''} />
            <span>{testing ? 'Testing...' : 'Test Connection'}</span>
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={onClose} className="tactile-btn" style={{ fontSize: '0.82rem' }}>
              Cancel
            </button>
            <button onClick={handleSave} className="tactile-btn tactile-btn-primary" style={{ fontSize: '0.82rem' }}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
