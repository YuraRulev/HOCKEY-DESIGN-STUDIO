import React, { useState, useEffect, useRef } from 'react';
    import { DesignParams, GeneratedImage, PRESET_SPORTS, SportStyle } from '../types';
    import { Palette, Dumbbell, Type, Brush, Layers, Box, Shuffle, Image as ImageIcon, Upload, X, Dices } from 'lucide-react';
    import { Gallery } from './Gallery';
    
    interface DesignControlsProps {
      params: DesignParams;
      setParams: React.Dispatch<React.SetStateAction<DesignParams>>;
      onGenerate: (params?: DesignParams) => void;
      isGenerating: boolean;
      history: GeneratedImage[];
      onSelectHistory: (image: GeneratedImage) => void;
      onDeleteHistory: (id: string) => void;
    }
    
    const DEFAULT_COLORS = [
      '#ef4444', '#000000', '#ffffff', '#fbbf24', '#3b82f6',
      '#10b981', '#8b5cf6', '#f97316', '#ec4899', '#64748b'
    ];
    
    // Common sports colors for auto-generation
    const SPORTS_PALETTE_POOL = [
      '#EF4444', // Red
      '#000000', // Black
      '#FFFFFF', // White
      '#1E3A8A', // Navy
      '#F59E0B', // Gold
      '#10B981', // Emerald
      '#F97316', // Orange
      '#6366F1', // Indigo
      '#8B5CF6', // Violet
      '#EC4899', // Pink
      '#14B8A6', // Teal
      '#94A3B8', // Silver
      '#78350F', // Brown
      '#881337', // Maroon
    ];

    export const DesignControls: React.FC<DesignControlsProps> = ({
      params,
      setParams,
      onGenerate,
      isGenerating,
      history,
      onSelectHistory,
      onDeleteHistory
    }) => {
      const [colorCount, setColorCount] = useState<number>(2);
      const [selectedColors, setSelectedColors] = useState<string[]>(DEFAULT_COLORS);
      const fileInputRef = useRef<HTMLInputElement>(null);
    
      // Sync colors to params when local state changes
      useEffect(() => {
        const activeColors = selectedColors.slice(0, colorCount);
        const colorString = activeColors.join(', ');
        setParams(prev => ({ ...prev, colors: colorString }));
      }, [colorCount, selectedColors, setParams]);
    
      const handleColorChange = (index: number, newColor: string) => {
        const updated = [...selectedColors];
        updated[index] = newColor;
        setSelectedColors(updated);
      };
    
      const handleChange = (key: keyof DesignParams, value: any) => {
        setParams(prev => ({ ...prev, [key]: value }));
      };

      const generatePalette = (count: number) => {
        const newColors: string[] = [];
        const baseColor = SPORTS_PALETTE_POOL[Math.floor(Math.random() * SPORTS_PALETTE_POOL.length)];
        newColors.push(baseColor);
        
        while (newColors.length < count) {
          const hasWhite = newColors.includes('#FFFFFF');
          const hasBlack = newColors.includes('#000000');
          
          if (!hasWhite && Math.random() > 0.4) {
            newColors.push('#FFFFFF');
            continue;
          }
          if (!hasBlack && Math.random() > 0.4) {
            newColors.push('#000000');
            continue;
          }

          const random = SPORTS_PALETTE_POOL[Math.floor(Math.random() * SPORTS_PALETTE_POOL.length)];
          if (!newColors.includes(random)) {
            newColors.push(random);
          }
        }
        return newColors.sort(() => Math.random() - 0.5);
      };

      const handleAutoPalette = () => {
        const newPalette = generatePalette(colorCount);
        // Preserve other slots
        const fullPalette = [...selectedColors];
        for(let i=0; i<newPalette.length; i++) {
          fullPalette[i] = newPalette[i];
        }
        setSelectedColors(fullPalette);
      };

      const handleRandomize = () => {
        // 1. Random Style
        const styleValues = Object.values(SportStyle);
        const randomStyle = styleValues[Math.floor(Math.random() * styleValues.length)];

        // 2. Random Mode
        const modes: ('2D' | '3D')[] = ['2D', '3D'];
        const randomMode = modes[Math.floor(Math.random() * modes.length)];

        // 3. Random Color Count (1-10)
        const randomCount = Math.floor(Math.random() * 10) + 1;
        
        // 4. Random Palette
        const newPalette = generatePalette(randomCount);
        const fullPalette = [...newPalette];
        while(fullPalette.length < 10) {
           fullPalette.push(DEFAULT_COLORS[fullPalette.length] || '#000000');
        }
        
        // Update UI State
        setColorCount(randomCount);
        setSelectedColors(fullPalette);
        
        // 5. Update Params and Trigger Generation
        const newParams: DesignParams = {
          ...params,
          style: randomStyle,
          mode: randomMode,
          colors: newPalette.join(', ')
        };
        
        setParams(newParams);
        onGenerate(newParams);
      };

      const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            handleChange('referenceImage', reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      };

      const clearReferenceImage = () => {
        handleChange('referenceImage', undefined);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
    
      return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 mb-1">HOCKEY DESIGN STUDIO</h2>
              <p className="text-sm text-slate-500">Customize your sports print</p>
            </div>
            <button
              onClick={handleRandomize}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-600 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors"
              title="Randomize All Settings & Generate"
            >
              <Dices size={14} />
              Randomize
            </button>
          </div>
    
          <div className="space-y-5 flex-grow mt-6 overflow-y-auto pr-2 custom-scrollbar">
            {/* Text Input - Multiline */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                <Type size={14} />
                Print Text (Multi-line supported)
              </label>
              <textarea
                value={params.text}
                onChange={(e) => handleChange('text', e.target.value)}
                placeholder="e.g. CITY&#10;HOCKEY"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400 font-sans tracking-normal text-base resize-none leading-normal"
              />
            </div>

            {/* Mascot Mixer / Reference Image */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                <ImageIcon size={14} />
                Mascot Mixer
              </label>
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3">
                {!params.referenceImage ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                      <Upload size={16} className="text-brand-500" />
                    </div>
                    <p className="text-xs font-medium text-slate-600">Upload Logo or Sketch</p>
                    <p className="text-[10px] text-slate-400">to stylize into the print</p>
                  </div>
                ) : (
                  <div className="relative group">
                    <img 
                      src={params.referenceImage} 
                      alt="Reference" 
                      className="w-full h-32 object-contain rounded bg-white border border-slate-200"
                    />
                    <button
                      onClick={clearReferenceImage}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Remove Image"
                    >
                      <X size={12} />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                      Mascot Active
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
    
            {/* Sport Selector (Read Only / Locked) */}
            <div className="space-y-2 opacity-75">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                <Dumbbell size={14} />
                Sport
              </label>
              <div className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-medium text-sm flex items-center justify-between">
                Hockey
                <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600">Locked</span>
              </div>
            </div>

            {/* Render Mode (2D/3D) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                <Box size={14} />
                Dimension Mode
              </label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => handleChange('mode', '2D')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                    params.mode === '2D'
                      ? 'bg-white text-brand-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Layers size={14} />
                  2D Flat
                </button>
                <button
                  onClick={() => handleChange('mode', '3D')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                    params.mode === '3D'
                      ? 'bg-white text-brand-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Box size={14} />
                  3D Render
                </button>
              </div>
            </div>
    
            {/* Style Selector */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                <Brush size={14} />
                Visual Style
              </label>
              <select
                value={params.style}
                onChange={(e) => handleChange('style', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-sm"
              >
                {Object.entries(SportStyle).map(([key, label]) => (
                  <option key={key} value={label}>{label}</option>
                ))}
              </select>
            </div>
    
            {/* Color Scheme Selector */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                  <Palette size={14} />
                  Colors
                </label>
                <button 
                  onClick={handleAutoPalette}
                  className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600 rounded-full hover:bg-brand-100 transition-colors"
                >
                  <Shuffle size={12} />
                  Auto Palette
                </button>
              </div>
              
              {/* Color Count Buttons */}
              <div className="grid grid-cols-5 gap-2 p-1 bg-slate-100 rounded-lg">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setColorCount(num)}
                    className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${
                      colorCount === num
                        ? 'bg-white text-brand-600 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
    
              {/* Color Pickers */}
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: colorCount }).map((_, index) => (
                  <div key={index} className="space-y-1">
                    <div className="relative h-10 w-full rounded-md overflow-hidden border border-slate-200 shadow-sm group cursor-pointer hover:border-brand-300 transition-colors">
                      <input
                        type="color"
                        value={selectedColors[index] || '#000000'}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="absolute -top-2 -left-2 w-[150%] h-[150%] cursor-pointer p-0 border-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
    
          {/* Action Button */}
          <div className="pt-4 mt-auto space-y-4">
            <button
              onClick={() => onGenerate()}
              disabled={isGenerating || !params.text}
              className={`w-full py-4 rounded-xl font-display text-xl font-bold tracking-wider uppercase transition-all transform active:scale-95 shadow-lg ${
                isGenerating || !params.text
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:shadow-brand-500/25'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Generate'
              )}
            </button>
            
            {/* Embedded Gallery */}
            <Gallery 
              history={history}
              onSelect={onSelectHistory}
              onDelete={onDeleteHistory}
            />
          </div>
        </div>
      );
    };