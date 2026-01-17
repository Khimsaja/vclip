
import React, { useRef, useState } from 'react';

interface Props {
  onFileSelect: (file: File) => void;
  onUrlSubmit: (url: string) => void;
}

const VideoUploader: React.FC<Props> = ({ onFileSelect, onUrlSubmit }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('video/')) {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlSubmit(url.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 w-full px-4">
      {/* URL Input Section */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-2xl">
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-400 text-left ml-2">
            Paste YouTube Link
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fa-brands fa-youtube text-red-500 text-xl group-focus-within:scale-110 transition-transform"></i>
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="block w-full pl-12 pr-32 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!url.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl text-white font-bold transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              Get Clips
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-slate-800"></div>
        <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">Or upload local file</span>
        <div className="flex-1 h-px bg-slate-800"></div>
      </div>

      {/* Drag & Drop Section */}
      <div 
        className={`relative p-10 rounded-3xl border-2 border-dashed transition-all cursor-pointer group ${
          isDragging ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 hover:border-slate-600 bg-slate-900/30'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="video/*" 
          onChange={handleFileChange}
        />
        
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-slate-700">
            <i className="fa-solid fa-file-video text-2xl text-slate-400 group-hover:text-white"></i>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-300">Drag video file here</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-wider">MP4, MOV, WEBM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploader;
