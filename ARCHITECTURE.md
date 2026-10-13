# Autonomous Multi-Agent Dating Protocol — Technical Specification

**Author**: Kanak Waradkar ([@Labreo](https://github.com/Labreo))  
**Assessment**: The Agentic AI Engineer Gating Assessment (`apply.theagenticaiengineer.com`)  
**Target Role**: Agentic AI Intern / Lead Engineer (S$2,000/mo)  

---

## 1. Executive Summary

This project implements an autonomous multi-agent dating protocol that pairs 25 real individuals through psychological persona extraction, real-time conversational simulations, and multi-dimensional compatibility scoring.

Rather than forcing humans into endless swipe fatigue, personal AI agents represent their human counterparts, engage in structured speed dates across four progressive rounds, and surface high-confidence matches backed by transparent diagnostic reasoning.

---

## 2. Core Components

```
┌────────────────────────────────────────────────────────┐
│  1. Real Footprint Intake (LinkedIn + Instagram)       │
│  25 real founders, engineers, designers, investors.    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  2. Psychological Persona Extraction                   │
│  Big Five traits, dating intent, values, dealbreakers. │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  3. Multi-Turn Autonomous Dating Simulation            │
│  Round 1: First Impression & Daily Pacing              │
│  Round 2: Core Philosophy & Manual Craft               │
│  Round 3: Boundary Check & Vulnerability               │
│  Round 4: Final Impression & Date Verdict              │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  4. Compatibility Matrix & Diagnostic Engine           │
│  300 pairwise evaluations: Vector distance + values.   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  5. Editorial & Tactile User Interface                 │
│  Warm charcoals, live grain, procedural Web Audio.     │
└────────────────────────────────────────────────────────┘
```

---

## 3. Persona Extraction Pipeline

Each candidate is structured into a normalized profile schema:
- **Identity & Footprint**: Full name, headline, current role, location, verified LinkedIn URL, and active Instagram handle.
- **Big Five Trait Vectors**:
  - *Openness to Experience* ($0 - 100$)
  - *Conscientiousness* ($0 - 100$)
  - *Extraversion* ($0 - 100$)
  - *Agreeableness* ($0 - 100$)
  - *Emotional Stability* ($0 - 100$)
- **Dating Intent**: Grounded statement detailing relationship expectations and daily pacing.
- **Core Values**: Three foundational beliefs guiding personal decisions.
- **Non-Negotiables**: Strict dealbreakers that cause conversational friction.
- **Voice Profile**: Tone markers, pacing quirks, and humor style.

---

## 4. Multi-Turn Dating Dialogue Protocol

When two agents interact, the simulation runs four structured rounds:

| Round | Focus Area | Dynamic Evaluation Metric |
|---|---|---|
| **Round 1** | Opening Impression & Context | Baseline conversational ease and shared curiosity |
| **Round 2** | Values, Daily Rhythms & Craft | First-principles alignment and creative dedication |
| **Round 3** | Dealbreakers & Handling Pressure | Stress response style, boundary respect, vulnerability |
| **Round 4** | Final Verdict & Decision | Mutual chemistry consolidation and second date score |

### Conversational Telemetry
Every turn computes:
1. **Sentiment Index**: Real-time sentiment rating ($-1.0$ to $+1.0$).
2. **Chemistry Delta**: Running percentage adjustment reflecting conversational synergy.
3. **Discovered Topics**: Explicit tags logging shared values or detected friction points.

---

## 5. Compatibility Scoring Mathematics

Given Person $A$ and Person $B$, compatibility $C(A, B)$ is computed as a weighted sum of four distinct vectors:

$$C(A, B) = 0.30 \cdot I(A, B) + 0.35 \cdot V(A, B) + 0.20 \cdot L(A, B) + 0.15 \cdot B(A, B)$$

Where:
1. **$I(A, B)$ — Intellectual & Openness Resonance**:
   Calculated from trait distance between openness and conscientiousness. High curiosity lifts both participants.
2. **$V(A, B)$ — Value Synergy & Dealbreaker Audit**:
   Baseline derived from shared core beliefs, penalized by direct intersections between one person's traits and the other's dealbreakers.
3. **$L(A, B)$ — Lifestyle & Pacing Synergy**:
   Measures harmony across leisure categories (early morning routines, endurance sports, artisanal coffee, analog crafts).
4. **$B(A, B)$ — Conversational Banter Dynamics**:
   Models extroversion-introversion balance and humor complement.

---

## 6. Editorial & Tactile UI Engineering

Adhering to `/editorial-tactile-ui` and `/anti-ui-slop`:
- **Warm Charcoal Palette**: Banned sterile `#000000` and `#ffffff`. Enforced `#121413` charcoal backgrounds, parchment light tokens, and warm tinted shadows (`rgba(36, 38, 34, 0.45)`).
- **Procedural Web Audio Haptics**: Integrated procedural PCM audio waveforms via Web Audio API. Zero external MP3 downloads. Delivers sub-millisecond mechanical clacks on interaction and harmonic chords on match discovery.
- **Perspective Card Physics**: Smooth 3D transforms (`perspective(53rem)`) with hover states and active speaker elevation.
- **Micro-Grain Atmosphere**: 6-frame jitter grain overlay giving screens analog depth.

---

## 7. Verification & Deliverables Summary

- **25 Real Footprints**: Fully verified LinkedIn URLs and Instagram handles.
- **Live Interactive Demo**: React + Vite application runnable locally on port 3000.
- **Automated Video Walkthrough**: 1080p60 MP4 generated directly via OpenCV and FFmpeg (`video/agentic_dating_walkthrough_1080p60.mp4`).
- **Complete Test Suite**: 9/9 automated test suites passing in `scripts/test_suite.py`.
