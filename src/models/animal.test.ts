import {
  createAnimal,
  updateAnimalStats,
  feedAnimal,
  restAnimal,
  playWithAnimal,
} from "./animal";

const makeAnimal = (overrides = {}) =>
  createAnimal({
    name: "AnimalName",
    type: "Fox",
    emoji: "🦊",
    hungerRate: 2,
    sleepinessRate: 2,
    happinessDecay: 2,
    ...overrides
  });

describe("Animal Model", () => {
  it("Users should be able to name animals", () => {
    const animal = makeAnimal({ name: "AnimalName1" });
    expect(animal.name).toBe("AnimalName1");
  });

  it("Users should be able to have multiple animals of different types", () => {
    const animal1 = makeAnimal({ type: "Cat", emoji: "🐱" });
    const animal2 = makeAnimal({ type: "Fox", emoji: "🦊" });
    expect(animal1.id).not.toBe(animal2.id);
    expect(animal1.type).not.toBe(animal2.type);
  });

  it("Playing with animals makes them happy", () => {
    const animal = { ...makeAnimal(), happiness: 80 };
    const hasPlayed = playWithAnimal(animal);
    expect(hasPlayed.happiness).toBeGreaterThan(animal.happiness);
  });

  it("Feeding animals makes them less hungry", () => {
    const animal = { ...makeAnimal(), hunger: 40 };
    const fedAnimal = feedAnimal(animal);
    expect(fedAnimal.hunger).toBeLessThan(animal.hunger);
    expect(fedAnimal.hunger).toBeGreaterThanOrEqual(0);
  });

  it("Resting animals makes them less sleepy", () => {
    const animal = { ...makeAnimal(), sleepiness: 40 };
    const hasRested = restAnimal(animal);
    expect(hasRested.sleepiness).toBeLessThan(animal.sleepiness);
    expect(hasRested.sleepiness).toBeGreaterThanOrEqual(0);
  });

  it("Animals start \"neutral\" on all metrics", () => {
    const animal = makeAnimal();
    expect(animal.hunger).toBe(0);
    expect(animal.sleepiness).toBe(0);
    expect(animal.happiness).toBe(100);
  });

  it("Happiness should decrease over time", () => {
    const animal = makeAnimal();
    const postUpdate = updateAnimalStats(animal);
    expect(postUpdate.happiness).toBeLessThan(animal.happiness);
  });

  it("Hunger should increase over time", () => {
    const animal = makeAnimal();
    const postUpdate = updateAnimalStats(animal);
    expect(postUpdate.hunger).toBe(animal.hunger + animal.hungerRate);
  });

  it("Sleepiness should increase over time", () => {
    const animal = makeAnimal();
    const postUpdate = updateAnimalStats(animal);
    expect(postUpdate.sleepiness).toBe(animal.sleepiness + animal.sleepinessRate);
  });

  it("Happiness should decrease faster when sleep or hunger is full", () => {
    const normal = makeAnimal();
    const hungry = { ...makeAnimal(), hunger: 100 };
    const sleepy = { ...makeAnimal(), sleepiness: 100 };

    const updatedNormal = updateAnimalStats(normal);
    const updatedHungry = updateAnimalStats(hungry);
    const updatedSleepy = updateAnimalStats(sleepy);

    expect(updatedHungry.happiness).toBeLessThan(updatedNormal.happiness);
    expect(updatedSleepy.happiness).toBeLessThan(updatedNormal.happiness);
  });

  it("Each animal type should have metrics which increase/decrease at different rates", () => {
    const slow = makeAnimal({ hungerRate: 1 });
    const fast = makeAnimal({ hungerRate: 5 });

    const updatedSlow = updateAnimalStats(slow);
    const updatedFast = updateAnimalStats(fast);

    expect(updatedFast.hunger - fast.hunger).toBeGreaterThan(
      updatedSlow.hunger - slow.hunger
    );
  });
});
