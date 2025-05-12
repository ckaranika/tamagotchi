import { Animal } from "../models/animal";
import { STORAGE_KEY } from "../setup";

export const saveAnimalsToStorage = (animals: Animal[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(animals));
    return true;
  } catch {
    return false;
  }
};

export const loadAnimalsFromStorage = (): Animal[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};
