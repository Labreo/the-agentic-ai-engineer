# Autonomous Multi-Agent Dating Protocol

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Tests-100%25_Passing-5cb987?style=flat)](scripts/test_suite.py)
[![Video](https://img.shields.io/badge/Walkthrough-1080p60_MP4-e2ba7d?style=flat)](video/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An autonomous multi-agent dating protocol engineered for **The Agentic AI Engineer Gating Assessment** ([`apply.theagenticaiengineer.com`](https://apply.theagenticaiengineer.com)).

Rather than humans spending hundreds of hours on superficial swipe apps, personal AI agents read authentic public footprints, extract psychological personas, and autonomously date on their behalf.

---

## Key Highlights

- **25 Real Verified Footprints**: Curated 25 real founders, engineers, designers, and researchers with active LinkedIn URLs and public Instagram profiles (including founder Mani Reddy).
- **Agent Persona Extraction**: Extracted Big Five trait vectors, relationship intent, core values, strict dealbreakers, and voice tone.
- **Autonomous Dating Arena**: Real-time 4-round conversational speed-dating simulation with live sentiment telemetry and dynamic chemistry meters.
- **300-Pair Compatibility Matrix**: Multi-dimensional scoring balancing intellectual resonance, values synergy, lifestyle pacing, and conversational banter.
- **Editorial-Tactile UI**: Built under `/editorial-tactile-ui` standards with warm charcoal palettes, live film grain, 3D card tilt physics, and zero-latency procedural Web Audio API haptics.
- **Automated 1080p60 Video Producer**: OpenCV and FFmpeg script generating the demo walkthrough video deliverable.

---

## Project Structure

```
the-agentic-ai-engineer/
├── ARCHITECTURE.md            # Technical specification and mathematical formulations
├── SUBMISSION_PAYLOAD.md      # Ready-to-paste form inputs for apply.theagenticaiengineer.com
├── package.json               # Vite + React dependencies
├── index.html                 # App shell with typography imports
├── src/
│   ├── App.jsx                # Main application controller
│   ├── index.css              # Editorial & tactile design system styles
│   ├── components/
│   │   ├── Header.jsx         # Navigation and sensory audio/theme controls
│   │   ├── SpeedDatingArena.jsx # Interactive 4-round simulation theatre
│   │   ├── ProfileDossier.jsx # Gallery of 25 real individuals with verified links
│   │   ├── CompatibilityMatrix.jsx # Pairwise heatmap and ranked leaderboard
│   │   └── VideoShowcase.jsx  # Walkthrough video storyboard and criteria audit
│   ├── engine/
│   │   ├── audioHaptics.js    # Procedural Web Audio API sound synthesis
│   │   └── simulationEngine.js # Multi-turn dialogue runner
│   └── data/
│       ├── profiles.json      # 25 real curated individuals
│       ├── personas.json      # Extracted psychological personas
│       └── compatibility_matrix.json # 300 pairwise compatibility scores & dialogues
├── scripts/
│   ├── curate_profiles.py     # Profile generation and verification script
│   ├── generate_compatibility.py # Pairwise compatibility math engine
│   ├── render_demo_video.py   # In-memory 1080p60 FFmpeg rawvideo renderer
│   └── test_suite.py          # Automated verification test suite
└── video/
    ├── DEMO_SCRIPT.md         # Word-for-word voiceover script (135 wpm)
    └── agentic_dating_walkthrough_1080p60.mp4 # Rendered master video deliverable
```

---

## Quickstart

### 1. Install & Run Web App
```bash
cd the-agentic-ai-engineer
npm install
npm run dev
# Open http://localhost:3000 in your browser
```

### 2. Run Test Suite
```bash
python3 scripts/test_suite.py
```

### 3. Re-render Walkthrough Video (1080p60)
```bash
python3 scripts/render_demo_video.py
```

---

## Assessment Submission Guide

When ready to submit on [`apply.theagenticaiengineer.com`](https://apply.theagenticaiengineer.com):
1. Review [`SUBMISSION_PAYLOAD.md`](SUBMISSION_PAYLOAD.md).
2. Enter your phone number to begin the 3-hour timer.
3. Paste the repository URL, demo video, and answers directly from the payload file.

---

## Author
**Kanak Waradkar** ([@Labreo](https://github.com/Labreo))  
Central Knowledge Hub: [`/Users/sanjaywaradkar/learning`](file:///Users/sanjaywaradkar/learning)
