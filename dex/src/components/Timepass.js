import React, { useState, useEffect } from 'react';

function Timepass() {
  const [count, setCount] = useState(0);
  const [resetCount, setResetCount] = useState(false);

  useEffect(() => {
    console.log('useEffect called');

    // Simulating an asynchronous operation
    const timer = setTimeout(() => {
      console.log('Async operation completed');
    }, 2000);

    return () => {
      clearTimeout(timer);
      console.log('Clean up');
    };
  }, [count, resetCount]);

  const increment = () => {
    setCount(count + 1);
  };

  const reset = () => {
    setResetCount(!resetCount);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export default Timepass;