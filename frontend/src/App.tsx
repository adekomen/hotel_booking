import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Vite + React + TailwindCSS</h1>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </div>
      <p className="mt-4 text-sm">
        Edit <code className="bg-gray-200 px-1 rounded">src/App.tsx</code> and
        save to test HMR
      </p>
    </div>
  );
}

export default App;
