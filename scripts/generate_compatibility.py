#!/usr/bin/env python3
"""
Computes pairwise compatibility matrix across all 25 profiles and generates
dynamic multi-turn dating simulations.
Follows /deslop-copyeditor strictly (no banned words, natural authentic phrasing).
"""

import json
import math
from pathlib import Path

def compute_compatibility(p1, p2):
    """
    Computes multi-dimensional compatibility between two personas.
    Returns overall score, dimension breakdowns, diagnostic text, and verdict.
    """
    # 1. Trait Harmony (Big Five)
    t1 = p1["traits"]
    t2 = p2["traits"]
    
    # Openness: high synergy when both are curious
    open_score = 100 - abs(t1["openness"] - t2["openness"]) * 1.2
    
    # Conscientiousness: harmonious when within similar range
    cons_score = 100 - abs(t1["conscientiousness"] - t2["conscientiousness"]) * 1.0
    
    # Stability: mutual emotional grounding lifts both
    stab_score = (t1["stability"] + t2["stability"]) / 2.0
    
    # Extraversion: intro-extro dynamic works well if agreeableness is high
    extro_synergy = 85 + (15 if abs(t1["extraversion"] - t2["extraversion"]) > 20 else 5)
    
    intellectual = max(60, min(99, int((open_score * 0.6 + cons_score * 0.4))))
    
    # 2. Values & Dealbreakers
    v1 = set(v.lower() for v in p1["values"])
    v2 = set(v.lower() for v in p2["values"])
    shared_values = len(v1.intersection(v2))
    
    values_base = 78 + (shared_values * 8)
    
    # Check dealbreaker friction
    d1 = [d.lower() for d in p1["dealbreakers"]]
    d2 = [d.lower() for d in p2["dealbreakers"]]
    
    friction = 0
    # Example: If one person values raw speed and other hates rush
    if any("rush" in d or "shortcuts" in d for d in d1 + d2) and any("speed" in v for v in v1.union(v2)):
        friction += 10
    if any("corporate" in d or "bureaucracy" in d for d in d1 + d2) and any(corp in p2["role"].lower() for corp in ["aws", "fortune"]):
        friction += 8

    values_score = max(55, min(98, int(values_base - friction)))
    
    # 3. Lifestyle & Hobbies
    h1 = set(h.lower() for h in p1["hobbies"])
    h2 = set(h.lower() for h in p2["hobbies"])
    # Check overlapping themes: coffee, outdoors, books, sports, design
    themes = [
        {"coffee", "espresso", "pour-overs", "tea"},
        {"hiking", "cycling", "running", "marathon", "triathlon", "volleyball", "badminton", "bouldering"},
        {"design", "typography", "architecture", "photography", "art"},
        {"reading", "literature", "philosophy", "history"}
    ]
    overlap_count = 0
    for theme in themes:
        if (h1 & theme) and (h2 & theme):
            overlap_count += 1
            
    lifestyle_score = max(62, min(97, int(72 + overlap_count * 9)))
    
    # 4. Conversational Banter & Chemistry
    banter_score = max(65, min(99, int((extro_synergy * 0.4 + stab_score * 0.3 + intellectual * 0.3))))
    
    # Weighted overall
    overall = int(intellectual * 0.30 + values_score * 0.35 + lifestyle_score * 0.20 + banter_score * 0.15)
    
    # Diagnostic synthesis adhering to /deslop-copyeditor
    if overall >= 90:
        verdict = "Exceptional Soulmates"
        diagnostic = f"Deep intellectual resonance pairs naturally with shared lifestyle priorities. Both {p1['name'].split()[0]} and {p2['name'].split()[0]} prize genuine craft and grounded honesty, creating effortless conversational flow."
    elif overall >= 82:
        verdict = "High Chemistry Match"
        diagnostic = f"Strong alignment on daily values and mutual curiosity. While their individual work rhythms differ slightly, their shared appreciation for creative dedication sparks engaging banter."
    elif overall >= 74:
        verdict = "Intriguing Contrast"
        diagnostic = f"Distinct communication styles offer complementary energy. Their contrasting temperaments provoke stimulating debate without violating core life priorities."
    else:
        verdict = "Creative Tension"
        diagnostic = f"Noticeable divergence in lifestyle pacing and daily priorities. While mutual respect remains high, long-term harmony would require conscious adjustment."
        
    return {
        "overall": overall,
        "breakdown": {
            "intellectual": intellectual,
            "values": values_score,
            "lifestyle": lifestyle_score,
            "banter": banter_score
        },
        "verdict": verdict,
        "diagnostic": diagnostic
    }

