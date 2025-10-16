// components/Counter.tsx
"use client";

import { useState, useEffect } from "react";

interface CounterProps {
  target: number;
}

const Counter: React.FC<CounterProps> = ({ target }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setCount(current);
      if (current === target) {
        clearInterval(interval);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [target]);

  return <div>{count}</div>;
};

export default Counter;
