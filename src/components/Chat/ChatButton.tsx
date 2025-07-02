import React, { useState } from 'react';
import { MessageCircle, Headphones, Zap } from 'lucide-react';
import LiveChat from './LiveChat';

const ChatButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Enhanced Chat Button */}
      {!isChatOpen && (
        <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40">
          {/* Floating animation rings */}
          <div className="absolute inset-0 rounded-full bg-[#007744] opacity-20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-[#007744] opacity-30 animate-pulse"></div>
          
          <button
            onClick={() => setIsChatOpen(true)}
            className="relative w-14 h-14 bg-gradient-to-r from-[#007744] to-[#00aa55] text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center hover:scale-110 transform group"
          >
            <div className="relative">
              <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
              
              {/* Online indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Tooltip */}
            <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              <div className="flex items-center space-x-2">
                <Headphones size={14} />
                <span>Hỗ trợ trực tuyến</span>
              </div>
              <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
            </div>
          </button>

          {/* Quick action badge */}
          <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-bounce">
            <div className="flex items-center space-x-1">
              <Zap size={10} />
              <span>Live</span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Live Chat Component */}
      <LiveChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
};

export default ChatButton;