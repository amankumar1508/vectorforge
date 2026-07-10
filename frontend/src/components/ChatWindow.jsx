import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Smile, Paperclip, Send, Mic, Check, CheckCheck, ArrowLeft, Sparkles } from 'lucide-react';

export default function ChatWindow({ 
  persona, 
  onSendMessage, 
  darkMode, 
  showDashboard, 
  onToggleDashboard,
  activeMobileView,
  setActiveMobileView
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [persona?.chatHistory]);

  if (!persona) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${
        darkMode ? 'bg-zinc-950 text-zinc-400' : 'bg-slate-50 text-slate-500'
      }`}>
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-3xl mb-4 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 animate-pulse">
          🤖
        </div>
        <h2 className="text-lg font-bold mb-1.5 text-slate-900 dark:text-zinc-100">Ditton AI Workspace</h2>
        <p className="max-w-md text-xs leading-relaxed text-slate-400 dark:text-zinc-500">
          Select a chat persona from the sidebar to start conversing with their digital clone, or upload a WhatsApp chat log in the style panel to train a new one.
        </p>
      </div>
    );
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden ${
      darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Chat Header */}
      <div className={`px-4 py-3 flex items-center justify-between shadow-xs z-10 border-b ${
        darkMode ? 'bg-zinc-900/80 border-zinc-800/80 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Back Button for mobile */}
          <button 
            onClick={() => setActiveMobileView('list')}
            className="md:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 transition-colors mr-1 cursor-pointer"
            title="Back to Chats"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-lg bg-linear-to-br from-emerald-500/10 to-indigo-500/10 dark:from-emerald-500/5 dark:to-indigo-500/5 flex items-center justify-center text-xl shadow-xs border dark:border-zinc-850 relative flex-shrink-0">
            {persona.avatar}
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-xs leading-none truncate">{persona.name}</h3>
            <span className="text-[9px] text-emerald-500 dark:text-emerald-400 font-semibold tracking-wide flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              {persona.status === 'online' ? 'typing...' : persona.lastSeen}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 text-gray-400 dark:text-zinc-500 flex-shrink-0">
          <button title="Search in Chat" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md">
            <Search size={16} />
          </button>
          <button title="Chat Menu" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md">
            <MoreVertical size={16} />
          </button>
          
          {/* Style Dashboard Switcher */}
          <button
            onClick={onToggleDashboard}
            title={showDashboard ? "Hide Style Profile" : "Show Style Profile"}
            className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-450 px-2.5 py-1.5 rounded-md flex items-center gap-1 border border-emerald-500/10"
          >
            <Sparkles size={13} />
            <span className="hidden sm:inline">Profile</span>
          </button>
        </div>
      </div>

      {/* Message Screen (Scroll Pane) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 whatsapp-doodle flex flex-col">
        {/* Helper System Info Banner */}
        <div className="self-center bg-white/80 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800/80 rounded-xl px-4 py-2 text-[10px] text-slate-500 dark:text-zinc-400 max-w-sm text-center shadow-xs flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span>Inference active: Ollama / Llama 3.2 model loaded</span>
        </div>

        {persona.chatHistory.map((msg, index) => {
          const isMe = msg.sender === 'me';
          return (
            <div
              key={msg.id || index}
              className={`flex flex-col max-w-[75%] md:max-w-[65%] rounded-2xl px-3.5 py-2 shadow-xs relative text-xs leading-relaxed ${
                isMe
                  ? 'bg-emerald-600 dark:bg-emerald-600 text-white self-end rounded-tr-xs shadow-emerald-600/5'
                  : `self-start rounded-tl-xs ${
                      darkMode 
                        ? 'bg-zinc-900 border border-zinc-850 text-zinc-100' 
                        : 'bg-white border border-slate-100 text-slate-800'
                    }`
              }`}
            >
              {/* Message text */}
              <p className="break-words pr-12 pb-1.5">{msg.text}</p>
              
              {/* Message Time and Status Receipt */}
              <div className={`absolute bottom-1 right-2.5 flex items-center gap-1 text-[8px] ${
                isMe ? 'text-emerald-200' : 'text-gray-400 dark:text-zinc-500'
              }`}>
                <span>{msg.timestamp}</span>
                {isMe && (
                  <span>
                    {msg.status === 'read' ? (
                      <CheckCheck size={11} className="text-sky-300" />
                    ) : msg.status === 'delivered' ? (
                      <CheckCheck size={11} className="text-emerald-200" />
                    ) : (
                      <Check size={11} className="text-emerald-200" />
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Footer Bar */}
      <form onSubmit={handleSend} className={`p-4 flex items-center gap-3 border-t ${
        darkMode ? 'bg-zinc-900/80 border-zinc-850' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 text-gray-400 dark:text-zinc-500">
          <button type="button" title="Emojis" className="hover:text-emerald-500 dark:hover:text-emerald-450 transition-colors cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg">
            <Smile size={18} />
          </button>
          <button type="button" title="Attach Document" className="hover:text-emerald-500 dark:hover:text-emerald-450 transition-colors cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg">
            <Paperclip size={18} />
          </button>
        </div>

        {/* Input box */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message or test clone speech pattern..."
          className={`flex-1 rounded-xl px-4 py-2.5 text-xs outline-none border transition-all ${
            darkMode 
              ? 'bg-zinc-950 border-zinc-850 focus:border-emerald-500/50 text-white placeholder-zinc-650' 
              : 'bg-slate-50 border-slate-200/80 focus:bg-white focus:border-emerald-500/40 text-slate-800 placeholder-slate-400'
          }`}
        />

        {/* Dynamic Action Button */}
        <div>
          {inputText.trim() ? (
            <button
              type="submit"
              className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md shadow-emerald-500/10"
            >
              <Send size={15} />
            </button>
          ) : (
            <button
              type="button"
              title="Record Voice Note"
              className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-gray-400 dark:text-zinc-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Mic size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
