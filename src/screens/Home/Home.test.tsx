import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./Home";
import { TICK_INTERVAL_MS } from "../../setup";

const locationReload = window.location.reload;
beforeAll(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...window.location, reload: jest.fn() }
  });
});
afterAll(() => {
  window.location.reload = locationReload;
});

beforeEach(() => {
  localStorage.clear();
});

describe("Home", () => {
  it("renders only the 'Add Animal' button when no animals exist", () => {
    const { container } = render(<Home />);

    const button = screen.getByText("Add Animal");
    expect(button).toBeInTheDocument();

    // The page shows only the "Add Animal" button
    expect(container.querySelectorAll("button").length).toBe(1);
    expect(container.querySelectorAll("*").length).toBeLessThanOrEqual(3);
  });

  it("renders correctly when there are saved animals", () => {
    const animal = {
      id: "123",
      name: "Mrs Mary",
      type: "Fox",
      emoji: "🦊",
      hunger: 10,
      sleepiness: 5,
      happiness: 100,
      hungerRate: 1,
      sleepinessRate: 1,
      happinessDecay: 1,
      createdAt: Date.now(),
    };
    localStorage.setItem("tamagotchi", JSON.stringify([animal]));
    render(<Home />);
    expect(screen.getByText("Mrs Mary")).toBeInTheDocument();
  });

  it("can create an animal", () => {
    render(<Home />);

    fireEvent.click(screen.getByText("Add Animal"));
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "AnimalName" } });
    fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: "Cat" } });
    fireEvent.click(screen.getByText("Create Animal"));

    expect(screen.getByText("AnimalName")).toBeInTheDocument();
    expect(screen.getByText("Cat")).toBeInTheDocument();
  });

  it("can create multiple animals and paginate correctly", () => {
    render(<Home />);

    fireEvent.click(screen.getByText("Add Animal"));
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "AnimalName1" } });
    fireEvent.click(screen.getByText("Create Animal"));

    fireEvent.click(screen.getByText("Add Animal"));
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "AnimalName2" } });
    fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: "Fox" } });
    fireEvent.click(screen.getByText("Create Animal"));

    // Should be showing the second animal
    expect(screen.getByText("2 of 2")).toBeInTheDocument();
    expect(screen.getByText("AnimalName2")).toBeInTheDocument();

    // Go back to first animal
    fireEvent.click(screen.getByLabelText("Previous"));
    expect(screen.getByText("1 of 2")).toBeInTheDocument();
    expect(screen.getByText("AnimalName1")).toBeInTheDocument();

    // Go to the next one
    fireEvent.click(screen.getByLabelText("Next"));
    expect(screen.getByText("2 of 2")).toBeInTheDocument();
    expect(screen.getByText("AnimalName2")).toBeInTheDocument();
  });

  it("shows confirm and reloads if saving animals fails", () => {
    const storageSpy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage error");
    });

    const confirmSpy = jest.spyOn(window, "confirm").mockImplementation(() => true);

    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...originalLocation,
        reload: jest.fn(),
      },
    });

    render(<Home />);
    fireEvent.click(screen.getByText("Add Animal"));
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "FailingAnimal" } });
    fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: "Dog" } });
    fireEvent.click(screen.getByText("Create Animal"));

    expect(confirmSpy).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();

    // Cleanup
    storageSpy.mockRestore();
    confirmSpy.mockRestore();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("can play with an animal and increase happiness", () => {
    jest.useFakeTimers();
    render(<Home />);

    fireEvent.click(screen.getByText("Add Animal"));
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "AnimalName1" } });
    fireEvent.click(screen.getByText("Create Animal"));

    // Reduce happiness from initial 100
    act(() => {jest.advanceTimersByTime(TICK_INTERVAL_MS)});

    const bar = screen.getByTestId("happiness-bar");
    const beforeWidth = parseFloat(getComputedStyle(bar).width);

    fireEvent.click(screen.getByText("Play"));

    const afterWidth = parseFloat(getComputedStyle(bar).width);
    expect(afterWidth).toBeGreaterThan(beforeWidth);
    jest.useRealTimers();
  });

  it("can feed an animal to reduce hunger", () => {
    jest.useFakeTimers();
    render(<Home />);

    fireEvent.click(screen.getByText("Add Animal"));
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "AnimalName1" } });
    fireEvent.click(screen.getByText("Create Animal"));

    act(() => {jest.advanceTimersByTime(TICK_INTERVAL_MS)});

    const bar = screen.getByTestId("hunger-bar");
    const before = parseFloat(getComputedStyle(bar).width);

    fireEvent.click(screen.getByText("Feed"));

    const after = parseFloat(getComputedStyle(bar).width);
    expect(after).toBeLessThan(before);

    jest.useRealTimers();
  });

  it("can rest an animal to reduce sleepiness", () => {
    jest.useFakeTimers();
    render(<Home />);

    fireEvent.click(screen.getByText("Add Animal"));
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "AnimalName1" } });
    fireEvent.click(screen.getByText("Create Animal"));

    act(() => {jest.advanceTimersByTime(TICK_INTERVAL_MS)});

    const bar = screen.getByTestId("sleep-bar");
    const before = parseFloat(getComputedStyle(bar).width);

    fireEvent.click(screen.getByText("Rest"));

    const after = parseFloat(getComputedStyle(bar).width);
    expect(after).toBeLessThan(before);

    jest.useRealTimers();
  });

  it("does not update non-selected animals", () => {
    jest.useFakeTimers();
    render(<Home />);

    // Add first animal
    fireEvent.click(screen.getByText("Add Animal"));
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "AnimalA" } });
    fireEvent.click(screen.getByText("Create Animal"));

    // Add second animal
    fireEvent.click(screen.getByText("Add Animal"));
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "AnimalB" } });
    fireEvent.click(screen.getByText("Create Animal"));

    act(() => {jest.advanceTimersByTime(TICK_INTERVAL_MS)});

    // Go back to AnimalA to check hunger
    fireEvent.click(screen.getByLabelText("Previous"));
    const hungerBefore = parseFloat(getComputedStyle(screen.getByTestId("hunger-bar")).width);

    // Go to AnimalB and feed it, should not change AnimalA
    fireEvent.click(screen.getByLabelText("Next"));
    fireEvent.click(screen.getByText("Feed"));

    // Go back to AnimalA and check hunger is the same
    fireEvent.click(screen.getByLabelText("Previous"));
    const hungerAfter = parseFloat(getComputedStyle(screen.getByTestId("hunger-bar")).width);

    expect(hungerAfter).toBeCloseTo(hungerBefore, 1);
    jest.useRealTimers();
  });

  it("cannot click previous while showing first animal", () => {
    render(<Home />);

    // Add two animals
    fireEvent.click(screen.getByText("Add Animal"));
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "AnimalA" } });
    fireEvent.click(screen.getByText("Create Animal"));

    fireEvent.click(screen.getByText("Add Animal"));
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "AnimalB" } });
    fireEvent.click(screen.getByText("Create Animal"));

    // Go to first animal
    fireEvent.click(screen.getByLabelText("Previous"));
    expect(screen.getByText("1 of 2")).toBeInTheDocument();

    // Try to go to previous (should not change)
    fireEvent.click(screen.getByLabelText("Previous"));
    expect(screen.getByText("1 of 2")).toBeInTheDocument();
  });

  it("cannot click next while showing last animal", () => {
    render(<Home />);

    fireEvent.click(screen.getByText("Add Animal"));
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "AnimalA" } });
    fireEvent.click(screen.getByText("Create Animal"));

    fireEvent.click(screen.getByText("Add Animal"));
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "AnimalB" } });
    fireEvent.click(screen.getByText("Create Animal"));

    // Already on last animal (AnimalB)
    expect(screen.getByText("2 of 2")).toBeInTheDocument();

    // Try going further (should not change)
    fireEvent.click(screen.getByLabelText("Next"));
    expect(screen.getByText("2 of 2")).toBeInTheDocument();
  });
});
