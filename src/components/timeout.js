import { useRef, useEffect } from 'react';

const useTimeout = (callback, delay) => {
  const timeoutRef = useRef();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof delay === 'number') {
      timeoutRef.current = setTimeout(() => callbackRef.current(), delay);

      return () => clearTimeout(timeoutRef.current);
    }
  }, [delay]);

  return timeoutRef;
}

export default useTimeout;
