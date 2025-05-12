import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddAnimalModal from "./AddAnimalModal";
import { useState } from "react";

const AddAnimalModalWrapper = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button onClick={() => setIsOpen(false)}>Close Modal</button>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <AddAnimalModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAdd={() => {}}
      />
    </>
  );
};

describe("AddAnimalModal", () => {
  it("renders when open", () => {
    render(
      <AddAnimalModal isOpen={true} onClose={() => {}} onAdd={() => {}} />
    );

    expect(screen.getByText("New Animal")).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Type:")).toBeInTheDocument();
    expect(screen.getByLabelText(/Hunger Rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sleepiness Rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Happiness Decay/i)).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Create Animal")).toBeInTheDocument();
  });

  it("shows instructions about what is required", () => {
    render(<AddAnimalModal isOpen={true} onClose={() => {}} onAdd={() => {}} />);
    expect(screen.getByText(/fields marked with \*/i)).toBeInTheDocument();
  });

  it("can input name and select type", () => {
    render(
      <AddAnimalModal isOpen={true} onClose={() => {}} onAdd={() => {}} />
    );

    const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "AnimalName" } });
    expect(nameInput.value).toBe("AnimalName");

    const select = screen.getByLabelText("Type:") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "Cat" } });
    expect(select.value).toBe("Cat");
  });

  it("can set hunger, sleepiness, happiness", () => {
    render(<AddAnimalModal isOpen={true} onClose={() => {}} onAdd={() => {}} />);

    const hungerSlider = screen.getByLabelText(/Hunger Rate: 1/i) as HTMLInputElement;
    fireEvent.change(hungerSlider, { target: { value: "5" } });
    expect(screen.getByLabelText(/Hunger Rate: 5/i)).toBeInTheDocument();
    expect(hungerSlider.value).toBe("5");

    const sleepinessSlider = screen.getByLabelText(/Sleepiness Rate: 1/i) as HTMLInputElement;
    fireEvent.change(sleepinessSlider, { target: { value: "7" } });
    expect(screen.getByLabelText(/Sleepiness Rate: 7/i)).toBeInTheDocument();
    expect(sleepinessSlider.value).toBe("7");

    const happinessSlider = screen.getByLabelText(/Happiness Decay: 1/i) as HTMLInputElement;
    fireEvent.change(happinessSlider, { target: { value: "2" } });
    expect(screen.getByLabelText(/Happiness Decay: 2/i)).toBeInTheDocument();
    expect(happinessSlider.value).toBe("2");
  });


  it("cannot create an animal without a name", () => {
    render(<AddAnimalModal isOpen={true} onClose={() => {}} onAdd={() => {}} />);
    const button = screen.getByText("Create Animal") as HTMLButtonElement;
    expect(button).toBeDisabled();
  });

  it("can create an animal when the user enters a valid name", () => {
    render(<AddAnimalModal isOpen={true} onClose={() => {}} onAdd={() => {}} />);
    const nameInput = screen.getByLabelText(/Name/i);
    const button = screen.getByText("Create Animal") as HTMLButtonElement;

    fireEvent.change(nameInput, { target: { value: "AnimalName" } });
    expect(button).not.toBeDisabled();
  });

  it("submits a new animal when name is provided", () => {
    const onAdd = jest.fn();
    const onClose = jest.fn();

    render(<AddAnimalModal isOpen={true} onClose={onClose} onAdd={onAdd} />);

    const nameInput = screen.getByLabelText(/Name/i);
    const submitButton = screen.getByText("Create Animal");

    fireEvent.change(nameInput, { target: { value: "AnimalName" } });
    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd.mock.calls[0][0].name).toBe("AnimalName");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("can cancel adding a new animal", () => {
    const onClose = jest.fn();

    render(
      <AddAnimalModal isOpen={true} onClose={onClose} onAdd={() => {}} />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("resets form when modal is closed", () => {
    render(<AddAnimalModalWrapper />);

    const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "AnimalName" } });
    expect(nameInput.value).toBe("AnimalName");

    // Close the modal
    fireEvent.click(screen.getByText("Close Modal"));

    // Reopen the modal
    fireEvent.click(screen.getByText("Open Modal"));
    const resetInput = screen.getByLabelText(/Name/i) as HTMLInputElement;
    expect(resetInput.value).toBe("");
  });

});
