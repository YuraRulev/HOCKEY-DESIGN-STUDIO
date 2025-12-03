import React, { useState } from 'react';
import { DesignParams, GeneratedImage, SportStyle } from './types';
import { generateSportsPrint } from './services/geminiService';
import { DesignControls } from './components/DesignControls';
import { ImageDisplay } from './components/ImageDisplay';

// Custom Puck Icon
const PuckIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Top Surface */}
    <ellipse cx="12" cy="9" rx="10" ry="4" />
    {/* Side / Bottom Curve */}
    <path d="M2 9v6c0 2.2 4.5 4 10 4s10-1.8 10-4V9" />
  </svg>
);

const INITIAL_PARAMS: DesignParams = {
  text: '',
  sport: 'Hockey',
  colors: 'Red and Black',
  style: SportStyle.MODERN,
  mode: '2D'
};

export default function App() {
  const [params, setParams] = useState<DesignParams>(INITIAL_PARAMS);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (overrideParams?: DesignParams) => {
    setIsGenerating(true);
    setError(null);

    // If overrideParams are provided (e.g. from Randomize button), use them.
    // Otherwise use the current state params.
    // We check for 'text' property to ensure it's a valid DesignParams object and not a SyntheticEvent.
    const activeParams = (overrideParams && 'text' in overrideParams) ? overrideParams : params;

    try {
      const { imageUrl, prompt } = await generateSportsPrint(activeParams);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        imageUrl,
        params: { ...activeParams },
        createdAt: Date.now(),
        prompt
      };

      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev]);
      
      // If we used overrideParams, we should ensure the state matches (though setParams was likely called in child)
      if (overrideParams && 'text' in overrideParams) {
        setParams(overrideParams);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    setHistory(prev => prev.filter(img => img.id !== id));
    if (currentImage?.id === id) {
      setCurrentImage(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-brand-600 p-2 rounded-lg text-white">
                <PuckIcon size={24} />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight leading-none">
                  HOCKEY <span className="text-brand-600">DESIGN STUDIO</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                  AI Sports Graphics Generator
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-900 font-bold">&times;</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[800px]">
          {/* Left Column - Controls & History */}
          <div className="lg:col-span-4 h-full">
            <DesignControls 
              params={params}
              setParams={setParams}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              history={history}
              onSelectHistory={setCurrentImage}
              onDeleteHistory={handleDelete}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-8 h-full">
            <ImageDisplay 
              image={currentImage}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <p className="text-xs font-medium text-slate-400">
          created by #YuraRulev
        </p>
      </footer>
    </div>
  );
}