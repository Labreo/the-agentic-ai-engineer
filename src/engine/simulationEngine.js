/**
 * Autonomous Dating Simulation Engine
 * Synthesizes the best patterns from frontier agent dating architectures:
 * - 5 Atmospheric Venues (Subko Roastery, Aer Rooftop, Toit Garden, Marina Bay SkyBar, Olive Courtyard)
 * - 5 Progressive Conversation Stages
 * - Inner Monologue / Subconscious Thought Logs for each agent turn
 * - Dynamic Sentiment and Chemistry Tracking
 */

export const VENUES = [
  {
    id: "subko-roastery",
    name: "Subko Specialty Roastery",
    location: "Bandra West, Mumbai",
    vibe: "Single-origin pour-overs, indie books, rustic teakwood tables, cozy intellectual chemistry",
    backdrop: "linear-gradient(135deg, rgba(28,22,18,0.95), rgba(42,32,24,0.95))"
  },
  {
    id: "marina-skybar",
    name: "Marina Bay Sands SkyBar",
    location: "Marina Bay, Singapore",
    vibe: "Tropical skyline reflections, ambient house music, high-agency founder energy",
    backdrop: "linear-gradient(135deg, rgba(16,24,32,0.95), rgba(28,40,56,0.95))"
  },
  {
    id: "aer-rooftop",
    name: "Aer Rooftop Lounge",
    location: "Worli, Mumbai",
    vibe: "Sunset skyline over the Arabian Sea, soft jazz, coastal sea breeze",
    backdrop: "linear-gradient(135deg, rgba(20,20,35,0.95), rgba(40,25,60,0.95))"
  },
  {
    id: "toit-brewpub",
    name: "Toit Brewpub Garden",
    location: "Indiranagar, Bengaluru",
    vibe: "Lush hanging greenery, wood-fired sourdough pizzas, upbeat creative banter",
    backdrop: "linear-gradient(135deg, rgba(15,30,25,0.95), rgba(25,50,40,0.95))"
  },
  {
    id: "olive-courtyard",
    name: "Olive Bar & Kitchen",
    location: "Mehrauli, New Delhi",
    vibe: "Candlelit white pebbles under a giant banyan tree, acoustic guitar, artisanal pasta",
    backdrop: "linear-gradient(135deg, rgba(30,25,20,0.95), rgba(50,35,25,0.95))"
  }
];

