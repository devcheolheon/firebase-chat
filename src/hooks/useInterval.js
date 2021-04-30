import { useRef, useEffect, useState } from "react";

function useInterval(timeDiff) {
  const interval = useRef();
  const [intervalFunc, setIntervalFunc] = useState(null);

  useEffect(() => {
    if (intervalFunc) {
      interval.current = setInterval(
        () => intervalFunc.forEach((v) => v()),
        timeDiff
      );
    }
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [timeDiff, intervalFunc]);

  function setIntervals(funcs) {
    if (!intervalFunc) setIntervalFunc([...funcs]);
  }

  return [setIntervals];
}

export default useInterval;
