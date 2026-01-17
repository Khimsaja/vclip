
import React from 'react';
import { StylingConfig, LayoutMode } from '../types';

interface Props {
  styling: StylingConfig;
  setStyling: React.Dispatch<React.SetStateAction<StylingConfig>>;
}

const StylingPanel: React.FC<Props> = ({ styling, setStyling }) => {
  const updateStyle = (key: keyof StylingConfig, val: any) => {
    setStyling(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 space-y-8">
      {/* Layout Selection */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Layout Mode</label>
        <div className="grid grid-cols-2 gap-3">
          {(['standard', 'gaming-split'] as LayoutMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => updateStyle('layout', mode)}
              className={`py-3 px-4 rounded-2xl border-2 font-bold text-xs transition-all flex flex-col items-center gap-2 ${
                styling.layout === mode 
                ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                : 'border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              <i className={`fa-solid ${mode === 'standard' ? 'fa-mobile-screen' : 'fa-clapperboard'} text-lg`}></i>
              {mode === 'standard' ? 'Standard' : 'Gaming Split'}
            </button>
          ))}
        </div>
      </div>

      {styling.layout === 'gaming-split' && (
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Face Cam Zoom</label>
          <input 
            type="range" min="1" max="2" step="0.1"
            value={styling.faceZoom}
            onChange={(e) => updateStyle('faceZoom', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      )}

      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Typography</label>
        <div className="grid grid-cols-2 gap-2">
          {["'Montserrat', sans-serif", "'Bebas Neue', cursive"].map(f => (
            <button
              key={f}
              onClick={() => updateStyle('fontFamily', f)}
              className={`py-2 px-3 rounded-xl border text-[10px] font-bold ${styling.fontFamily === f ? 'border-white bg-white text-black' : 'border-slate-800 text-slate-500'}`}
              style={{ fontFamily: f }}
            >
              {f.includes('Bebas') ? 'BEBAS NEUE' : 'MONTSERRAT'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Text Size</label>
          <input 
            type="range" min="12" max="64" value={styling.fontSize}
            onChange={(e) => updateStyle('fontSize', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
        <div className="flex-1 space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Position</label>
          <input 
            type="range" min="10" max="90" value={styling.positionY}
            onChange={(e) => updateStyle('positionY', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default StylingPanel;
