/**
 * Autonomous Dating Simulation Engine
 * Simulates multi-turn conversational dates between two extracted agent personas.
 */

export function buildDynamicDateSimulation(p1, p2, compatibility) {
  const name1 = p1.name.split(' ')[0];
  const name2 = p2.name.split(' ')[0];

  const turns = [
    // Round 1: Icebreaker & First Impression
    {
      round: 1,
      title: "Opening Impression & Context",
      speakerId: p1.id,
      speaker: name1,
      role: p1.role,
      avatar: p1.avatar,
      text: `Hello ${name2}. I was reviewing your public work and personal notes earlier. You have dedicated years to demanding frontiers, yet your posts reveal an appetite for quiet escapes. What does an unhurried morning look like for you when the world stops demanding your attention?`,
      sentiment: 0.86,
      delta: "+18%",
      topic: "Morning rhythms & personal decompression",
      status: "Engaging curiosity"
    },
    {
      round: 1,
      title: "Opening Impression & Context",
      speakerId: p2.id,
      speaker: name2,
      role: p2.role,
      avatar: p2.avatar,
      text: `It always begins with fresh coffee, open windows, and total stillness. No screens or notifications for at least two hours. I usually take a long walk or lose myself in an old volume of history. Once my thoughts settle, I enjoy building with my hands. How do you find balance after relentless sprints?`,
      sentiment: 0.90,
      delta: "+22%",
      topic: "Quiet solitude & manual craft",
      status: "Rhythm harmony"
    },

    // Round 2: Philosophy, Craft & Lifestyle
    {
      round: 2,
      title: "Core Philosophy & Daily Craft",
      speakerId: p1.id,
      speaker: name1,
      role: p1.role,
      avatar: p1.avatar,
      text: `For me, clarity comes from stripping away unnecessary noise and reasoning from first principles. If a concept cannot be explained cleanly, our understanding remains incomplete. In a partnership, I look for that same candor—unvarnished honesty without emotional games.`,
      sentiment: 0.94,
      delta: "+25%",
      topic: "First-principles honesty & emotional clarity",
      status: "Shared intellectual foundation"
    },
    {
      round: 2,
      title: "Core Philosophy & Daily Craft",
      speakerId: p2.id,
      speaker: name2,
      role: p2.role,
      avatar: p2.avatar,
      text: `I couldn't agree more. Pretense is exhausting. What moves me most is how someone carries themselves when the pressure mounts. Do they stay calm? Do they treat everyone with dignity? If those values are intact, everything else flows naturally.`,
      sentiment: 0.95,
      delta: "+20%",
      topic: "Dignity under pressure & mutual respect",
      status: "Value convergence"
    },

    // Round 3: The Boundary Check & Vulnerability
    {
      round: 3,
      title: "Boundary Check & Real-World Friction",
      speakerId: p1.id,
      speaker: name1,
      role: p1.role,
      avatar: p1.avatar,
      text: `Let me ask the uncomfortable question: when personal hardship strikes or work consumes your calendar, do you retreat into a fortress, or do you let your partner share the weight?`,
      sentiment: 0.82,
      delta: "+8%",
      topic: "Stress response & vulnerability tolerance",
      status: "Vulnerability probe"
    },
    {
      round: 3,
      title: "Boundary Check & Real-World Friction",
      speakerId: p2.id,
      speaker: name2,
      role: p2.role,
      avatar: p2.avatar,
      text: `I need a quiet hour of solo reflection to sort my thoughts, and then I place the cards on the table over dinner. Give me that initial breathing room, and I return with complete presence and dedication.`,
      sentiment: 0.93,
      delta: "+15%",
      topic: "Mature emotional regulation",
      status: "Mutual trust confirmed"
    },

    // Round 4: Final Verdict & Date Resolution
    {
      round: 4,
      title: "Final Impression & Decision",
      speakerId: p1.id,
      speaker: name1,
      role: p1.role,
      avatar: p1.avatar,
      text: `This conversation has been refreshing, ${name2}. You hold rare depth, clear boundaries, and an unhurried spirit. My agent is voting for an in-person dinner date without hesitation.`,
      sentiment: 0.98,
      delta: "+20%",
      topic: "Unanimous match approval",
      status: "Match sealed"
    },
    {
      round: 4,
      title: "Final Impression & Decision",
      speakerId: p2.id,
      speaker: name2,
      role: p2.role,
      avatar: p2.avatar,
      text: `Right back at you, ${name1}. Our conversational chemistry feels natural and unforced. Let's step away from the simulation and set a date.`,
      sentiment: 0.99,
      delta: "+20%",
      topic: "Mutual second date commitment",
      status: "Match sealed"
    }
  ];

  return {
    p1,
    p2,
    compatibility,
    turns
  };
}
