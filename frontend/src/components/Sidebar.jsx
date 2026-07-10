import React, { useState } from 'react';
import { Search, MessageSquare, MoreVertical, CircleDashed, Filter } from 'lucide-react';

export default function Sidebar({ personas, activePersonaId, onSelectPersona, darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPersonas = personas.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`w-full flex flex-col border-r h-full ${
      darkMode 
        ? 'bg-whatsapp-dark-sidebar border-whatsapp-dark-border text-whatsapp-dark-text-primary' 
        : 'bg-white border-slate-200 text-whatsapp-light-text-primary'
    }`}>
      {/* Sidebar Header */}
      <div className={`p-4 flex items-center justify-between border-b ${
        darkMode ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-slate-50/80 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm border border-emerald-500/20 shadow-xs">
            SK
          </div>
          <div>
            <span className="text-[10px] text-gray-400 dark:text-zinc-500 block uppercase font-bold tracking-wider leading-none">Logged In</span>
            <span className="font-bold text-sm block mt-0.5 leading-none">Sumit Kumar</span>
          </div>
        </div>
        <div className="flex items-center gap-3.5 text-gray-400 dark:text-zinc-500">
          <button title="Status" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md">
            <CircleDashed size={18} />
          </button>
          <button title="New Chat" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md">
            <MessageSquare size={18} />
          </button>
          <button title="Menu" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Broadcast Info / Local Server status */}
      <div className={`px-4 py-2 text-[10px] font-semibold flex items-center gap-2 border-b ${
        darkMode 
          ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' 
          : 'bg-emerald-500/5 text-emerald-700 border-emerald-500/10'
      }`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        <span>Ollama Llama 3.2: Connected on <code className="bg-emerald-500/10 px-1 py-0.5 rounded font-mono text-[9px]">http://localhost:11434</code></span>
      </div>

      {/* Search and Filter */}
      <div className="p-3 flex items-center gap-2 border-b dark:border-zinc-800/40">
        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg flex-grow border transition-all ${
          darkMode 
            ? 'bg-zinc-800/20 border-zinc-800/80 focus-within:border-emerald-500/50 focus-within:bg-zinc-800/40' 
            : 'bg-slate-100/70 border-slate-200/60 focus-within:border-emerald-500/40 focus-within:bg-white'
        }`}>
          <Search size={16} className="text-gray-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search or start clone chat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs w-full outline-none border-none placeholder-gray-400 dark:placeholder-zinc-500 text-slate-800 dark:text-zinc-100"
          />
        </div>
        <button className={`p-2 rounded-lg transition-colors border cursor-pointer ${
          darkMode 
            ? 'bg-zinc-800/20 border-zinc-800/80 hover:bg-zinc-800 hover:text-emerald-400 text-zinc-400' 
            : 'bg-slate-100/70 border-slate-200/60 hover:bg-slate-100 hover:text-emerald-600 text-slate-500'
        }`}>
          <Filter size={16} />
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredPersonas.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400 dark:text-zinc-500">
            No contacts or clones found
          </div>
        ) : (
          filteredPersonas.map((persona) => {
            const isActive = persona.id === activePersonaId;
            const lastMsg = persona.chatHistory[persona.chatHistory.length - 1];
            
            return (
              <div
                key={persona.id}
                onClick={() => onSelectPersona(persona.id)}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer rounded-lg transition-all duration-200 select-none ${
                  darkMode 
                    ? isActive 
                      ? 'bg-zinc-800/60 border border-zinc-800 text-white' 
                      : 'border border-transparent hover:bg-zinc-900/40 hover:border-zinc-900 text-zinc-300'
                    : isActive 
                      ? 'bg-slate-100 border border-slate-200/60 text-slate-900 shadow-xs' 
                      : 'border border-transparent hover:bg-slate-50 hover:border-slate-100 text-slate-700'
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-emerald-500/10 to-indigo-500/10 dark:from-emerald-500/5 dark:to-indigo-500/5 flex items-center justify-center text-xl shadow-xs border dark:border-zinc-800/80 relative flex-shrink-0">
                  {persona.avatar}
                  {persona.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-bold text-xs truncate transition-colors ${
                      isActive ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-900 dark:text-zinc-200'
                    }`}>
                      {persona.name}
                    </h3>
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">
                      {lastMsg ? lastMsg.timestamp : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate ${
                      persona.unreadCount > 0 
                        ? 'font-semibold text-emerald-600 dark:text-emerald-400' 
                        : 'text-gray-400 dark:text-zinc-500'
                    }`}>
                      {lastMsg ? lastMsg.text : 'No messages yet'}
                    </p>
                    
                    {/* Badge */}
                    {persona.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold flex items-center justify-center min-w-[16px] shadow-sm shadow-emerald-500/20">
                        {persona.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
