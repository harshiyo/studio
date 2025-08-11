"use client"
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: React.SetStateAction<T>) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setValue(JSON.parse(item));
        }
      } catch (error) {
        console.error("Error reading localStorage key “" + key + "”:", error);
      }
    }
  }, [isClient, key]);

  const updateValue = (newValue: React.SetStateAction<T>) => {
    if (!isClient) return;

    try {
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
        console.error("Error setting localStorage key “" + key + "”:", error);
    }
  }

  return [value, updateValue];
}
