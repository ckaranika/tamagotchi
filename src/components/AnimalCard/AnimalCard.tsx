import { CSSProperties } from "react";
import { Animal } from "../../models/animal";

interface AnimalCardProps {
  animal: Animal;
  onFeed: () => void;
  onPlay: () => void;
  onRest: () => void;
}

const AnimalCard = ({ animal, onFeed, onPlay, onRest }: AnimalCardProps) => {
  const renderStat = (
    label: string,
    value: number,
    onAction: () => void,
    actionLabel: string
  ) => (
    <div style={styles.stat}>
      <strong>{label}:</strong>
      <div style={{
        ...styles.meter,
        boxShadow:
          label === "Happiness" && value === 0
            ? "0 0 2px 1px #f44336 inset"
            : "none"
      }}>
        <div
          data-testid={`${label.toLowerCase()}-bar`}
          style={{
            ...styles.meterFill,
            width: `${value}%`,
            backgroundColor:
              (label === "Hunger" && value === 100) ||
              (label === "Sleep" && value === 100)
                ? "#f44336" : styles.meterFill.backgroundColor
          }}
        />
      </div>
      <button style={styles.actionButton} onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  );

  return (
    <div style={styles.animalContainer}>
      <h1>{animal.type}</h1>

      <div style={styles.animalAnimal}>
        {animal.imageUrl ? (
          <img src={animal.imageUrl} alt={animal.name} style={styles.animalImage} />
        ) : (
          <div style={{ fontSize: 64 }}>{animal.emoji}</div>
        )}

        <h2>{animal.name}</h2>
      </div>

      {/* Stat meters and buttons */}
      <div style={styles.animalStats}>
        {renderStat("Hunger", animal.hunger, onFeed, "Feed")}
        {renderStat("Happiness", animal.happiness, onPlay, "Play")}
        {renderStat("Sleep", animal.sleepiness, onRest, "Rest")}
      </div>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  animalContainer: {
    textAlign: "center",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    width: "350px",
    backgroundColor: "#f9f9f9",
    color: "#2196f3",
  },
  animalAnimal: {
    marginBottom: "20px",
  },
  animalImage: {
    borderRadius: "50%",
    width: "150px",
    height: "150px",
    objectFit: "cover",
  },
  animalStats: {
    marginTop: "20px",
    display: "flex",
  },
  stat: {
    marginBottom: "20px",
    padding: "10px",
    flex: 1,
  },
  meter: {
    marginTop: "10px",
    width: "100%",
    height: "20px",
    backgroundColor: "#e0e0e0",
    borderRadius: "10px",
    overflow: "hidden",
  },
  meterFill: {
    height: "100%",
    backgroundColor: "#4caf50",
    transition: "width 0.3s ease",
  },
  actionButton: {
    marginTop: "10px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#2196f3",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default AnimalCard;
