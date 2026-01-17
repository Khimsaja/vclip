
import React, { useRef, useEffect } from 'react';
import { StylingConfig, VideoSegment, Subtitle } from '../types';

interface Props {
  videoUrl: string;
  segment: VideoSegment;
  styling: StylingConfig;
  currentTime: number;
  setCurrentTime: (t: number) => void;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
  activeSubtitle: Subtitle | null;
}

const PreviewPlayer: React.FC<Props> = ({ 
  videoUrl, segment, styling, currentTime, setCurrentTime, isPlaying, setIsPlaying, activeSubtitle 
}) => {
  const topVideoRef = useRef<HTMLVideoElement>(null);
  const bottomVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    [topVideoRef, bottomVideoRef].forEach(ref => {
      if (ref.current) {
        if (isPlaying) ref.current.play();
        else ref.current.pause();
      }
    });
  }, [isPlaying]);

  useEffect(() => {
    // Sync both videos
    if (topVideoRef.current && bottomVideoRef.current) {
      if (Math.abs(topVideoRef.current.currentTime - bottomVideoRef.current.currentTime) > 0.1) {
        bottomVideoRef.current.currentTime = topVideoRef.current.currentTime;
      }
    }
  }, [currentTime]);

  const handleTimeUpdate = () => {
    if (topVideoRef.current) {
      const time = topVideoRef.current.currentTime;
      setCurrentTime(time);
      if (time >= segment.endTime) {
        topVideoRef.current.currentTime = segment.startTime;
        if (bottomVideoRef.current) bottomVideoRef.current.currentTime = segment.startTime;
      }
    }
  };

  const renderStandard = () => (
    <div className="w-full h-full relative overflow-hidden bg-black">
      <video 
        ref={topVideoRef}
        src={videoUrl}
        className="w-full h-full object-cover scale-150"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => { if (topVideoRef.current) topVideoRef.current.currentTime = segment.startTime; }}
        muted
        playsInline
      />
    </div>
  );

  const renderGamingSplit = () => {
    const gameplay = segment.gameplayCrop || { x: 0, y: 0, width: 100, height: 70 };
    const face = segment.faceCamCrop || { x: 70, y: 10, width: 30, height: 30 };

    return (
      <div className="w-full h-full flex flex-col bg-black">
        {/* Top: Gameplay */}
        <div className="flex-[3] relative overflow-hidden border-b-4 border-indigo-500/50">
          <video 
            ref={topVideoRef}
            src={videoUrl}
            style={{
              width: `${100 / (gameplay.width / 100)}%`,
              height: `${100 / (gameplay.height / 100)}%`,
              left: `${-gameplay.x}%`,
              top: `${-gameplay.y}%`,
              position: 'absolute',
              maxWidth: 'none',
              transform: 'scale(1.2)'
            }}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => { if (topVideoRef.current) topVideoRef.current.currentTime = segment.startTime; }}
            muted
            playsInline
          />
          <div className="absolute top-4 right-4 bg-indigo-600/80 px-2 py-0.5 rounded text-[8px] font-black uppercase">Gameplay</div>
        </div>
        {/* Bottom: Facecam */}
        <div className="flex-[2] relative overflow-hidden bg-slate-900">
           <video 
            ref={bottomVideoRef}
            src={videoUrl}
            style={{
              width: `${100 / (face.width / 100)}%`,
              height: `${100 / (face.height / 100)}%`,
              left: `${-face.x}%`,
              top: `${-face.y}%`,
              position: 'absolute',
              maxWidth: 'none',
              transform: `scale(${styling.faceZoom})`
            }}
            muted
            playsInline
          />
          <div className="absolute bottom-4 left-4 bg-purple-600/80 px-2 py-0.5 rounded text-[8px] font-black uppercase">Facecam</div>
          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,1)] pointer-events-none"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full h-full max-h-[750px]">
      <div className="relative aspect-9-16 h-full bg-black rounded-[2.5rem] border-[14px] border-slate-950 shadow-[0_0_50px_rgba(79,70,229,0.3)] overflow-hidden group">
        {styling.layout === 'gaming-split' ? renderGamingSplit() : renderStandard()}

        {/* Subtitle Overlay */}
        {activeSubtitle && (
          <div 
            className="absolute left-0 right-0 px-6 flex justify-center text-center transition-all duration-300 z-20"
            style={{ 
              bottom: `${styling.positionY}%`,
              pointerEvents: 'none'
            }}
          >
            <div 
              style={{
                fontFamily: styling.fontFamily,
                fontSize: `${styling.fontSize}px`,
                color: styling.fontColor,
                backgroundColor: styling.backgroundColor,
                textShadow: `0 3px 6px ${styling.shadowColor}`,
                textTransform: styling.isUppercase ? 'uppercase' : 'none',
                padding: '6px 16px',
                borderRadius: '12px',
                lineHeight: '1.1',
                fontWeight: '900',
                border: styling.layout === 'gaming-split' ? '2px solid rgba(255,255,255,0.2)' : 'none'
              }}
              className="inline-block"
            >
              {activeSubtitle.text}
            </div>
          </div>
        )}

        <div 
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-30"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white text-3xl">
            <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[400px] mt-8 px-4">
        <input 
          type="range" min={segment.startTime} max={segment.endTime} step={0.1}
          value={currentTime}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setCurrentTime(val);
            if (topVideoRef.current) topVideoRef.current.currentTime = val;
            if (bottomVideoRef.current) bottomVideoRef.current.currentTime = val;
          }}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>
    </div>
  );
};

export default PreviewPlayer;
