let nextId = 1;
const createId = () => (nextId++).toString();

export interface Animal {
    id: string;
    name: string;           // Animal name (e.g. Fluffy)
    type: string;           // Animal type (e.g. Poodle)
    emoji?: string;
    imageUrl?: string;
    hunger: number;         // 0 (full) to 100 (starving)
    sleepiness: number;     // 0 (rested) to 100 (exhausted)
    happiness: number;      // 0 (sad) to 100 (happy)
    hungerRate: number;     // 1–10, how fast it increases
    sleepinessRate: number; // 1–10, how fast it increases
    happinessDecay: number; // 1–10, how fast it increases
    createdAt: number;
}

export function createAnimal({
  name,
  type,
  emoji,
  imageUrl,
  hungerRate,
  sleepinessRate,
  happinessDecay,
}: {
    name: string;
    type: string;
    emoji?: string;
    imageUrl?: string;
    hungerRate: number;
    sleepinessRate: number;
    happinessDecay: number;
  }): Animal {
  return {
    id: createId(),
    name,
    type,
    emoji,
    imageUrl,
    hunger: 0,
    sleepiness: 0,
    happiness: 100,
    hungerRate,
    sleepinessRate,
    happinessDecay,
    createdAt: Date.now(),
  };
}

export function updateAnimalStats(animal: Animal): Animal {
  const isHungry = animal.hunger >= 100;
  const isTired = animal.sleepiness >= 100;
  const happinessPenalty = isHungry || isTired ? 2 : 1;

  return {
    ...animal,
    hunger: Math.min(100, animal.hunger + animal.hungerRate),
    sleepiness: Math.min(100, animal.sleepiness + animal.sleepinessRate),
    happiness: Math.max(0, animal.happiness - animal.happinessDecay * happinessPenalty),
  };
}

export function feedAnimal(animal: Animal): Animal {
  return {
    ...animal,
    hunger: Math.max(0, animal.hunger - 20),
  };
}

export function playWithAnimal(animal: Animal): Animal {
  return {
    ...animal,
    happiness: Math.min(100, animal.happiness + 20),
  };
}

export function restAnimal(animal: Animal): Animal {
  return {
    ...animal,
    sleepiness: Math.max(0, animal.sleepiness - 20),
  };
}