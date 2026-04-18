"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TRAITS = [
  ['Cautious', 'Bold'],
  ['Long-term', 'Short-term'],
  ['Data-driven', 'Intuitive'],
  ['Patient', 'Fast-moving'],
  ['Ethical', 'Contrarian']
];

export default function TraitsPage() {
  const [selections, setSelections] = useState<Record<number, string>>({});
  const router = useRouter();

  const handleSelect = (rowIndex: number, trait: string) => {
    setSelections(prev => ({ ...prev, [rowIndex]: trait }));
  };

  const isComplete = Object.keys(selections).length === 5;

  const handleContinue = () => {
    if (isComplete) {
      if (typeof window !== 'undefined') {
        const traitsArray = Array.from({ length: 5 }, (_, i) => selections[i]);
        localStorage.setItem('agent_traits', JSON.stringify(traitsArray));
      }
      router.push('/onboarding/name');
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">What kind of agent do you want to build?</h1>
        
        <div className="space-y-4 sm:space-y-6 mb-12">
          {TRAITS.map((pair, rowIndex) => (
            <div key={rowIndex} className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-center">
              <button 
                onClick={() => handleSelect(rowIndex, pair[0])}
                className={`flex-1 w-full sm:w-64 py-4 rounded-xl border-2 font-bold transition-all ${selections[rowIndex] === pair[0] ? 'bg-amber-500 border-amber-500 text-gray-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'}`}
              >
                {pair[0]}
              </button>
              <span className="text-gray-700 font-mono text-sm italic py-1 sm:py-0">vs</span>
              <button 
                onClick={() => handleSelect(rowIndex, pair[1])}
                className={`flex-1 w-full sm:w-64 py-4 rounded-xl border-2 font-bold transition-all ${selections[rowIndex] === pair[1] ? 'bg-amber-500 border-amber-500 text-gray-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'}`}
              >
                {pair[1]}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center h-20 flex flex-col items-center justify-center">
          {isComplete ? (
            <button 
              onClick={handleContinue}
              className="bg-white text-gray-950 px-12 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all hover:scale-105"
            >
              Continue →
            </button>
          ) : (
            <p className="text-gray-500 font-mono text-sm animate-pulse">Select 5 traits to continue...</p>
          )}
        </div>
      </div>
    </main>
  );
}
