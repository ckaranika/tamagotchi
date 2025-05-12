export const STORAGE_KEY = "tamagotchi";

export const ANIMAL_TYPES = [
  { type: "Poodle", imageUrl: "/src/assets/poodle.svg" },
  { type: "Cat", emoji: "🐱" },
  { type: "Rabbit", emoji: "🐰" },
  { type: "Hamster", emoji: "🐹" },
  { type: "Turtle", emoji: "🐢" },
  { type: "Panda", emoji: "🐼" },
  { type: "Pig", emoji: "🐷" },
  { type: "Fox", emoji: "🦊" },
  { type: "Dog", emoji: "🐶" },
  { type: "Koala", emoji: "🐨" },
  { type: "Penguin", emoji: "🐧" },
  { type: "Chick", emoji: "🐤" }
] as const;

export type AnimalTypeOption =
  | { type: string; emoji: string }
  | { type: string; imageUrl: string };

export const MAX_NAME_LENGTH = 25;

export const DEFAULT_ANIMAL_STATS = {
  hungerRate: 1,
  sleepinessRate: 1,
  happinessDecay: 1,
};

export const TICK_INTERVAL_MS = 5 /* seconds */ * 1000;