
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Moon, Sun, MessageSquare, BookOpen, 
  Clock, MapPin, ChevronRight, Fingerprint, Sparkles, RefreshCw,
  Bell, Info
} from 'lucide-react';
import { RAMADAN_DATA, DUAS } from './constants';
import { getGeminiResponse } from './services/geminiService';
import { ChatMessage, RamadanDay } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'duas' | 'chat' | 'tasbeeh'>('calendar');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tasbeehCount, setTasbeehCount] = useState(0);
  const [dailyQuote, setDailyQuote] = useState("রমজান মোবারক! আপনার প্রতিটি রোজা কবুল হোক।");
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);

  // Live clock and date update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date and time in Bengali
  const formattedTime = currentDateTime.toLocaleTimeString('bn-BD', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = currentDateTime.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
  const formattedDay = currentDateTime.toLocaleDateString('bn-BD', { weekday: 'long' });

  // Detect which Ramadan Day it is (Assuming Ramadan 2025 starts March 1st)
  const currentRamadanDayIndex = useMemo(() => {
    const ramadanStart = new Date(2025, 2, 1); // March 1st, 2025
    const diffTime = currentDateTime.getTime() - ramadanStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
    
    if (diffDays >= 0 && diffDays < 30) {
      return diffDays;
    }
    return 0; // Default to Day 1 for demo or if outside range
  }, [currentDateTime]);

  const todayData = RAMADAN_DATA[currentRamadanDayIndex];

  // Calculate countdown to next event (Sehri or Iftar)
  const countdown = useMemo(() => {
    const parseTime = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(n => parseInt(n)); // Assumes Bengali digits might be an issue, but constants.tsx uses English digits internally or mapped
      // Convert Bengali digits to English for calculation if needed, but our constants use standard numbers
      const d = new Date(currentDateTime);
      d.setHours(parseInt(timeStr.split(':')[0]), parseInt(timeStr.split(':')[1]), 0);
      return d;
    };

    // Helper to convert Bengali numbers in strings like "০৫:০৬" to standard numbers "05:06"
    const bnToEn = (str: string) => str.replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d).toString());

    const sehriTime = parseTime(bnToEn(todayData.sehri));
    const iftarTime = parseTime(bnToEn(todayData.iftar));
    
    let target = iftarTime;
    let label = 'ইফতার';

    if (currentDateTime > iftarTime) {
      // Past iftar, countdown to next day's sehri
      const nextDay = RAMADAN_DATA[(currentRamadanDayIndex + 1) % 30];
      target = parseTime(bnToEn(nextDay.sehri));
      target.setDate(target.getDate() + 1);
      label = 'সেহরি';
    } else if (currentDateTime < sehriTime) {
      target = sehriTime;
      label = 'সেহরি';
    }

    const diff = target.getTime() - currentDateTime.getTime();
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      label,
      display: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    };
  }, [currentDateTime, todayData, currentRamadanDayIndex]);

  useEffect(() => {
    const fetchInspiration = async () => {
      setIsLoadingQuote(true);
      try {
        const quote = await getGeminiResponse("একটি ছোট ইসলামিক রমজান মোবারক স্ট্যাটাস বা উক্তি দিন। শুধুমাত্র একটি বাক্য দিবেন।");
        setDailyQuote(quote.trim());
      } catch (e) {
        setDailyQuote("রমজান মোবারক! আপনার ইবাদত কবুল হোক।");
      }
      setIsLoadingQuote(false);
    };
    fetchInspiration();
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const newMessages: ChatMessage[] = [...chatMessages, { role: 'user', text: userInput }];
    setChatMessages(newMessages);
    setUserInput('');
    setIsTyping(true);
    const response = await getGeminiResponse(userInput);
    setChatMessages([...newMessages, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  const incrementTasbeeh = () => {
    if ('vibrate' in navigator) navigator.vibrate(40);
    setTasbeehCount(prev => prev + 1);
  };

  // Fix: Added missing resetTasbeeh function to resolve reference error in the UI
  const resetTasbeeh = () => {
    setTasbeehCount(0);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F4] pb-24 md:pb-0 md:pl-24">
      {/* Top Professional Header */}
      <header className="ramadan-gradient text-white pt-8 pb-14 px-6 rounded-b-[50px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] opacity-10 blur-sm pointer-events-none">
          <Moon size={280} className="text-white fill-white" />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="bg-yellow-400 p-2 rounded-xl text-emerald-900 shadow-lg animate-pulse">
                  <Sparkles size={20} />
                </div>
                <h1 className="text-3xl font-black tracking-tight">রমজান ক্যালেন্ডার ২০২৫</h1>
              </div>
              <p className="text-emerald-100 flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-yellow-400" /> ঢাকা, বাংলাদেশ (মান সময়)
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-right min-w-[200px]">
              <div className="text-2xl font-mono font-bold tracking-widest">{formattedTime}</div>
              <div className="text-xs font-medium text-emerald-200 mt-1">{formattedDate} • {formattedDay}</div>
            </div>
          </div>

          {/* Today's Status Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            <div className="md:col-span-4 bg-white text-emerald-900 rounded-[32px] p-6 shadow-xl flex flex-col justify-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">পরবর্তী {countdown.label} বাকি</span>
              <div className="text-5xl font-black font-mono tracking-tighter text-emerald-600 mb-2">
                {countdown.display}
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="md:col-span-8 flex flex-col gap-4">
              <div className="bg-black/20 backdrop-blur-md rounded-[28px] p-5 border border-white/10 flex items-center gap-5">
                <div className="text-center bg-white/10 px-4 py-2 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-bold text-emerald-200 uppercase mb-1">আজকের রোজা</p>
                  <p className="text-2xl font-black text-white">{todayData.day} রমজান</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-emerald-100/70 font-medium mb-1 flex items-center gap-1">
                    <Info size={12} /> এআই অনুপ্রেরণা
                  </p>
                  <p className="text-sm md:text-base font-semibold italic text-white leading-tight">
                    "{isLoadingQuote ? "লোড হচ্ছে..." : dailyQuote}"
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                  <div className="bg-orange-500/20 p-2 rounded-lg"><Sun size={20} className="text-orange-400" /></div>
                  <div>
                    <p className="text-[10px] text-emerald-200 font-bold uppercase">সেহরি শেষ</p>
                    <p className="text-xl font-black text-white">{todayData.sehri}</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                  <div className="bg-emerald-500/20 p-2 rounded-lg"><Moon size={20} className="text-emerald-400" /></div>
                  <div>
                    <p className="text-[10px] text-emerald-200 font-bold uppercase">ইফতার শুরু</p>
                    <p className="text-xl font-black text-white">{todayData.iftar}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="max-w-5xl mx-auto p-4 -mt-6 relative z-20">
        {activeTab === 'calendar' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-black text-emerald-950 flex items-center gap-2">
                <Calendar className="text-emerald-600" /> পূর্ণাঙ্গ রমজান সিডিউল
              </h2>
              <div className="flex gap-2">
                 <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-emerald-700 shadow-sm border border-emerald-100">ঢাকা</span>
                 <span className="bg-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm">২০২৫</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {RAMADAN_DATA.map((item) => (
                <div 
                  key={item.day} 
                  className={`group relative p-5 rounded-[28px] transition-all duration-300 border ${
                    item.day === todayData.day 
                    ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-200 border-emerald-500 scale-105 z-10' 
                    : 'bg-white text-emerald-950 border-gray-100 hover:border-emerald-200 hover:shadow-xl hover:translate-y-[-4px]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${item.day === todayData.day ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'}`}>
                      {item.day}
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] font-black uppercase ${item.day === todayData.day ? 'text-emerald-100' : 'text-gray-400'}`}>
                        {item.weekday}
                      </p>
                      <p className={`text-xs font-bold ${item.day === todayData.day ? 'text-white' : 'text-gray-600'}`}>
                        {item.date}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-2xl ${item.day === todayData.day ? 'bg-black/10' : 'bg-orange-50/50'}`}>
                      <p className={`text-[9px] font-bold mb-1 ${item.day === todayData.day ? 'text-emerald-100' : 'text-orange-600'}`}>সেহরি</p>
                      <p className="text-base font-black">{item.sehri}</p>
                    </div>
                    <div className={`p-3 rounded-2xl ${item.day === todayData.day ? 'bg-black/10' : 'bg-emerald-50/50'}`}>
                      <p className={`text-[9px] font-bold mb-1 ${item.day === todayData.day ? 'text-emerald-100' : 'text-emerald-600'}`}>ইফতার</p>
                      <p className="text-base font-black">{item.iftar}</p>
                    </div>
                  </div>

                  {item.day === todayData.day && (
                    <div className="mt-3 text-center">
                      <span className="text-[10px] font-black bg-yellow-400 text-emerald-900 px-3 py-1 rounded-full shadow-sm">আজকের রোজা</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'duas' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-emerald-950 px-2 flex items-center gap-2">
              <BookOpen className="text-emerald-600" /> জরুরি দোয়া ও আমল
            </h2>
            {DUAS.map((dua, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[40px] shadow-xl border border-emerald-50 relative overflow-hidden">
                <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-emerald-50 rounded-full opacity-50 blur-xl"></div>
                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                    <BookOpen size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-emerald-900">{dua.title}</h3>
                </div>
                
                <div className="bg-[#F8FAF8] p-8 rounded-3xl mb-8 border border-emerald-100 relative group">
                  <p className="text-4xl text-right font-serif text-emerald-950 leading-[1.8] tracking-wide" style={{direction: 'rtl'}}>
                    {dua.arabic}
                  </p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-emerald-400 hover:text-emerald-600"><RefreshCw size={16} /></button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-5 rounded-2xl border border-gray-50 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">উচ্চারণ</p>
                    </div>
                    <p className="text-gray-800 font-medium leading-relaxed">{dua.transliteration}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-50 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <p className="text-xs font-black text-orange-600 uppercase tracking-widest">বাংলা অর্থ</p>
                    </div>
                    <p className="text-gray-800 leading-relaxed italic">{dua.translation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-[calc(100vh-340px)] md:h-[680px] bg-white rounded-[40px] shadow-2xl overflow-hidden border border-emerald-50 max-w-4xl mx-auto">
            <div className="bg-emerald-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <h3 className="font-black text-xl">রমজান এআই গাইড</h3>
                  <p className="text-xs text-emerald-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span> এআই এখন সক্রিয় আছে
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-12 opacity-60">
                  <div className="bg-emerald-100 p-8 rounded-full mb-6">
                    <Sparkles size={60} className="text-emerald-500" />
                  </div>
                  <h4 className="font-black text-emerald-900 text-xl mb-3">আসসালামু আলাইকুম!</h4>
                  <p className="text-sm text-emerald-800 max-w-md">আমি আপনার ব্যক্তিগত রমজান এআই অ্যাসিস্ট্যান্ট। রোজা, আমল, দোয়া বা স্বাস্থ্য পরামর্শ নিয়ে যেকোনো প্রশ্ন করতে পারেন।</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[80%] p-5 rounded-[28px] text-sm shadow-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-100' 
                    : 'bg-white text-emerald-950 rounded-tl-none border border-emerald-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-5 rounded-[28px] rounded-tl-none border border-emerald-100">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 bg-white border-t border-emerald-50">
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded-[24px] border border-gray-200 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="রোজা বা আমল সম্পর্কে প্রশ্ন করুন..."
                  className="flex-1 bg-transparent px-5 py-3 outline-none text-emerald-950 text-sm font-medium"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isTyping}
                  className="bg-emerald-600 text-white w-12 h-12 rounded-[18px] flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg active:scale-95"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasbeeh' && (
          <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in-95 duration-700 max-w-md mx-auto">
            <div className="bg-white p-12 rounded-[60px] shadow-2xl border border-emerald-50 w-full text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
               <h2 className="text-2xl font-black text-emerald-900 mb-10 tracking-tight flex items-center justify-center gap-2">
                 <Fingerprint className="text-emerald-600" /> ডিজিটাল তসবিহ
               </h2>
              
              <div className="bg-emerald-50 p-10 rounded-[45px] mb-12 border border-emerald-100 relative shadow-inner">
                <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-black absolute top-5 left-0 right-0">মোট জিকির</p>
                <div className="text-8xl font-mono font-black text-emerald-900 tracking-tighter">
                  {tasbeehCount.toString().padStart(3, '0')}
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <button
                  onClick={incrementTasbeeh}
                  className="w-48 h-48 bg-emerald-600 rounded-full mx-auto flex items-center justify-center text-white shadow-[0_20px_50px_rgba(5,150,105,0.3)] hover:bg-emerald-700 active:scale-90 transition-all border-[10px] border-white ring-1 ring-emerald-100 group"
                >
                  <Fingerprint size={80} className="group-active:scale-110 transition-transform" />
                </button>
                
                <div className="flex justify-center">
                  <button
                    onClick={resetTasbeeh}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-50 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm border border-gray-100"
                  >
                    <RefreshCw size={14} /> রিসেট
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navigation (Optimized for both Mobile/Desktop) */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-2xl border border-white/20 px-6 py-4 rounded-[40px] flex justify-around items-center md:hidden z-50 shadow-2xl">
        {[
          { id: 'calendar', icon: Calendar, label: 'সিডিউল' },
          { id: 'duas', icon: BookOpen, label: 'দোয়া' },
          { id: 'chat', icon: MessageSquare, label: 'জিজ্ঞাসা' },
          { id: 'tasbeeh', icon: Fingerprint, label: 'তসবিহ' },
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center gap-1.5 transition-all p-2 rounded-2xl ${
              activeTab === item.id 
              ? 'text-emerald-600' 
              : 'text-gray-400 hover:text-emerald-500'
            }`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white shadow-lg' : ''}`}>
               <item.icon size={24} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${activeTab === item.id ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Side Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-24 bg-emerald-950 flex-col items-center py-12 gap-10 z-50">
        <div className="mb-10 p-2 bg-yellow-400 rounded-2xl shadow-lg shadow-yellow-400/20">
          <Moon size={32} className="text-emerald-950 fill-emerald-950" />
        </div>
        {[
          { id: 'calendar', icon: Calendar, title: 'সিডিউল' },
          { id: 'duas', icon: BookOpen, title: 'দোয়া' },
          { id: 'chat', icon: MessageSquare, title: 'জিজ্ঞাসা' },
          { id: 'tasbeeh', icon: Fingerprint, title: 'তসবিহ' },
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`group p-5 rounded-[24px] transition-all relative ${
              activeTab === item.id 
              ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-900/50 scale-110' 
              : 'text-emerald-100/30 hover:text-emerald-100 hover:bg-emerald-900/50'
            }`}
          >
            <item.icon size={28} />
            <span className="absolute left-full ml-6 px-3 py-1.5 bg-emerald-900 text-white text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-[60] shadow-xl border border-emerald-800">
              {item.title}
            </span>
            {activeTab === item.id && (
              <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-yellow-400 rounded-full"></div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
