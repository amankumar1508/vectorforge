import React, { useState } from 'react';
import { mockPersonas } from './mockData';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import StyleDashboard from './components/StyleDashboard';
import { Sun, Moon, Sparkles, MessageSquareCode } from 'lucide-react';

export default function App() {
  const [personas, setPersonas] = useState(mockPersonas);
  const [activePersonaId, setActivePersonaId] = useState('clone');
  const [darkMode, setDarkMode] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeMobileView, setActiveMobileView] = useState('list'); // 'list' | 'chat' | 'dashboard'

  const activePersona = personas.find((p) => p.id === activePersonaId);

  const handleSelectPersona = (id) => {
    setActivePersonaId(id);
    setActiveMobileView('chat');
    
    // Clear unread count when clicking a chat
    setPersonas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, unreadCount: 0 } : p))
    );
  };

  const handleSendMessage = (text) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // 1. Add user's message
    const userMessage = {
      id: Date.now(),
      sender: 'me',
      text,
      timestamp,
      status: 'read'
    };

    const updatedHistory = [...activePersona.chatHistory, userMessage];

    setPersonas((prev) =>
      prev.map((p) => {
        if (p.id === activePersonaId) {
          return {
            ...p,
            chatHistory: updatedHistory
          };
        }
        return p;
      })
    );

    // 2. Trigger typing status
    setPersonas((prev) =>
      prev.map((p) => (p.id === activePersonaId ? { ...p, status: 'typing' } : p))
    );

    // 3. Request LLM response from the backend
    fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: updatedHistory,
        styleProfile: activePersona.styleProfile,
        personaId: activePersonaId
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to generate clone response');
        return res.json();
      })
      .then(data => {
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'them',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        };

        setPersonas((prev) =>
          prev.map((p) => {
            if (p.id === activePersonaId) {
              return {
                ...p,
                status: 'online',
                chatHistory: [...p.chatHistory, aiMessage]
              };
            }
            return p;
          })
        );
      })
      .catch(err => {
        console.warn('API call failed, falling back to local simulation:', err.message);
        setTimeout(() => {
          let aiText = 'Offline clone response loaded.';
          const lowerText = text.toLowerCase();
          if (activePersonaId === 'clone') {
            if (lowerText.includes('hello') || lowerText.includes('hey') || lowerText.includes('hi')) {
              aiText = 'hey! literally just looking over some code, what is up? 🚀';
            } else if (lowerText.includes('how') || lowerText.includes('work')) {
              aiText = 'it makes total sense, we just load the parser service, compile style markers, and prompt llama 3.2 directly. let\'s go 😂';
            } else {
              aiText = 'solid point. awesome. let\'s try compiling the chat files next or check the logs 🔥';
            }
          } else if (activePersonaId === 'sarah') {
            aiText = 'The designs are finalized. I made sure to double-check the spacing and color alignments for accessibility guidelines. 🙏';
          } else if (activePersonaId === 'mom') {
            aiText = 'Okay dear!! Take care and drive slowly!! ❤️ Call me when you are home! 😘🌸';
          } else if (activePersonaId === 'alex') {
            aiText = 'lgtm, rebase done. test compile ok 👍';
          }

          const aiMessage = {
            id: Date.now() + 1,
            sender: 'them',
            text: aiText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read'
          };

          setPersonas((prev) =>
            prev.map((p) => {
              if (p.id === activePersonaId) {
                return {
                  ...p,
                  status: 'online',
                  chatHistory: [...p.chatHistory, aiMessage]
                };
              }
              return p;
            })
          );
        }, 1000);
      });
  };

  const handleImportChat = (fileName, parsedStyleProfile) => {
    setPersonas((prev) =>
      prev.map((p) => {
        if (p.id === 'clone') {
          return {
            ...p,
            name: "My Digital Clone (Retrained)",
            styleProfile: parsedStyleProfile || p.styleProfile,
            chatHistory: [
              ...p.chatHistory,
              {
                id: Date.now(),
                sender: 'them',
                text: `🤖 Clone re-trained successfully using "${fileName}" export. Accuracy match score upgraded to 99%! Ready to test.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'read'
              }
            ]
          };
        }
        return p;
      })
    );
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors ${darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Application Bar */}
      <header className={`px-5 py-3 flex items-center justify-between border-b shadow-xs z-20 ${
        darkMode ? 'bg-zinc-900 border-zinc-800/80 text-white' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <MessageSquareCode size={18} />
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight m-0 select-none flex items-center gap-1.5 leading-none">
              Ditto <span className="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">Workspace</span>
            </h1>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5 font-medium leading-none">Digital Clone Studio v1.0.0</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg cursor-pointer transition-colors border ${
              darkMode 
                ? 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 hover:text-amber-400 text-amber-400/80' 
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:text-sky-600 text-sky-600/80'
            }`}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Chat thread list */}
        <div className={`${activeMobileView === 'list' ? 'flex' : 'hidden'} md:flex w-full md:w-80 lg:w-96 flex-shrink-0`}>
          <Sidebar
            personas={personas}
            activePersonaId={activePersonaId}
            onSelectPersona={handleSelectPersona}
            darkMode={darkMode}
          />
        </div>

        {/* Center: Live Chat conversation pane */}
        <div className={`${activeMobileView === 'chat' ? 'flex' : 'hidden'} md:flex flex-1 relative overflow-hidden`}>
          <ChatWindow
            persona={activePersona}
            onSendMessage={handleSendMessage}
            darkMode={darkMode}
            showDashboard={showDashboard}
            onToggleDashboard={() => {
              const nextState = !showDashboard;
              setShowDashboard(nextState);
              if (nextState) {
                setActiveMobileView('dashboard');
              }
            }}
            activeMobileView={activeMobileView}
            setActiveMobileView={setActiveMobileView}
          />
        </div>

        {/* Right / Overlay: Style dashboard / parser dropzone */}
        <div className={`
          ${activeMobileView === 'dashboard' ? 'flex w-full absolute inset-0 z-30' : 'hidden'}
          md:absolute md:top-0 md:right-0 md:bottom-0 md:z-30 md:w-96
          lg:static lg:w-80 xl:w-96 lg:z-10
          ${showDashboard 
            ? 'md:flex md:translate-x-0' 
            : 'md:flex md:translate-x-full lg:translate-x-0 lg:w-0 lg:hidden'
          }
          border-l border-zinc-250 dark:border-zinc-800/85
          shadow-2xl lg:shadow-none
          drawer-transition
        `}>
          <StyleDashboard
            persona={activePersona}
            onImportChat={handleImportChat}
            darkMode={darkMode}
            onCloseDashboard={() => {
              setShowDashboard(false);
              setActiveMobileView('chat');
            }}
          />
        </div>

        {/* Backdrop for tablet/mobile drawer view */}
        {showDashboard && activeMobileView !== 'list' && (
          <div 
            onClick={() => {
              setShowDashboard(false);
              setActiveMobileView('chat');
            }}
            className="fixed md:absolute inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          />
        )}
      </div>
    </div>
  );
}