def generate_sample_dialogue(p1, p2, compat):
    """
    Generates a realistic 4-round speed date dialogue between two agents.
    Adheres strictly to /deslop-copyeditor.
    """
    name1 = p1["name"].split()[0]
    name2 = p2["name"].split()[0]
    
    turns = [
        # Round 1: Icebreaker
        {
            "round": 1,
            "title": "First Impression & Opening Energy",
            "speaker": name1,
            "avatar": p1["avatar"],
            "text": f"Hey {name2}. I was reading through your work earlier. You spend an extraordinary amount of time immersed in hard problems, yet your photos show you finding quiet spaces outdoors. What does an ideal Sunday look like when you turn off all notifications?",
            "innerThought": f"I notice {name2} arrived completely present without looking at their phone. That immediately signals grounded focus.",
            "sentiment": 0.85,
            "discovered": "Curiosity about personal downtime"
        },
        {
            "round": 1,
            "title": "First Impression & Opening Energy",
            "speaker": name2,
            "avatar": p2["avatar"],
            "text": f"It always starts with fresh coffee and absolute quiet. No screens for the first two hours. Usually a long walk outside or getting lost in an old book. Then diving into something hands-on because I genuinely love the craft. How do you recharge after intense weeks?",
            "innerThought": "They asked about my personal recharge habits rather than launching into a resume boast. Great start.",
            "sentiment": 0.88,
            "discovered": "Shared love for quiet morning routines"
        },
        # Round 2: Core Philosophy & Craft
        {
            "round": 2,
            "title": "Values, Daily Rhythms & Creative Drive",
            "speaker": name1,
            "avatar": p1["avatar"],
            "text": f"I focus best when I strip away noise and build from first principles. If something cannot be explained simply, it means we do not understand it well enough. For me, a relationship needs that same clarity—raw honesty without games.",
            "innerThought": "Looking for any corporate platitudes. When they speak directly without pretense, we align.",
            "sentiment": 0.92,
            "discovered": "Mutual commitment to emotional clarity"
        },
        {
            "round": 2,
            "title": "Values, Daily Rhythms & Creative Drive",
            "speaker": name2,
            "avatar": p2["avatar"],
            "text": f"Completely agreed. Life is too short for performative posturing. What matters to me is whether someone stays grounded under pressure and treats people with empathy when things get difficult.",
            "innerThought": "Empathy and dignity under pressure are non-negotiable. We share that exact foundation.",
            "sentiment": 0.94,
            "discovered": "Deep alignment on emotional resilience"
        },
        # Round 3: The Vulnerable Question & Boundary Check
        {
            "round": 3,
            "title": "Dealbreakers & Handling Pressure",
            "speaker": name1,
            "avatar": p1["avatar"],
            "text": f"Here is the tough question: when work becomes overwhelming or life throws unexpected chaos your way, do you tend to retreat inward, or do you lean into the people around you?",
            "innerThought": "Testing self-awareness around coping mechanisms during extreme stress.",
            "sentiment": 0.79,
            "discovered": "Navigating stress styles and personal boundaries"
        },
        {
            "round": 3,
            "title": "Dealbreakers & Handling Pressure",
            "speaker": name2,
            "avatar": p2["avatar"],
            "text": f"I need an hour of solo reflection to process thoughts, and then I want to talk it through openly over dinner. As long as my partner gives me that brief breathing room, I always return with complete presence.",
            "innerThought": "Clear communication of boundaries without passive-aggressive withdrawal. That shows maturity.",
            "sentiment": 0.91,
            "discovered": "Healthy boundary negotiation"
        },
        # Round 4: Closing Verdict
        {
            "round": 4,
            "title": "Final Impression & Decision",
            "speaker": name1,
            "avatar": p1["avatar"],
            "text": f"I loved this conversation, {name2}. You have a rare blend of ambition and warmth. My agent is voting for a real dinner date without question.",
            "innerThought": "Unanimous vote for a second date. The connection is unforced.",
            "sentiment": 0.96,
            "discovered": "Definite second date agreement"
        },
        {
            "round": 4,
            "title": "Final Impression & Decision",
            "speaker": name2,
            "avatar": p2["avatar"],
            "text": f"Same here, {name1}. The chemistry was natural and we share the same core outlook. Let's make it happen.",
            "innerThought": "Mutual spark confirmed. 10/10.",
            "sentiment": 0.98,
            "discovered": "Mutual high-confidence match"
        }
    ]
    
    return {
        "p1_id": p1["id"],
        "p2_id": p2["id"],
        "p1_name": p1["name"],
        "p2_name": p2["name"],
        "overall_score": compat["overall"],
        "verdict": compat["verdict"],
        "turns": turns
    }

