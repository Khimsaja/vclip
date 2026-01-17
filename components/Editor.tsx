
import React, { useState, useEffect, useRef } from 'react';
import { VideoSegment, StylingConfig, Subtitle } from '../types';
import PreviewPlayer from './PreviewPlayer';
import SubtitleList from './SubtitleList';
import StylingPanel from './StylingPanel';

interface Props {
  videoUrl: string;
  segment: VideoSegment;
  styling: StylingConfig;
  setStyling: React.Dispatch<React.SetStateAction<StylingConfig>>;
  onUpdateSubtitles: (subs: Subtitle[]) => void;
}

const Editor: React.FC<Props> = ({ videoUrl, segment, styling, setStyling, onUpdateSubtitles }) => {
  const [currentTime, setCurrentTime] = useState(segment.startTime);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSubtitle, setActiveSubtitle] = useState<Subtitle | null>(null);

  useEffect(() => {
    const currentSub = segment.subtitles.find(
      s => currentTime >= s.startTime && currentTime <= s.endTime
    );
    setActiveSubtitle(currentSub || null);
  }, [currentTime, segment.subtitles]);

  return (
    <div className="w-full h-[calc(100vh-80px)] max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 p-4">
      {/* Left Column: Preview */}
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden p-6 relative">
        <div className="absolute top-4 left-6 z-10">
          <span className="px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
            9:16 Vertical Preview
          </span>
        </div>
        
        <PreviewPlayer 
          videoUrl={videoUrl}
          segment={segment}
          styling={styling}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          activeSubtitle={activeSubtitle}
        />
      </div>

      {/* Right Column: Controls */}
      <div className="w-full lg:w-96 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
        {/* Tabs for Subtitles vs Styling */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-2 flex gap-2">
          <button 
            className="flex-1 py-3 px-4 rounded-2xl font-semibold text-sm transition-all bg-indigo-600 text-white shadow-lg"
          >
            <i className="fa-solid fa-closed-captioning mr-2"></i> Subtitles
          </button>
          <div className="h-full w-[1px] bg-slate-800"></div>
          <button 
            className="flex-1 py-3 px-4 rounded-2xl font-semibold text-sm transition-all text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <i className="fa-solid fa-palette mr-2"></i> Styling
          </button>
        </div>

        <div className="flex-1 space-y-4">
          <StylingPanel styling={styling} setStyling={setStyling} />
          
          <div className="bg-slate-900 rounded-3xl border border-slate-800 flex flex-col overflow-hidden h-[400px]">
             <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-white text-sm">Transcript & Timeline</h3>
                <span className="text-xs text-slate-500">{segment.subtitles.length} lines</span>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <SubtitleList 
                  subtitles={segment.subtitles} 
                  currentTime={currentTime}
                  setCurrentTime={setCurrentTime}
                  onUpdate={onUpdateSubtitles}
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
