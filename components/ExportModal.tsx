
import React, { useState, useEffect } from 'react';

interface Props {
  onClose: () => void;
}

const ExportModal: React.FC<Props> = ({ onClose }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing AI Render...');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsFinished(true);
          return 100;
        }
        
        if (prev > 80) setStatus('Adding Subtitles & Effects...');
        else if (prev > 50) setStatus('Splitting Gameplay & Facecam...');
        else if (prev > 20) setStatus('Encoding Vertical Format...');
        
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleDownload = () => {
    // Simulated download logic
    const link = document.createElement('a');
    link.href = '#'; // Placeholder
    link.setAttribute('download', 'VClip_Gaming_Short.mp4');
    document.body.appendChild(link);
    link.click();
    link.remove();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 text-center space-y-8 shadow-[0_0_100px_rgba(79,70,229,0.2)]">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-black text-white">{progress}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white italic uppercase tracking-widest">
            {isFinished ? 'RENDER COMPLETE' : 'EXPORTING VIDEO'}
          </h3>
          <p className="text-slate-400 font-bold text-sm h-6">{status}</p>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.5)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {isFinished ? (
          <div className="space-y-3 pt-4 animate-in fade-in slide-in-from-bottom-4">
            <button 
              onClick={handleDownload}
              className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-2xl"
            >
              Download MP4 Now
            </button>
            <button 
              onClick={onClose}
              className="w-full py-3 text-slate-500 font-bold hover:text-white transition-colors"
            >
              Back to Editor
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">Please do not close this window while we finish the magic.</p>
        )}
      </div>
    </div>
  );
};

export default ExportModal;
