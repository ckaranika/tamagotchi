import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AnimalCard from "./AnimalCard";
import { Animal } from "../../models/animal";

const mockAnimal: Animal = {
  id: "1",
  name: "AnimalName",
  type: "Poodle",
  emoji: "🐩",
  hunger: 40,
  sleepiness: 30,
  happiness: 80,
  hungerRate: 2,
  sleepinessRate: 3,
  happinessDecay: 1,
  createdAt: Date.now(),
};

describe("AnimalCard", () => {
  it("renders animal name and type", () => {
    render(
      <AnimalCard animal={mockAnimal} onFeed={() => {}} onPlay={() => {}} onRest={() => {}} />
    );

    expect(screen.getByText("AnimalName")).toBeInTheDocument();
    expect(screen.getByText("Poodle")).toBeInTheDocument();
  });

  it("renders an image when imageUrl is provided", () => {
    const imageUrl = "src/assets/poodle.svg";

    render(
      <AnimalCard
        animal={{ ...mockAnimal, imageUrl }}
        onFeed={() => {}}
        onPlay={() => {}}
        onRest={() => {}}
      />
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", imageUrl);
    expect(img).toHaveAttribute("alt", "AnimalName");
  });

  it("renders an emoji when one has been selected instead of a given image", () => {
    render(
      <AnimalCard
        animal={{ ...mockAnimal, imageUrl: undefined }}
        onFeed={() => {}}
        onPlay={() => {}}
        onRest={() => {}}
      />
    );

    expect(screen.getByText("🐩")).toBeInTheDocument();
  });


  it("clicking each button calls the correct function", () => {
    const onFeed = jest.fn();
    const onPlay = jest.fn();
    const onRest = jest.fn();

    render(
      <AnimalCard animal={mockAnimal} onFeed={onFeed} onPlay={onPlay} onRest={onRest} />
    );

    fireEvent.click(screen.getByText("Feed"));
    fireEvent.click(screen.getByText("Play"));
    fireEvent.click(screen.getByText("Rest"));

    expect(onFeed).toHaveBeenCalledTimes(1);
    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onRest).toHaveBeenCalledTimes(1);
  });
});
