
import React, { useState } from 'react';
import { AppState, VideoSegment, StylingConfig, Subtitle } from './types';
import { analyzeVideo } from './services/gemini';
import VideoUploader from './components/VideoUploader';
import Editor from './components/Editor';
import ExportModal from './components/ExportModal';

const DEFAULT_STYLING: StylingConfig = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 24,
  fontColor: '#ffffff',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  shadowColor: 'rgba(0, 0, 0, 0.8)',
  positionY: 20,
  isUppercase: true,
  layout: 'gaming-split',
  faceZoom: 1.2,
};

const MOCK_SEGMENTS: VideoSegment[] = [{
  startTime: 0,
  endTime: 45,
  summary: "Epic Gaming Moment",
  gameplayCrop: { x: 0, y: 0, width: 100, height: 70 },
  faceCamCrop: { x: 75, y: 10, width: 20, height: 25 },
  subtitles: [
    { id: "1", startTime: 1, endTime: 3, text: "GILA COY! HEADSHOT!" },
    { id: "2", startTime: 3.5, endTime: 6, text: "Nggak nyangka banget bisa dapet momen ini." },
    { id: "3", startTime: 6.5, endTime: 10, text: "Jangan lupa subscribe buat konten gaming seru lainnya!" },
  ]
}];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [segments, setSegments] = useState<VideoSegment[]>([]);
  const [selectedSegmentIdx, setSelectedSegmentIdx] = useState(0);
  const [styling, setStyling] = useState<StylingConfig>(DEFAULT_STYLING);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setState(AppState.ANALYZING);
    setError(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await analyzeVideo(base64, file.type);
        setSegments(result);
        setState(AppState.EDITING);
      };
    } catch (err) {
      setError("Gagal menganalisis video.");
      setState(AppState.IDLE);
    }
  };

  const handleUrlSubmit = async (url: string) => {
    setState(AppState.ANALYZING);
    setTimeout(() => {
      setVideoUrl("https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
      setSegments(MOCK_SEGMENTS);
      setState(AppState.EDITING);
    }, 2000);
  };

  const startExport = () => setState(AppState.EXPORTING);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 overflow-x-hidden">
      <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setState(AppState.IDLE)}>
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fa-solid fa-gamepad text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-black italic bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">VCLIP GAMER</h1>
        </div>
        
        {state === AppState.EDITING && (
          <button 
            onClick={startExport}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-full text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
          >
            <i className="fa-solid fa-cloud-arrow-down"></i> Export & Download
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {state === AppState.IDLE && (
          <div className="max-w-4xl w-full text-center space-y-8 py-12">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic">
                LEVEL UP YOUR <span className="text-indigo-500">SHORTS</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
                Auto-detect gameplay & facecam. Ciptakan video split-screen profesional ala streamer hanya dengan satu klik.
              </p>
            </div>
            <VideoUploader onFileSelect={handleFileSelect} onUrlSubmit={handleUrlSubmit} />
          </div>
        )}

        {state === AppState.ANALYZING && (
          <div className="flex flex-col items-center gap-8 py-20">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 border-8 border-indigo-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-headset text-indigo-400 text-4xl animate-bounce"></i>
              </div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-widest">Scanning Content...</h3>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest animate-pulse">Detecting Facecam & Epic Moments</p>
            </div>
          </div>
        )}

        {state === AppState.EDITING && segments.length > 0 && (
          <Editor 
            videoUrl={videoUrl}
            segment={segments[selectedSegmentIdx]}
            styling={styling}
            setStyling={setStyling}
            onUpdateSubtitles={(subs) => {
              const newSegments = [...segments];
              newSegments[selectedSegmentIdx].subtitles = subs;
              setSegments(newSegments);
            }}
          />
        )}
      </main>

      {state === AppState.EXPORTING && (
        <ExportModal onClose={() => setState(AppState.EDITING)} />
      )}

      {error && <div className="fixed bottom-6 right-6 p-4 bg-red-500 text-white rounded-2xl shadow-2xl font-bold animate-bounce">{error}</div>}
    </div>
  );
};

export default App;
