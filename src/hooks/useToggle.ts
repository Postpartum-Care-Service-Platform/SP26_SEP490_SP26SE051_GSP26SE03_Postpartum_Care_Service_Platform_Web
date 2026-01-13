import { useState, useCallback } from 'react';

/**
 * A custom hook to manage a boolean state.
 * @param {boolean} [initialState=false] - The initial state of the toggle.
 * @returns {[boolean, () => void, (value: boolean) => void]} - A tuple containing the current state, a function to toggle it, and a function to set it to a specific value.
 */
export const useToggle = (initialState: boolean = false): [boolean, () => void, (value: boolean) => void] => {
  const [state, setState] = useState<boolean>(initialState);

  // Function to toggle the state
  const toggle = useCallback(() => {
    setState((prevState) => !prevState);
  }, []);

  return [state, toggle, setState];
};
