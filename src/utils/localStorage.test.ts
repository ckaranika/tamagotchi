import { loadAnimalsFromStorage, saveAnimalsToStorage } from "./localStorage";
import { Animal } from "../models/animal";

beforeEach(() => {
  localStorage.clear();
});

describe("local storage for animals", () => {
  it("is empty when nothing is stored", () => {
    const animals = loadAnimalsFromStorage();
    expect(animals).toEqual([]);
  });

  it("saves and loads animals correctly", () => {
    const mockAnimals: Animal[] = [
      {
        id: "1",
        name: "AnimalName1",
        type: "Cat",
        emoji: "🐱",
        hunger: 10,
        sleepiness: 20,
        happiness: 90,
        hungerRate: 1,
        sleepinessRate: 1,
        happinessDecay: 1,
        createdAt: Date.now(),
      },
    ];

    const success = saveAnimalsToStorage(mockAnimals);
    expect(success).toBe(true);

    const result = loadAnimalsFromStorage();
    expect(result).toEqual(mockAnimals);
  });

  it("false if saving fails", () => {
    const spy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage error");
    });

    const result = saveAnimalsToStorage([]);
    expect(result).toBe(false);

    spy.mockRestore();
  });
});
