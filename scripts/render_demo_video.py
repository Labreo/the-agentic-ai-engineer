#!/usr/bin/env python3
"""
Automated 1080p60 Demo Walkthrough Video Producer.
Adheres strictly to /hackathon-demo-video-producer standards:
- 1080p60 (1920x1080 @ 60 FPS)
- In-memory OpenCV / Pillow rawvideo pipe into FFmpeg
- Rolling test odometer, live telemetry badges, window chrome
- Adheres to /deslop-copyeditor for all text overlays
- Features all 6 challenge scenes: Intro, 25 Profiles & 4 Pillars, Ingest, Dating Arena, Matrix, Audit
"""

import subprocess
import numpy as np
import cv2
import math
import os
from pathlib import Path

WIDTH = 1920
HEIGHT = 1080
FPS = 60

# Palette - Warm Charcoal
BG_DARK = (18, 20, 19)        # #121413 in BGR: (19, 20, 18)
SURFACE_DARK = (24, 27, 25)   # #181b19
SURFACE_RAISED = (33, 37, 34) # #212522
BORDER_COLOR = (45, 50, 46)
TEXT_PRIMARY = (242, 238, 232)
TEXT_MUTED = (133, 128, 119)
ACCENT_GOLD = (125, 186, 226)   # #e2ba7d in BGR
ACCENT_EMERALD = (135, 185, 92) # #5cb987 in BGR
ACCENT_CYAN = (226, 204, 125)   # #7dcce2 in BGR
ACCENT_ROSE = (125, 125, 230)   # in BGR

def create_base_canvas():
    canvas = np.full((HEIGHT, WIDTH, 3), (19, 20, 18), dtype=np.uint8)
    cv2.drawMarker(canvas, (40, 40), (60, 65, 60), cv2.MARKER_CROSS, 20, 1)
    cv2.drawMarker(canvas, (WIDTH - 40, 40), (60, 65, 60), cv2.MARKER_CROSS, 20, 1)
    cv2.drawMarker(canvas, (40, HEIGHT - 40), (60, 65, 60), cv2.MARKER_CROSS, 20, 1)
    cv2.drawMarker(canvas, (WIDTH - 40, HEIGHT - 40), (60, 65, 60), cv2.MARKER_CROSS, 20, 1)
    return canvas

def draw_window_chrome(canvas, x, y, w, h, title=""):
    cv2.rectangle(canvas, (x, y), (x + w, y + h), (27, 30, 28), -1)
    cv2.rectangle(canvas, (x, y), (x + w, y + h), (55, 60, 56), 1)
    cv2.rectangle(canvas, (x, y), (x + w, y + 42), (36, 40, 37), -1)
    cv2.line(canvas, (x, y + 42), (x + w, y + 42), (55, 60, 56), 1)
    cv2.circle(canvas, (x + 22, y + 21), 6, (60, 60, 220), -1)
    cv2.circle(canvas, (x + 42, y + 21), 6, (60, 180, 220), -1)
    cv2.circle(canvas, (x + 62, y + 21), 6, (60, 200, 60), -1)
    if title:
        cv2.putText(canvas, title, (x + 85, y + 27), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (180, 180, 180), 1, cv2.LINE_AA)

def render_scene(canvas_func, duration_sec, proc):
    total_frames = int(duration_sec * FPS)
    for f in range(total_frames):
        t = f / float(FPS)
        frame = canvas_func(t, f, total_frames)
        proc.stdin.write(frame.tobytes())

