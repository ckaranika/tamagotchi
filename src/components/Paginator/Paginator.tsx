import React from "react";
import { CSSProperties } from "react";

interface PaginatorProps {
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}

const Paginator: React.FC<PaginatorProps> = ({
  currentIndex,
  total,
  onPrevious,
  onNext,
}) => {
  if (total <= 1) return null;
  return (
    <div style={styles.paginator}>
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        aria-label="Previous"
        style={styles.button}
      >
        &#10094; Previous
      </button>

      <span>{currentIndex + 1} of {total}</span>

      <button
        onClick={onNext}
        disabled={currentIndex >= total - 1}
        aria-label="Next"
        style={styles.button}
      >
        Next &#10095;
      </button>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  paginator: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
  },
  button: {
    minWidth: "100px",
  }
};

export default Paginator;
