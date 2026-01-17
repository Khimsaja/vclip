
import React from 'react';
import { Subtitle } from '../types';

interface Props {
  subtitles: Subtitle[];
  currentTime: number;
  setCurrentTime: (t: number) => void;
  onUpdate: (subs: Subtitle[]) => void;
}

const SubtitleList: React.FC<Props> = ({ subtitles, currentTime, setCurrentTime, onUpdate }) => {
  const handleTextChange = (id: string, newText: string) => {
    const updated = subtitles.map(s => s.id === id ? { ...s, text: newText } : s);
    onUpdate(updated);
  };

  return (
    <div className="space-y-2">
      {subtitles.map((sub) => {
        const isActive = currentTime >= sub.startTime && currentTime <= sub.endTime;
        return (
          <div 
            key={sub.id}
            onClick={() => setCurrentTime(sub.startTime)}
            className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
              isActive 
                ? 'bg-indigo-500/10 border-indigo-500 shadow-md' 
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                {sub.startTime.toFixed(1)}s - {sub.endTime.toFixed(1)}s
              </span>
              <button className="text-slate-600 group-hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                 <i className="fa-solid fa-pen text-[10px]"></i>
              </button>
            </div>
            <textarea
              value={sub.text}
              onChange={(e) => handleTextChange(sub.id, e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-300 resize-none h-auto min-h-[40px] p-0 font-medium"
              rows={2}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SubtitleList;