export function buildDynamicDateSimulation(p1, p2, compatibility, venueId = "subko-roastery") {
  const venue = VENUES.find(v => v.id === venueId) || VENUES[0];
  const name1 = p1.name.split(' ')[0];
  const name2 = p2.name.split(' ')[0];

  const turns = [
    // Stage 1: Arrival & First Impressions
    {
      round: 1,
      stage: "Stage 1: Arrival & First Impressions",
      title: "Opening Chemistry & Atmosphere",
      speakerId: p1.id,
      speaker: name1,
      role: p1.role,
      avatar: p1.avatar,
      text: `Hello ${name2}. It is wonderful to meet you here at ${venue.name}. I was reviewing your public research and personal notes earlier. You spend so much time immersed in demanding frontiers, yet your posts reveal an appetite for quiet natural escapes. How did your morning begin today?`,
      innerThought: `I notice ${name2} arrived completely unhurried without checking their phone. That immediately signals presence and grounded focus.`,
      sentiment: 0.86,
      delta: "+15%",
      topic: "Morning stillness & unhurried arrival",
      status: "Engaging curiosity"
    },
    {
      round: 1,
      stage: "Stage 1: Arrival & First Impressions",
      title: "Opening Chemistry & Atmosphere",
      speakerId: p2.id,
      speaker: name2,
      role: p2.role,
      avatar: p2.avatar,
      text: `It began with freshly brewed coffee and total stillness—no screens for the first two hours. Then a long morning walk outside before diving into hands-on work. The ambient energy here at ${venue.name} feels wonderfully relaxed. How do you decompress after relentless sprints?`,
      innerThought: `They immediately asked about how I recharge rather than launching into a resume flex. That is a massive green flag.`,
      sentiment: 0.90,
      delta: "+18%",
      topic: "Quiet rituals & shared downtime",
      status: "Rhythm resonance"
    },

    // Stage 2: Lifestyle & Daily Routines
    {
      round: 2,
      stage: "Stage 2: Lifestyle & Daily Routines",
      title: "Weekend Rhythms & Personal Space",
      speakerId: p1.id,
      speaker: name1,
      role: p1.role,
      avatar: p1.avatar,
      text: `For me, weekends are sacred for creative autonomy. I love long stretches of uninterrupted deep focus on passion projects, interspersed with simple home cooking and outdoor endurance runs. What does a fulfilling Saturday look like when nothing is on your calendar?`,
      innerThought: `Checking whether our leisure rhythms clash. I need someone who values parallel play and independent hobbies without clinginess.`,
      sentiment: 0.92,
      delta: "+22%",
      topic: "Autonomy in shared space",
      status: "Lifestyle harmony"
    },
    {
      round: 2,
      stage: "Stage 2: Lifestyle & Daily Routines",
      title: "Weekend Rhythms & Personal Space",
      speakerId: p2.id,
      speaker: name2,
      role: p2.role,
      avatar: p2.avatar,
      text: `Very similar. I enjoy quiet mornings with books or manual craft, followed by wandering through indie bookstores or trail walks with close friends. Parallel solitude in a relationship—being in the same room reading quietly—is my absolute comfort zone.`,
      innerThought: `Parallel solitude! We are completely on the same wavelength regarding personal boundaries and quiet companionship.`,
      sentiment: 0.94,
      delta: "+24%",
      topic: "Parallel solitude & quiet comfort",
      status: "Deep comfort discovered"
    },

    // Stage 3: Ambition & Core Values
    {
      round: 3,
      stage: "Stage 3: Ambition & Core Values",
      title: "First Principles & Moral Compass",
      speakerId: p1.id,
      speaker: name1,
      role: p1.role,
      avatar: p1.avatar,
      text: `When it comes to our life work, I believe in reasoning from first principles and cutting through performative noise. If an idea cannot be defended with simple honesty, it is usually flawed. In a partner, I need that same intellectual integrity—zero games.`,
      innerThought: `Watching their eyes closely. If they default to corporate platitudes, the date ends here. But if they value raw truth, we have something rare.`,
      sentiment: 0.95,
      delta: "+20%",
      topic: "First-principles honesty",
      status: "Moral convergence"
    },
    {
      round: 3,
      stage: "Stage 3: Ambition & Core Values",
      title: "First Principles & Moral Compass",
      speakerId: p2.id,
      speaker: name2,
      role: p2.role,
      avatar: p2.avatar,
      text: `Completely agreed. Life is too fleeting for status games. What matters most to me is emotional resilience—how someone treats people when the stakes are high and plans collapse. Compassion under pressure is my ultimate non-negotiable.`,
      innerThought: `They value dignity and resilience over vanity metrics. That matches my foundational ethos down to the bone.`,
      sentiment: 0.96,
      delta: "+22%",
      topic: "Resilience under pressure & dignity",
      status: "Foundational alignment"
    },

    // Stage 4: Banter & Chemistry
    {
      round: 4,
      stage: "Stage 4: Banter & Chemistry",
      title: "Vulnerability & Boundary Testing",
      speakerId: p1.id,
      speaker: name1,
      role: p1.role,
      avatar: p1.avatar,
      text: `Let me ask the hard question: when work consumes your mental bandwidth or unforeseen chaos hits, do you retreat into a fortress, or do you let your partner share the load?`,
      innerThought: `This is the stress-test question. Every ambitious person has a coping mechanism; I want to see if they have self-awareness about theirs.`,
      sentiment: 0.85,
      delta: "+10%",
      topic: "Coping mechanisms & vulnerability",
      status: "Vulnerability probe"
    },
    {
      round: 4,
      stage: "Stage 4: Banter & Chemistry",
      title: "Vulnerability & Boundary Testing",
      speakerId: p2.id,
      speaker: name2,
      role: p2.role,
      avatar: p2.avatar,
      text: `I take an hour of solo reflection to sort my thoughts, and then I put every card on the table over dinner. Give me that initial breathing room, and I always return with complete transparency and dedication. How do you handle that balance?`,
      innerThought: `Clean communication of needs without passive-aggressive withdrawal. That is mature emotional regulation.`,
      sentiment: 0.95,
      delta: "+20%",
      topic: "Mature emotional regulation",
      status: "Trust solidified"
    },

    // Stage 5: Closing & Date Verdict
    {
      round: 5,
      stage: "Stage 5: Closing & Date Verdict",
      title: "Final Decision & Mutual Sparks",
      speakerId: p1.id,
      speaker: name1,
      role: p1.role,
      avatar: p1.avatar,
      text: `This has been one of the most refreshing conversations I have had in a very long time, ${name2}. You combine ambition with emotional grounding. My agent is voting for an in-person dinner date with zero hesitation.`,
      innerThought: `Unanimous green light. The chemistry is genuine, unforced, and intellectually exhilarating.`,
      sentiment: 0.98,
      delta: "+25%",
      topic: "Unanimous second date approval",
      status: "Mutual spark ignited"
    },
    {
      round: 5,
      stage: "Stage 5: Closing & Date Verdict",
      title: "Final Decision & Mutual Sparks",
      speakerId: p2.id,
      speaker: name2,
      role: p2.role,
      avatar: p2.avatar,
      text: `Right back at you, ${name1}. Our rhythms, values, and humor aligned effortlessly tonight. Let's step out of the agent simulation and plan that dinner.`,
      innerThought: `Mutual spark confirmed. This is a 10/10 connection.`,
      sentiment: 0.99,
      delta: "+25%",
      topic: "Mutual spark confirmed",
      status: "Match sealed"
    }
  ];

  return {
    venue,
    p1,
    p2,
    compatibility,
    turns
  };
}
