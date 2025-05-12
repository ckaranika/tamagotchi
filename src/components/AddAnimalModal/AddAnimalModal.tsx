import { CSSProperties, useEffect, useState } from "react";
import { Animal, createAnimal } from "../../models/animal";
import { ANIMAL_TYPES, AnimalTypeOption, DEFAULT_ANIMAL_STATS, MAX_NAME_LENGTH } from "../../setup";

interface AddAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newAnimal: Animal) => void;
};

const initNewAnimal = () => {
  const defaultAnimal = ANIMAL_TYPES[0] as AnimalTypeOption & Partial<{ emoji: string; imageUrl: string }>;

  return  {
    name: "",
    type: defaultAnimal.type,
    emoji: defaultAnimal.emoji,
    imageUrl: defaultAnimal.imageUrl,
    ...DEFAULT_ANIMAL_STATS
  }};

const AddAnimalModal = ({ isOpen, onClose, onAdd }: AddAnimalModalProps) => {
  const [newAnimal, setNewAnimal] = useState(initNewAnimal());

  useEffect(() => {
    if (!isOpen) setNewAnimal(initNewAnimal());
  }, [isOpen]);

  const renderSlider = (
    id: string,
    label: string,
    value: number,
    onChange: (newValue: number) => void
  ) => (
    <div style={styles.formRow}>
      <label htmlFor={id} style={styles.formLabel}>
        {label}: {value}
      </label>
      <input
        style={styles.formRange}
        id={id}
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
    </div>
  );

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = ANIMAL_TYPES.find(p => p.type === e.target.value) ?? ANIMAL_TYPES[0];
    setNewAnimal(prev => ({
      ...prev,
      type: selected.type,
      emoji: (selected as Partial<{emoji: string}>).emoji,
      imageUrl: (selected as Partial<{imageUrl: string}>).imageUrl,

    }));
  };


  const handleSubmit = () => {
    const trimmedName = newAnimal.name.trim();
    const animal = createAnimal({...newAnimal, name: trimmedName});
    onAdd(animal);
    onClose();
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>New Animal</h2>

        <div style={styles.emojiPreview}>
          {newAnimal.imageUrl ? (
            <img src={newAnimal.imageUrl} alt={newAnimal.type} style={{ width: 64, height: 64 }} />
          ) : (
            newAnimal.emoji
          )}
        </div>

        <div style={styles.formRow}>
          <label htmlFor="animal-name" style={styles.formLabel}>Name<sup>*</sup>:</label>
          <input
            autoFocus
            style={styles.formInput}
            type="text"
            id="animal-name"
            placeholder="e.g. Coco"
            value={newAnimal.name}
            maxLength={MAX_NAME_LENGTH}
            onChange={(e) => setNewAnimal({ ...newAnimal, name: e.target.value })}
          />
        </div>

        <div style={styles.formRow}>
          <label htmlFor="animal-type" style={styles.formLabel}>Type:</label>
          <select
            style={styles.formInput}
            id="animal-type"
            value={newAnimal.type}
            onChange={handleTypeChange}
          >
            {ANIMAL_TYPES.map(({ type }) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {renderSlider("hunger-rate", "Hunger Rate", newAnimal.hungerRate, (val) =>
          setNewAnimal({ ...newAnimal, hungerRate: val })
        )}

        {renderSlider("sleepiness-rate", "Sleepiness Rate", newAnimal.sleepinessRate, (val) =>
          setNewAnimal({ ...newAnimal, sleepinessRate: val })
        )}

        {renderSlider("happiness-decay", "Happiness Decay", newAnimal.happinessDecay, (val) =>
          setNewAnimal({ ...newAnimal, happinessDecay: val })
        )}

        <p style={{ fontSize: "12px"}}>
          Fields marked with * are required.
        </p>

        <div style={styles.modalButtons}>
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!newAnimal.name.trim()}
          >
            Create Animal
          </button>
        </div>
      </div>

    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: "0",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    padding: "16px",
    border: "none",
    borderRadius: "16px",
    background: "white",
    width: "90%",
    maxWidth: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 5px 30px rgba(0, 0, 0, 0.2)",
  },
  emojiPreview: {
    fontSize: "64px",
    margin: "8px auto 16px",
  },
  formRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  formLabel: {
    width: "120px",
    flexShrink: 0,
    fontWeight: "bold",
    fontSize: "15px",
  },
  formInput: {
    flex: 1,
    fontSize: "16px",
    padding: "5px",
  },
  formRange: {
    flex: 1,
    margin: 0,
  },
  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
    marginTop: "16px",
  },
};

export default AddAnimalModal;
