import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Battery, 
  Smartphone, 
  Tablet, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun,
  Shield,
  Sparkles,
  Zap,
  Radio
} from 'lucide-react';

interface AndroidFrameProps {
  deviceMode: 'mobile' | 'tablet' | 'fullscreen';
  onChangeDeviceMode: (mode: 'mobile' | 'tablet' | 'fullscreen') => void;
  children: React.ReactNode;
  activeProjectName: string;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  deviceMode,
  onChangeDeviceMode,
  children,
  activeProjectName,
}) => {
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* Outer Device Mockup Container if in mobile or tablet mode */}
      <div
        className={`flex flex-col bg-slate-900 border-slate-700 transition-all duration-300 relative shadow-2xl ${
          deviceMode === 'mobile'
            ? 'w-[420px] h-[92vh] max-h-[880px] rounded-[48px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden ring-4 ring-amber-500/10'
            : deviceMode === 'tablet'
            ? 'w-[95vw] max-w-[1200px] h-[92vh] max-h-[880px] rounded-[36px] border-[8px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden ring-4 ring-amber-500/10'
            : 'w-full h-full rounded-none border-0'
        }`}
      >
        {/* Android 15 Material 3 Status Bar */}
        <div className="h-7 bg-slate-950 text-slate-400 px-5 flex items-center justify-between text-[11px] font-medium shrink-0 border-b border-slate-900/60 z-30">
          {/* Time & Android notification icons */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200 tracking-tight">{time}</span>
            <div className="flex items-center space-x-1.5 opacity-80 text-[10px]">
              <span className="text-amber-400 text-xs">💡</span>
              <span className="text-emerald-400 text-[9px] font-mono font-bold">LAN</span>
              <span className="text-indigo-400 text-[9px] font-mono font-bold">SQL</span>
            </div>
          </div>

          {/* Android Notch / Dynamic Island */}
          {deviceMode !== 'fullscreen' && (
            <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-slate-950 rounded-full border border-slate-800" />
            </div>
          )}

          {/* Right Status Icons (5G, Wi-Fi 6, Battery 98%) */}
          <div className="flex items-center space-x-2 text-slate-300">
            <div className="flex items-center space-x-0.5 text-[9px] font-bold text-slate-400">
              <span>5G</span>
            </div>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <div className="flex items-center space-x-1">
              <span className="text-[10px] font-mono font-bold text-slate-300">98%</span>
              <Battery className="w-3.5 h-3.5 text-slate-200" />
            </div>
          </div>
        </div>

        {/* Inner App Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Android Gesture Navigation Bar Pill */}
        <div className="h-4 bg-slate-950 flex items-center justify-center shrink-0 border-t border-slate-900 z-30">
          <div className="w-28 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
