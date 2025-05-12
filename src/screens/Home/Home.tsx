import { CSSProperties, useEffect, useState } from "react";
import { AnimalCard } from "../../components/AnimalCard";
import { Animal, feedAnimal, playWithAnimal, restAnimal, updateAnimalStats } from "../../models/animal";
import { loadAnimalsFromStorage, saveAnimalsToStorage } from "../../utils/localStorage";
import { AddAnimalModal } from "../../components/AddAnimalModal";
import { Paginator } from "../../components/Paginator";
import { TICK_INTERVAL_MS } from "../../setup";

const Home = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentAnimal = animals[selectedIndex];
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load saved animals from local storage
  useEffect(() => {
    const storedAnimals = loadAnimalsFromStorage();
    if (storedAnimals.length > 0) {
      setAnimals(storedAnimals);
    }
  }, []);

  // Save animals to local storage whenever they change
  useEffect(() => {
    if (animals.length > 0) {
      const success = saveAnimalsToStorage(animals);
      if (!success) {
        const confirmReload = window.confirm(
          "Something went wrong while saving your animal.\n\nReload the page to fix this?"
        );
        if (confirmReload) {
          window.location.reload();
        }
      }
    }
  }, [animals]);


  // Update animal stats at regular intervals
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimals((prev) => prev.map(updateAnimalStats));
    }, TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < animals.length - 1) {
      setSelectedIndex((prev) => prev + 1);
    }
  };

  const updateCurrentAnimal = (updateFn: (animal: Animal) => Animal) => {
    setAnimals((prev) =>
      prev.map((animal, index) =>
        index === selectedIndex
          ? updateFn(animal)  // select new
          : animal            // keep the same
      )
    );
  };

  const handleFeed = () => updateCurrentAnimal(feedAnimal);
  const handlePlay = () => updateCurrentAnimal(playWithAnimal);
  const handleRest = () => updateCurrentAnimal(restAnimal);

  return (
    <div className="animal-page">
      {currentAnimal ? (<>
        <button style={styles.button} onClick={() => setIsModalOpen(true)}>Add Animal</button>
        <div className="animal-wrapper">
          <AnimalCard
            animal={currentAnimal}
            onFeed={handleFeed}
            onPlay={handlePlay}
            onRest={handleRest}
          />
          <Paginator
            currentIndex={selectedIndex}
            total={animals.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      </>
      ) : (
        <div style={styles.noAnimalsContainer}>
          <button style={styles.button} onClick={() => setIsModalOpen(true)}>
            Add Animal
          </button>
        </div>
      )}

      {isModalOpen &&
        <AddAnimalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={(animal) => {
            setAnimals((prev) => {
              const updated = [...prev, animal];
              setSelectedIndex(updated.length - 1);
              return updated;
            });
          }}
        />
      }
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  noAnimalsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  button: {
    margin: "20px"
  },
};

export default Home;