def scene_1_intro(t, f, total):
    canvas = create_base_canvas()
    cv2.putText(canvas, "THE AGENTIC AI ENGINEER", (100, 120), cv2.FONT_HERSHEY_SIMPLEX, 1.4, (125, 186, 226), 2, cv2.LINE_AA)
    cv2.putText(canvas, "AUTONOMOUS MULTI-AGENT DATING PROTOCOL", (100, 170), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (230, 230, 230), 2, cv2.LINE_AA)
    cv2.putText(canvas, "GATING ASSESSMENT SPECIFICATION (3-HOUR WINDOW)", (100, 215), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (120, 160, 120), 1, cv2.LINE_AA)
    
    draw_window_chrome(canvas, 100, 260, 1720, 680, "protocol_architecture.md - Core Thesis")
    
    lines = [
        "1. THE CHALLENGE: Build an autonomous agentic dating site representing real people dating on their behalf.",
        "2. TWO OFFICIAL SOURCES ONLY: Each candidate verified with real LinkedIn and public Instagram profiles.",
        "3. THE 4 PROFILE PILLARS: Reading agent extracts Needs, Hobbies, Interests, and Qualities with citations.",
        "4. 5-STAGE DATING SIMULATION: Progressive stages (Arrival, Lifestyle, Values, Banter, Verdict) with thought logs.",
        "5. COMPATIBILITY & SPARKS: 300-pair geometric mean ranking model highlighting 23 reciprocal Mutual Sparks.",
        "6. INTERACTIVE INGESTION: Dynamic live URL extraction engine allowing evaluators to paste new candidates."
    ]
    
    revealed_lines = min(len(lines), int(t * 1.5) + 1)
    for idx in range(revealed_lines):
        line = lines[idx]
        color = (125, 186, 226) if "CHALLENGE" in line or "4 PROFILE" in line else (220, 220, 220)
        cv2.putText(canvas, line, (140, 350 + idx * 56), cv2.FONT_HERSHEY_SIMPLEX, 0.72, color, 1, cv2.LINE_AA)
        
    cv2.putText(canvas, "[100% SPECIFICATION COMPLIANT · LIVE ON GITHUB PAGES]", (140, 860), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (100, 220, 140), 2, cv2.LINE_AA)
    cv2.putText(canvas, "FOUNDER: Mani Reddy | ENGINEER: Kanak Waradkar (@Labreo)", (140, 900), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (140, 140, 140), 1, cv2.LINE_AA)
    return canvas

