import { useRef, useEffect, useCallback, MutableRefObject } from "react";

export const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  // We want to always return the same function instance so that it doesn't trigger a rerender
  // when passed into a dependencies array. useCallback will accomplish this as long as the
  // MutableRefObject isMounted is not passed in, since the containing object is different
  // on each render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(() => isMounted.current, []);
};

// provides previous value of given state
export const usePrevious = <T>(
  value: T
): [T | undefined, MutableRefObject<T | undefined>] => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return [ref.current, ref];
};
