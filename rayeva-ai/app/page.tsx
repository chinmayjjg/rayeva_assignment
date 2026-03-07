export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-2">🌿 Rayeva AI</h1>
        <p className="text-gray-500 text-lg">
          AI-powered modules for sustainable commerce
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Module 1: Auto-Categorization
          </span>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Module 3: Impact Reporting
          </span>
        </div>
        <p className="mt-6 text-gray-400 text-sm">Step 1 complete — scaffold ready ✅</p>
      </div>
    </main>
  );
}