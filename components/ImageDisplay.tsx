
import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { Download, Share2, ZoomIn, Copy, Check, Palette } from 'lucide-react';

interface ImageDisplayProps {
  image: GeneratedImage | null;
  isGenerating: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, isGenerating }) => {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    if (!image) return;
    
    // Extract style number (e.g., "72. Engraving Style" -> "72")
    const match = image.params.style.match(/^(\d+)\./);
    const styleNumber = match ? match[1] : '0';
    
    const link = document.createElement('a');
    link.href = image.imageUrl;
    // Filename format: sport-print-style-[number]-[id].png
    link.download = `sport-print-style-${styleNumber}-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPrompt = () => {
    if (image?.prompt) {
      navigator.clipboard.writeText(image.prompt).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">Preview</h2>
          {image && !isGenerating && (
            <div className="flex items-center gap-2 mt-1">
              <Palette size={14} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Style:</span>
              <span className="text-sm font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                {image.params.style}
              </span>
            </div>
          )}
        </div>
        {image && !isGenerating && (
           <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
             Ready
           </span>
        )}
      </div>

      <div className="flex-grow flex items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 overflow-hidden relative group">
        {isGenerating ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium animate-pulse">Creating your design...</p>
            <p className="text-xs text-slate-400 mt-2">Generating vectors & applying textures</p>
          </div>
        ) : image ? (
          <div className="relative w-full h-full flex items-center justify-center p-4">
             {/* Checkerboard pattern for transparency simulation behind the white image */}
            <div className="absolute inset-0 opacity-10" 
                 style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
            
            <img 
              src={image.imageUrl} 
              alt="Generated Sport Design" 
              className="max-w-full max-h-full object-contain shadow-xl rounded-lg z-10"
            />
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
              <button 
                onClick={handleDownload}
                className="bg-white text-slate-900 p-3 rounded-full hover:bg-brand-50 transition-colors transform hover:scale-110"
                title="Download"
              >
                <Download size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center max-w-xs px-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <ZoomIn size={32} />
            </div>
            <p className="text-slate-500 font-medium">No design generated yet</p>
            <p className="text-sm text-slate-400 mt-2">Fill out the form and hit Generate to see your sports print here.</p>
          </div>
        )}
      </div>

      {image && !isGenerating && (
        <div className="mt-6 flex gap-3">
          <button 
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            <Download size={18} />
            Download PNG
          </button>
          
          <button 
            onClick={handleCopyPrompt}
            disabled={!image.prompt}
            className="px-4 py-3 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 min-w-[140px] justify-center"
          >
            {copied ? (
              <>
                <Check size={18} className="text-green-600" />
                <span className="text-green-600 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
