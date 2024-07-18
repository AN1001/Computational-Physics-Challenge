import { useRef, useCallback } from "react";

const useThrottle = (callback: Function, delay: number) => {
  const lastCall = useRef<number>(0);

  return useCallback(
    (...args: any[]) => {
      const now = new Date().getTime();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  );
};

export default useThrottle;
