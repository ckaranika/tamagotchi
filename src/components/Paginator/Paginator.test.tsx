import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Paginator from "./Paginator";

describe("Paginator", () => {
  it("shows nothing if total is 1 or less", () => {
    const { container, rerender } = render(
      <Paginator currentIndex={0} total={1} onPrevious={() => {}} onNext={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();

    rerender(
      <Paginator currentIndex={0} total={0} onPrevious={() => {}} onNext={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows pagination correctly if total > 1", () => {
    render(
      <Paginator currentIndex={1} total={5} onPrevious={() => {}} onNext={() => {}} />
    );
    expect(screen.getByText("2 of 5")).toBeInTheDocument();
  });

  it("previous and next are clicked correctly", () => {
    const onPrevious = jest.fn();
    const onNext = jest.fn();

    render(
      <Paginator currentIndex={2} total={5} onPrevious={onPrevious} onNext={onNext} />
    );

    fireEvent.click(screen.getByText(/Previous/i));
    fireEvent.click(screen.getByText(/Next/i));

    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("previous and next for first and last item respectively are disabled correctly", () => {
    const { rerender } = render(
      <Paginator currentIndex={0} total={5} onPrevious={() => {}} onNext={() => {}} />
    );

    expect(screen.getByLabelText("Previous")).toBeDisabled();
    expect(screen.getByLabelText("Next")).not.toBeDisabled();

    rerender(
      <Paginator currentIndex={4} total={5} onPrevious={() => {}} onNext={() => {}} />
    );

    expect(screen.getByLabelText("Next")).toBeDisabled();
  });
});
