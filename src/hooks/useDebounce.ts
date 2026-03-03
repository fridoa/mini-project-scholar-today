import { useRef } from "react";

const useDebounce = () => {
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  return (func: () => void, delay: number) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      func();
      debounceTimeout.current = null;
    }, delay);
  };
};

export default useDebounce;
