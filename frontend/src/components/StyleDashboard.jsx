import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, BarChart3, Clock, Sparkles, X } from 'lucide-react';

export default function StyleDashboard({ persona, onImportChat, darkMode, onCloseDashboard }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle | loading | success
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file || !file.name.endsWith('.txt')) {
      alert("Please upload a valid .txt chat export file.");
      return;
    }

    setUploadState('loading');
    setProgress(10);
    
    // Simulate WhatsApp chat log parsing steps
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState('success');
          
          // Add a minor timeout before callback to show success state
          setTimeout(() => {
            onImportChat(file.name);
            setUploadState('idle');
            setProgress(0);
          }, 1500);

          return 100;
        }
        // Progression steps
        return prev + 15;
      });
    }, 250);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  if (!persona) return null;

  const profile = persona.styleProfile;

  return (
    <div className={`w-full flex flex-col h-full overflow-y-auto select-none ${
      darkMode 
        ? 'bg-whatsapp-dark-sidebar border-l border-zinc-800/80 text-zinc-100' 
        : 'bg-white border-l border-slate-200 text-slate-800'
    }`}>
      {/* Title Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        darkMode ? 'border-zinc-800 bg-zinc-900/60' : 'border-slate-200 bg-slate-50/80'
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className="text-emerald-500" size={15} />
          <h2 className="font-bold text-xs">Clone Style Profile</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-full">
            Llama 3.2 Active
          </span>
          <button 
            onClick={onCloseDashboard}
            className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors cursor-pointer"
            title="Close Panel"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Style Score Header */}
      <div className="p-5 flex flex-col items-center border-b border-slate-100 dark:border-zinc-850/60">
        <div className="relative w-22 h-22 flex items-center justify-center mb-3">
          {/* Circular Progress Path */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="44"
              cy="44"
              r="36"
              stroke={darkMode ? '#1f1f23' : '#f1f5f9'}
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="44"
              cy="44"
              r="36"
              stroke="#10b981"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={226.2}
              strokeDashoffset={226.2 - (226.2 * profile.matchScore) / 100}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-extrabold tracking-tight">{profile.matchScore}%</span>
            <span className="text-[8px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Match Score</span>
          </div>
        </div>
        <h3 className="font-bold text-sm text-center">{persona.name}</h3>
        <p className="text-[10px] text-center text-slate-400 dark:text-zinc-500 mt-1 max-w-[200px]">Persona profile generated from training chat data.</p>
      </div>

      {/* File Upload Dropzone */}
      <div className="p-4 border-b border-slate-100 dark:border-zinc-850/60">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3">
          Train / Update Persona
        </h4>
        
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-emerald-500 bg-emerald-500/5' 
              : darkMode 
                ? 'border-zinc-800 hover:border-emerald-500/40 hover:bg-zinc-850/30' 
                : 'border-slate-200 hover:border-emerald-500/30 hover:bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".txt"
            className="hidden"
          />

          {uploadState === 'idle' && (
            <div className="flex flex-col items-center py-2">
              <Upload className="text-gray-450 dark:text-zinc-550 mb-2" size={20} />
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Upload WhatsApp Chat (.txt)</span>
              <span className="text-[9px] text-gray-450 dark:text-zinc-500 mt-0.5">Drag & drop or click to browse</span>
            </div>
          )}

          {uploadState === 'loading' && (
            <div className="flex flex-col items-center py-1">
              <div className="w-6 h-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-2"></div>
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Analyzing Chat Log...</span>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-[9px] text-gray-455 dark:text-zinc-500 mt-1.5 font-medium">
                {progress < 40 ? 'Sanitizing logs...' : progress < 75 ? 'Mapping speech pattern...' : 'Building prompt profile...'}
              </span>
            </div>
          )}

          {uploadState === 'success' && (
            <div className="flex flex-col items-center text-emerald-500 py-1">
              <CheckCircle2 className="mb-1.5 animate-bounce" size={24} />
              <span className="text-xs font-bold">Clone Profile Configured!</span>
              <span className="text-[9px] text-emerald-600/80 dark:text-emerald-450/80 mt-0.5">Ready to chat</span>
            </div>
          )}
        </div>
      </div>

      {/* Style Profile Details */}
      <div className="p-4 flex-1 space-y-4">
        {/* Tone Section */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-emerald-500" />
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">Tone & Personality</h4>
          </div>
          <p className="text-xs leading-relaxed text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-100 dark:border-zinc-850/60">
            {profile.tone}
          </p>
        </div>

        {/* Punctuation & Formatting Traits */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <BarChart3 size={14} className="text-emerald-500" />
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">Style & Syntax</h4>
          </div>
          <p className="text-xs leading-relaxed text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-100 dark:border-zinc-850/60">
            {profile.punctuation}
          </p>
        </div>

        {/* Top Vocabulary Words */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-emerald-500" />
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">Signature Words</h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.vocabulary.map((word, idx) => (
              <span 
                key={idx} 
                className="text-[9px] font-bold px-2 py-1 rounded-lg bg-emerald-550/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10"
              >
                "{word}"
              </span>
            ))}
          </div>
        </div>

        {/* Numeric stats grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850/60 rounded-xl">
            <div className="flex items-center gap-1 text-gray-400 dark:text-zinc-500 mb-1">
              <Clock size={12} />
              <span className="text-[8px] font-bold uppercase tracking-wider">Response Speed</span>
            </div>
            <span className="text-xs font-extrabold">{profile.avgResponseTime}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850/60 rounded-xl">
            <div className="flex items-center gap-1 text-gray-400 dark:text-zinc-500 mb-1">
              <FileText size={12} />
              <span className="text-[8px] font-bold uppercase tracking-wider">Avg Msg Length</span>
            </div>
            <span className="text-xs font-extrabold">{profile.messageLength}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
