
import React from 'react';
import { GeneratedImage } from '../types';
import { Clock, X } from 'lucide-react';

interface GalleryProps {
  history: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ history, onSelect, onDelete }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-6 border-t border-slate-100 pt-6">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Clock size={14} className="text-slate-400" />
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Designs</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {history.map((item) => (
          <div key={item.id} className="relative group">
            <button
              onClick={() => onSelect(item)}
              title={`${item.params.style} - ${item.params.text}`}
              className="w-full aspect-square rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-brand-500 transition-all bg-white relative"
            >
              <img 
                src={item.imageUrl} 
                alt={item.params.text} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white text-[10px] p-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                {item.params.style}
              </div>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600 transform scale-75 z-10"
              title="Delete"
            >
              <X size={12} strokeWidth={3} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
