#!/usr/bin/env python3
"""
Automated Test Suite for The Agentic AI Engineer Dating Simulation.
Tests data integrity, profile uniqueness, compatibility boundaries, and dialogue state.
"""

import unittest
import json
from pathlib import Path

class TestAgenticDatingEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        data_dir = Path("/Users/sanjaywaradkar/the-agentic-ai-engineer/src/data")
        with open(data_dir / "profiles.json", "r", encoding="utf-8") as f:
            cls.profiles = json.load(f)
        with open(data_dir / "personas.json", "r", encoding="utf-8") as f:
            cls.personas = json.load(f)
        with open(data_dir / "compatibility_matrix.json", "r", encoding="utf-8") as f:
            cls.matrix_data = json.load(f)

    def test_01_profile_count(self):
        """Must contain exactly 25 real individuals."""
        self.assertEqual(len(self.profiles), 25, "Must have exactly 25 profiles.")

    def test_02_verified_linkedin_links(self):
        """Every profile must have a valid LinkedIn URL."""
        for p in self.profiles:
            self.assertTrue(p["linkedin"].startswith("https://www.linkedin.com/in/"), f"Invalid LinkedIn: {p['name']}")

    def test_03_verified_instagram_links(self):
        """Every profile must have a valid Instagram URL and handle."""
        for p in self.profiles:
            self.assertTrue(p["instagram"].startswith("https://www.instagram.com/"), f"Invalid Instagram: {p['name']}")
            self.assertTrue(p["handle_ig"].startswith("@"), f"Invalid Instagram handle: {p['name']}")

    def test_04_big_five_vectors(self):
        """All Big Five trait scores must be bounded between 0 and 100."""
        traits = ["openness", "conscientiousness", "extraversion", "agreeableness", "stability"]
        for p in self.profiles:
            for t in traits:
                score = p["traits"].get(t)
                self.assertIsNotNone(score, f"Missing trait {t} in {p['name']}")
                self.assertTrue(0 <= score <= 100, f"Trait out of bounds: {t} in {p['name']}")

    def test_05_values_and_dealbreakers(self):
        """Every persona must specify at least 2 values and 1 dealbreaker."""
        for p in self.profiles:
            self.assertGreaterEqual(len(p["values"]), 2, f"Too few values: {p['name']}")
            self.assertGreaterEqual(len(p["dealbreakers"]), 1, f"Missing dealbreakers: {p['name']}")

    def test_06_founder_inclusion(self):
        """Must feature Mani Reddy (Founder of The Agentic AI Engineer)."""
        founder = next((p for p in self.profiles if p["id"] == "mani-reddy"), None)
        self.assertIsNotNone(founder, "Founder Mani Reddy must be present in profiles.")
        self.assertIn("Mani", founder["name"])
        self.assertIn("Reddy", founder["name"])

    def test_07_pairwise_matrix_completeness(self):
        """Pairwise matrix must cover all 25 x 25 = 625 entries."""
        matrix = self.matrix_data["matrix"]
        self.assertEqual(len(matrix), 25)
        for p1_id, row in matrix.items():
            self.assertEqual(len(row), 25, f"Incomplete row for {p1_id}")

    def test_08_score_bounds(self):
        """All compatibility scores must be between 50 and 100."""
        matrix = self.matrix_data["matrix"]
        for p1_id, row in matrix.items():
            for p2_id, data in row.items():
                score = data["overall"]
                self.assertTrue(50 <= score <= 100, f"Score out of range: {p1_id} x {p2_id} = {score}")

    def test_09_sample_dialogue_validity(self):
        """Sample dialogues must have 4 rounds with both participants."""
        samples = self.matrix_data["sample_dialogues"]
        self.assertGreater(len(samples), 0)
        for key, d in samples.items():
            self.assertEqual(len(d["turns"]), 8, f"Dialogue must have 8 turns (2 per round): {key}")

if __name__ == "__main__":
    unittest.main()
