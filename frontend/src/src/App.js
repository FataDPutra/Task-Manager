import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to React + Tailwind CSS
        </h1>
        <p className="text-gray-600 mb-6">
          Edit <code className="bg-gray-100 px-2 py-1 rounded">src/App.js</code> and save to reload.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;
