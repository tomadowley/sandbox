const PREFIXES = [
  "Captain", "Doctor", "Sir", "Lady", "Professor", "Chief", "Count", "Duchess", "Baron", "King", "Queen"
];
const ADJECTIVES = [
  "Fuzzy", "Spicy", "Galactic", "Neon", "Turbo", "Cosmic", "Mystic", "Wacky", "Crimson", "Quantum", "Blazing", "Electric"
];
const NOUNS = [
  "Sprocket", "Banana", "Stardust", "Raccoon", "Laser", "Thunder", "Pickle", "Dragon", "Marshmallow", "Cactus", "Noodle", "Pumpkin"
];

/**
 * Generates a crazy random name using injected RNG.
 * @param rng - A seeded random number generator function.
 */
export function getRandomName(rng: () => number): string {
  const prefix = PREFIXES[Math.floor(rng() * PREFIXES.length)];
  const adj = ADJECTIVES[Math.floor(rng() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(rng() * NOUNS.length)];
  const roll = rng();
  if (roll < 0.33) {
    return `${prefix} ${noun}`;
  } else if (roll < 0.66) {
    return `${adj} ${noun}`;
  } else {
    return `${prefix} ${adj} ${noun}`;
  }
}