def main():
    data_dir = Path("/Users/sanjaywaradkar/the-agentic-ai-engineer/src/data")
    with open(data_dir / "profiles.json", "r", encoding="utf-8") as f:
        profiles = json.load(f)
        
    matrix = {}
    pair_dialogues = {}
    
    # Calculate pairwise matrix
    for i in range(len(profiles)):
        p1 = profiles[i]
        matrix[p1["id"]] = {}
        for j in range(len(profiles)):
            p2 = profiles[j]
            if i == j:
                matrix[p1["id"]][p2["id"]] = {
                    "overall": 100,
                    "breakdown": {"intellectual": 100, "values": 100, "lifestyle": 100, "banter": 100},
                    "verdict": "Self Reflection",
                    "diagnostic": "Identity anchor."
                }
            else:
                compat = compute_compatibility(p1, p2)
                matrix[p1["id"]][p2["id"]] = compat
                
    # Generate interactive dialogues for notable pairs
    key_pairs = [
        ("andrej-karpathy", "mira-murati"),
        ("brian-chesky", "aashish-thakuri"),
        ("lex-fridman", "daniela-amodei"),
        ("george-hotz", "justine-tunney"),
        ("mani-reddy", "cassidy-williams"),
        ("guillermo-rauch", "paco-coursey"),
        ("sam-altman", "sarah-guo"),
        ("swyx-wang", "allie-miller"),
        ("theprimeagen", "george-hotz"),
        ("fei-fei-li", "pieter-abbeel")
    ]
    
    id_map = {p["id"]: p for p in profiles}
    for id1, id2 in key_pairs:
        if id1 in id_map and id2 in id_map:
            p1 = id_map[id1]
            p2 = id_map[id2]
            compat = matrix[id1][id2]
            key = f"{id1}__{id2}"
            pair_dialogues[key] = generate_sample_dialogue(p1, p2, compat)
            # Add reverse key for bidirectional lookup
            rev_key = f"{id2}__{id1}"
            pair_dialogues[rev_key] = generate_sample_dialogue(p2, p1, compat)
            
    # Compute Mutual Sparks (reciprocally ranked in each other's top 3)
    ranked_for = {}
    for p1 in profiles:
        matches = []
        for p2 in profiles:
            if p1["id"] != p2["id"]:
                matches.append((p2["id"], matrix[p1["id"]][p2["id"]]["overall"]))
        matches.sort(key=lambda x: x[1], reverse=True)
        ranked_for[p1["id"]] = [m[0] for m in matches[:3]]

    mutual_sparks = []
    seen_pairs = set()
    for p1_id, top_for_p1 in ranked_for.items():
        for p2_id in top_for_p1:
            if p1_id in ranked_for.get(p2_id, []):
                pair_key = tuple(sorted([p1_id, p2_id]))
                if pair_key not in seen_pairs:
                    seen_pairs.add(pair_key)
                    p1_obj = id_map[pair_key[0]]
                    p2_obj = id_map[pair_key[1]]
                    compat = matrix[pair_key[0]][pair_key[1]]
                    mutual_sparks.append({
                        "p1": p1_obj,
                        "p2": p2_obj,
                        "score": compat["overall"],
                        "verdict": "Mutual Spark Ignite",
                        "diagnostic": f"Reciprocal top-tier match. Both {p1_obj['name'].split()[0]} and {p2_obj['name'].split()[0]} independently ranked each other in their top 3 preferences."
                    })

    mutual_sparks.sort(key=lambda x: x["score"], reverse=True)
    print(f"Discovered {len(mutual_sparks)} reciprocal Mutual Sparks across candidates!")

    payload = {
        "matrix": matrix,
        "sample_dialogues": pair_dialogues,
        "mutual_sparks": mutual_sparks
    }
    
    out_path = data_dir / "compatibility_matrix.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully generated compatibility matrix, sample dialogues, and mutual sparks to {out_path}")

if __name__ == "__main__":
    main()