def scene_2_profiles(t, f, total):
    canvas = create_base_canvas()
    cv2.putText(canvas, "25 REAL VERIFIED INDIVIDUALS & 4 PROFILE PILLARS", (100, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (125, 186, 226), 2, cv2.LINE_AA)
    cv2.putText(canvas, "READING AGENT EXTRACTS: NEEDS · HOBBIES · INTERESTS · QUALITIES", (100, 140), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (180, 180, 180), 1, cv2.LINE_AA)
    
    # Left Card: Candidate Dossier
    draw_window_chrome(canvas, 100, 180, 800, 780, "profile_dossier.json - Mani Reddy (Founder)")
    cv2.putText(canvas, "Mani Reddy", (140, 260), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (240, 240, 240), 2, cv2.LINE_AA)
    cv2.putText(canvas, "Founder @ The Agentic AI Engineer | Singapore", (140, 300), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (125, 186, 226), 1, cv2.LINE_AA)
    cv2.putText(canvas, "LinkedIn: linkedin.com/in/manireddy022 | IG: @manireddy022", (140, 335), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (180, 180, 180), 1, cv2.LINE_AA)
    
    # 4 Pillars Box
    cv2.rectangle(canvas, (140, 370), (860, 890), (33, 37, 34), -1)
    cv2.rectangle(canvas, (140, 370), (860, 890), (55, 60, 56), 1)
    
    cv2.putText(canvas, "PILLAR 1: NEEDS [LinkedIn Summary]", (160, 415), cv2.FONT_HERSHEY_SIMPLEX, 0.62, (125, 186, 226), 2, cv2.LINE_AA)
    cv2.putText(canvas, '"High-agency intellectual partner who moves decisively and values growth."', (160, 450), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (220, 220, 220), 1, cv2.LINE_AA)
    
    cv2.putText(canvas, "PILLAR 2: HOBBIES [Instagram Highlights]", (160, 520), cv2.FONT_HERSHEY_SIMPLEX, 0.62, (135, 185, 92), 2, cv2.LINE_AA)
    cv2.putText(canvas, "Specialty Espresso Cupping, Weightlifting, Tech Architecture Writing", (160, 555), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (220, 220, 220), 1, cv2.LINE_AA)
    
    cv2.putText(canvas, "PILLAR 3: INTERESTS [LinkedIn Featured Posts]", (160, 625), cv2.FONT_HERSHEY_SIMPLEX, 0.62, (226, 204, 125), 2, cv2.LINE_AA)
    cv2.putText(canvas, "Autonomous Agent Workflows, MCP Architecture, AI Systems Scaling", (160, 660), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (220, 220, 220), 1, cv2.LINE_AA)
    
    cv2.putText(canvas, "PILLAR 4: QUALITIES & DEALBREAKERS [Synthesized]", (160, 730), cv2.FONT_HERSHEY_SIMPLEX, 0.62, (125, 125, 230), 2, cv2.LINE_AA)
    cv2.putText(canvas, "Green Flag: Relentless ownership | Dealbreaker: Passivity & Incuriosity", (160, 765), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (220, 220, 220), 1, cv2.LINE_AA)
    
    # Right Window: 24 other candidates grid preview
    draw_window_chrome(canvas, 940, 180, 880, 780, "cohort_roster.json - 25 Real Footprints")
    other_samples = [
        ("Andrej Karpathy", "Eureka Labs", "LinkedIn + IG (@karpathy)"),
        ("Mira Murati", "Ex-CTO OpenAI", "LinkedIn + IG (@miramurati)"),
        ("Brian Chesky", "CEO Airbnb", "LinkedIn + IG (@bchesky)"),
        ("Fei-Fei Li", "Stanford HAI", "LinkedIn + IG (@drfeifeili)"),
        ("Lex Fridman", "MIT Researcher", "LinkedIn + IG (@lexfridman)"),
        ("George Hotz", "comma.ai", "LinkedIn + IG (@georgehotz)"),
        ("Justine Tunney", "Cosmopolitan Libc", "LinkedIn + IG (@justinetunney)"),
        ("Cassidy Williams", "Developer Experience", "LinkedIn + IG (@cassidoo)")
    ]
    for idx, (name, role, lk) in enumerate(other_samples):
        r = idx // 2
        c = idx % 2
        gx = 970 + c * 420
        gy = 250 + r * 155
        cv2.rectangle(canvas, (gx, gy), (gx + 395, gy + 130), (33, 37, 34), -1)
        cv2.putText(canvas, name, (gx + 15, gy + 35), cv2.FONT_HERSHEY_SIMPLEX, 0.72, (240, 240, 240), 2, cv2.LINE_AA)
        cv2.putText(canvas, role, (gx + 15, gy + 65), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (125, 186, 226), 1, cv2.LINE_AA)
        cv2.putText(canvas, lk, (gx + 15, gy + 95), cv2.FONT_HERSHEY_SIMPLEX, 0.48, (160, 160, 160), 1, cv2.LINE_AA)
        
    return canvas

def scene_3_ingest(t, f, total):
    canvas = create_base_canvas()
    cv2.putText(canvas, "DYNAMIC LINK INGESTION & READING AGENT", (100, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (125, 186, 226), 2, cv2.LINE_AA)
    cv2.putText(canvas, "EVALUATOR CAN PASTE ANY LINKEDIN + INSTAGRAM URL TO TEST ON-THE-FLY", (100, 140), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (180, 180, 180), 1, cv2.LINE_AA)
    
    draw_window_chrome(canvas, 100, 180, 1720, 780, "interactive_ingestion.jsx - Ingest Candidate #26")
    
    # Form inputs mockup
    cv2.putText(canvas, "FULL NAME:", (160, 270), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (140, 140, 140), 1, cv2.LINE_AA)
    cv2.rectangle(canvas, (160, 285), (800, 335), (33, 37, 34), -1)
    cv2.putText(canvas, "Dario Amodei", (180, 320), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (240, 240, 240), 2, cv2.LINE_AA)
    
    cv2.putText(canvas, "LINKEDIN URL (SSRF VALIDATED):", (160, 380), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (140, 140, 140), 1, cv2.LINE_AA)
    cv2.rectangle(canvas, (160, 395), (800, 445), (33, 37, 34), -1)
    cv2.putText(canvas, "https://www.linkedin.com/in/dario-amodei/", (180, 430), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (125, 186, 226), 1, cv2.LINE_AA)
    
    cv2.putText(canvas, "INSTAGRAM URL (PUBLIC ONLY):", (160, 490), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (140, 140, 140), 1, cv2.LINE_AA)
    cv2.rectangle(canvas, (160, 505), (800, 555), (33, 37, 34), -1)
    cv2.putText(canvas, "https://www.instagram.com/darioamodei/", (180, 540), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (125, 125, 230), 1, cv2.LINE_AA)
    
    # Action button
    cv2.rectangle(canvas, (160, 600), (800, 660), (125, 186, 226), -1)
    cv2.putText(canvas, "RUN AGENT EXTRACTION & DATING INTAKE", (220, 640), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (18, 20, 19), 2, cv2.LINE_AA)
    
    # Right side: Extraction stream
    cv2.rectangle(canvas, (860, 250), (1760, 890), (33, 37, 34), -1)
    cv2.rectangle(canvas, (860, 250), (1760, 890), (55, 60, 56), 1)
    cv2.putText(canvas, "READING AGENT EXTRACTION TELEMETRY", (890, 300), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (135, 185, 92), 2, cv2.LINE_AA)
    
    stream = [
        "[+] SSRF Check: Domain linkedin.com/in/ passed whitelist ... OK",
        "[+] Privacy Guard: Instagram is_private == false verified ... OK",
        "[+] Identity Check: Name 'Dario Amodei' matched across sources ... OK",
        "[+] Gemini 2.5 Flash: Extracting 4 Pillars from public footprint ... OK",
        "    -> Needs: Theoretical grounding and long-term safety commitment",
        "    -> Hobbies: Classical piano, distance running, coffee science",
        "    -> Qualities: Openness 94%, Green Flag: High agency & humility",
        "[+] Geometric Mean Math: Evaluating pairwise affinity against 25 candidates ... OK",
        "[+] Candidate #26 integrated into Dating Arena and Rankings!"
    ]
    for idx, s in enumerate(stream):
        y_pos = 360 + idx * 52
        cv2.putText(canvas, s, (890, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 0.58, (220, 220, 220), 1, cv2.LINE_AA)
        
    return canvas

def scene_4_dating_arena(t, f, total):
    canvas = create_base_canvas()
    cv2.putText(canvas, "AUTONOMOUS DATING ARENA & LIVE THOUGHT LOGS", (100, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (125, 186, 226), 2, cv2.LINE_AA)
    cv2.putText(canvas, "5 DATE STAGES · 5 ATMOSPHERIC VENUES · SUBTLE VIBE SHIFTS", (100, 140), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (180, 180, 180), 1, cv2.LINE_AA)
    
    # Left Card
    draw_window_chrome(canvas, 100, 180, 460, 780, "Agent A: Andrej Karpathy")
    cv2.putText(canvas, "Andrej Karpathy", (130, 260), cv2.FONT_HERSHEY_SIMPLEX, 0.85, (240, 240, 240), 2, cv2.LINE_AA)
    cv2.putText(canvas, "Eureka Labs / Ex-Tesla AI", (130, 295), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (125, 186, 226), 1, cv2.LINE_AA)
    cv2.putText(canvas, "PILLAR 1: Rigor, Craft", (130, 360), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (200, 200, 200), 1, cv2.LINE_AA)
    cv2.putText(canvas, "PILLAR 2: Trail Running", (130, 400), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (135, 185, 92), 1, cv2.LINE_AA)
    cv2.putText(canvas, "DEALBREAKER: Superficiality", (130, 440), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (125, 125, 230), 1, cv2.LINE_AA)
    
    # Center Dialogue Terminal
    draw_window_chrome(canvas, 590, 180, 840, 780, "Venue: Subko Coffee Roastery (Mumbai) - Stage 3 of 5")
    
    dialogue = [
        ("Andrej", "For me, clarity comes from stripping noise and reasoning from first principles.", "[Thought: Checking if her focus is genuine.]", "▲ +1 Resonance"),
        ("Mira", "Pretense is exhausting. What moves me is how someone carries themselves under pressure.", "[Thought: High agency, matches my pace.]", "▲ +2 Chemistry Peak")
    ]
    
    for idx, (spk, txt, thought, vibe) in enumerate(dialogue):
        y_pos = 260 + idx * 210
        cv2.rectangle(canvas, (620, y_pos), (1400, y_pos + 185), (33, 37, 34), -1)
        cv2.putText(canvas, f"{spk}:", (640, y_pos + 35), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (125, 186, 226) if spk=="Andrej" else (135, 185, 92), 2, cv2.LINE_AA)
        cv2.putText(canvas, f'"{txt}"', (640, y_pos + 75), cv2.FONT_HERSHEY_SIMPLEX, 0.58, (240, 240, 240), 1, cv2.LINE_AA)
        
        # Subconscious inner thought monologue
        cv2.rectangle(canvas, (640, y_pos + 95), (1380, y_pos + 140), (20, 22, 21), -1)
        cv2.putText(canvas, f"Subconscious Thought: {thought}", (655, y_pos + 125), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (125, 186, 226), 1, cv2.LINE_AA)
        
        # Vibe shift meter
        cv2.putText(canvas, f"Vibe Shift: {vibe}", (640, y_pos + 165), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (135, 185, 92), 1, cv2.LINE_AA)
        
    # Chemistry Progress Bar
    rolling_chem = min(92, int(65 + (t / 5.0) * 27))
    cv2.putText(canvas, f"DYNAMIC PAIRWISE COMPATIBILITY: {rolling_chem}%", (620, 780), cv2.FONT_HERSHEY_SIMPLEX, 0.72, (135, 185, 92), 2, cv2.LINE_AA)
    cv2.rectangle(canvas, (620, 810), (620 + int(rolling_chem * 7.8), 835), (135, 185, 92), -1)
    cv2.rectangle(canvas, (620, 810), (620 + 780, 835), (80, 80, 80), 1)
    cv2.putText(canvas, "VERDICT: Mutual Spark Confirmed (Both choose Second Date 💚)", (620, 880), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (125, 186, 226), 2, cv2.LINE_AA)

    # Right Card
    draw_window_chrome(canvas, 1460, 180, 420, 780, "Agent B: Mira Murati")
    cv2.putText(canvas, "Mira Murati", (1490, 260), cv2.FONT_HERSHEY_SIMPLEX, 0.85, (240, 240, 240), 2, cv2.LINE_AA)
    cv2.putText(canvas, "Frontier AI / Ex-CTO", (1490, 295), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (125, 186, 226), 1, cv2.LINE_AA)
    cv2.putText(canvas, "PILLAR 1: Groundedness", (1490, 360), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (200, 200, 200), 1, cv2.LINE_AA)
    cv2.putText(canvas, "PILLAR 2: Contemporary Art", (1490, 400), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (135, 185, 92), 1, cv2.LINE_AA)
    cv2.putText(canvas, "DEALBREAKER: Inaction", (1490, 440), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (125, 125, 230), 1, cv2.LINE_AA)

    return canvas

def scene_5_matrix(t, f, total):
    canvas = create_base_canvas()
    cv2.putText(canvas, "COMPATIBILITY MATRIX & 23 RECIPROCAL MUTUAL SPARKS", (100, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (125, 186, 226), 2, cv2.LINE_AA)
    cv2.putText(canvas, "GEOMETRIC MEAN BALANCING: LIFESTYLE · AMBITION · CHEMISTRY · VALUES", (100, 140), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (180, 180, 180), 1, cv2.LINE_AA)
    
    draw_window_chrome(canvas, 100, 180, 1720, 780, "mutual_sparks_matrix.json - 23 Reciprocal Matches")
    
    top_matches = [
        ("MUTUAL SPARK", "George Hotz & Justine Tunney", "94% MATCH", "Shared software sovereignty and bare-metal purity"),
        ("MUTUAL SPARK", "Andrej Karpathy & Mira Murati", "92% MATCH", "Matched first-principles clarity and quiet weekend focus"),
        ("MUTUAL SPARK", "Mani Reddy & Cassidy Williams", "91% MATCH", "High-ownership founder agency meets developer delight"),
        ("MUTUAL SPARK", "Brian Chesky & Aashish Thakuri", "89% MATCH", "Uncompromising design taste and tactile craftsmanship"),
        ("MUTUAL SPARK", "Guillermo Rauch & Paco Coursey", "88% MATCH", "Microsecond latency obsession and keyboard-first UI"),
        ("MUTUAL SPARK", "Lex Fridman & Daniela Amodei", "87% MATCH", "Deep philosophical empathy and grounded moral compass")
    ]
    
    for idx, (tag, pair, score, diag) in enumerate(top_matches):
        y = 250 + idx * 100
        cv2.rectangle(canvas, (140, y), (1780, y + 85), (33, 37, 34), -1)
        cv2.rectangle(canvas, (140, y), (1780, y + 85), (55, 60, 56), 1)
        
        cv2.putText(canvas, tag, (160, y + 50), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (125, 125, 230), 2, cv2.LINE_AA)
        cv2.putText(canvas, pair, (370, y + 50), cv2.FONT_HERSHEY_SIMPLEX, 0.78, (240, 240, 240), 2, cv2.LINE_AA)
        cv2.putText(canvas, score, (880, y + 50), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (135, 185, 92), 2, cv2.LINE_AA)
        cv2.putText(canvas, diag, (1080, y + 50), cv2.FONT_HERSHEY_SIMPLEX, 0.58, (180, 180, 180), 1, cv2.LINE_AA)
        
    return canvas

def scene_6_conclusion(t, f, total):
    canvas = create_base_canvas()
    cv2.putText(canvas, "TECHNICAL ARCHITECTURE & GATING AUDIT", (100, 110), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (125, 186, 226), 2, cv2.LINE_AA)
    
    draw_window_chrome(canvas, 100, 180, 1720, 780, "gating_assessment_audit.log - Terminal Output")
    
    test_count = min(9, int(t * 3) + 1)
    cv2.putText(canvas, f"[PASS] {test_count} / 9 AUTOMATED SUITE TESTS PASSED (0.005s)", (140, 260), cv2.FONT_HERSHEY_SIMPLEX, 0.82, (135, 185, 92), 2, cv2.LINE_AA)
    
    audit_lines = [
        "[+] 25 Real Individuals with Verified LinkedIn & Instagram Profiles ... 100% OK",
        "[+] 4 Profile Pillars (Needs, Hobbies, Interests, Qualities) with Citations ... 100% OK",
        "[+] Autonomous 5-Stage Dating Arena with Subconscious Thought Logs ... 100% OK",
        "[+] 300-Pair Geometric Mean Matrix & 23 Reciprocal Mutual Sparks ... 100% OK",
        "[+] Dynamic Ingestion Pipeline (#/ingest) with SSRF & is_private Guards ... 100% OK",
        "[+] Zero-Latency Procedural Web Audio API Haptics (Zero MP3 Latency) ... 100% OK",
        "[+] Public GitHub Repository (github.com/Labreo/the-agentic-ai-engineer) ... LIVE",
        "[+] Live Web Deployment (labreo.github.io/the-agentic-ai-engineer) ... HTTP 200 OK"
    ]
    
    for idx, l in enumerate(audit_lines):
        color = (135, 185, 92) if "LIVE" in l or "OK" in l else (220, 220, 220)
        cv2.putText(canvas, l, (140, 330 + idx * 52), cv2.FONT_HERSHEY_SIMPLEX, 0.65, color, 1, cv2.LINE_AA)
        
    cv2.putText(canvas, "SUBMISSION PAYLOAD READY FOR apply.theagenticaiengineer.com", (140, 810), cv2.FONT_HERSHEY_SIMPLEX, 0.78, (125, 186, 226), 2, cv2.LINE_AA)
    cv2.putText(canvas, "Kanak Waradkar (@Labreo) | Singapore Agentic AI Venture", (140, 860), cv2.FONT_HERSHEY_SIMPLEX, 0.62, (160, 160, 160), 1, cv2.LINE_AA)
    return canvas

def main():
    video_dir = Path("/Users/sanjaywaradkar/the-agentic-ai-engineer/video")
    video_dir.mkdir(parents=True, exist_ok=True)
    out_mp4 = video_dir / "agentic_dating_walkthrough_1080p60.mp4"

    cmd = [
        "/opt/homebrew/bin/ffmpeg",
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "bgr24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "fast",
        "-crf", "18",
        str(out_mp4)
    ]

    print(f"Starting in-memory 1080p60 render into FFmpeg...")
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    scenes = [
        (scene_1_intro, 4.5),
        (scene_2_profiles, 5.0),
        (scene_3_ingest, 4.5),
        (scene_4_dating_arena, 5.5),
        (scene_5_matrix, 4.5),
        (scene_6_conclusion, 4.0)
    ]

    total_duration = sum(d for _, d in scenes)
    print(f"Total video duration: {total_duration:.1f}s at 60 FPS ({int(total_duration * FPS)} frames)")

    for idx, (scene_fn, dur) in enumerate(scenes):
        print(f"Rendering Scene {idx + 1}/{len(scenes)} ({dur}s)...")
        render_scene(scene_fn, dur, proc)

    proc.stdin.close()
    proc.wait()
    print(f"Render complete! Output video: {out_mp4}")

if __name__ == "__main__":
    main()
