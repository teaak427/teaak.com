import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  User,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Headphones
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  type?: 'text' | 'image' | 'file';
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Xin chào ${user?.name}! 👋 Tôi là Minh - chuyên viên hỗ trợ của Fremed. Tôi có thể giúp gì cho bạn hôm nay?`,
      sender: 'support',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Auto response with typing indicator
    setTimeout(() => {
      setIsTyping(false);
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutoResponse(newMessage),
        sender: 'support',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, supportResponse]);
    }, 1500);
  };

  const getAutoResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('giá') || message.includes('price')) {
      return 'Bạn có thể xem giá sản phẩm trong danh sách hoặc gọi hotline 1800-1234 để được tư vấn chi tiết. 💰';
    }
    
    if (message.includes('đặt hàng') || message.includes('order')) {
      return 'Để đặt hàng, bạn có thể thêm sản phẩm vào giỏ hàng và tạo đơn hàng ngay trong hệ thống. Tôi có thể hướng dẫn bạn chi tiết! 📦';
    }
    
    if (message.includes('giao hàng') || message.includes('delivery')) {
      return 'Thời gian giao hàng từ 1-3 ngày làm việc tùy theo khu vực. Chúng tôi có dịch vụ giao hàng nhanh trong ngày cho khu vực nội thành! 🚚';
    }

    if (message.includes('khuyến mãi') || message.includes('promotion')) {
      return 'Hiện tại chúng tôi có nhiều chương trình khuyến mãi hấp dẫn! Bạn có thể xem trong mục "Khuyến mãi" để cập nhật ưu đãi mới nhất. 🎉';
    }
    
    return 'Cảm ơn bạn đã liên hệ! Tôi đã ghi nhận yêu cầu và sẽ hỗ trợ bạn ngay. Bạn có thể gọi hotline 1800-1234 để được tư vấn trực tiếp. 😊';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickReplies = [
    '💰 Hỏi về giá',
    '📦 Đặt hàng',
    '🚚 Giao hàng',
    '🎉 Khuyến mãi'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 ${
        isMinimized 
          ? 'w-80 h-14' 
          : 'w-80 lg:w-96 h-96 lg:h-[500px]'
      }`}>
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-[#007744] to-[#00aa55] text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Headphones size={18} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <p className="font-semibold text-sm">Hỗ trợ trực tuyến</p>
              <div className="flex items-center space-x-1 text-xs text-green-100">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <span>Minh - Chuyên viên hỗ trợ</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              <Phone size={16} />
            </button>
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              <Video size={16} />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Enhanced Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto h-64 lg:h-80">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    {message.sender === 'support' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-6 h-6 bg-[#007744] rounded-full flex items-center justify-center">
                          <User size={12} className="text-white" />
                        </div>
                        <span className="text-xs text-gray-500">Minh</span>
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-[#007744] to-[#00aa55] text-white'
                        : 'bg-gray-100 text-gray-900 border border-gray-200'
                    }`}>
                      <p className="leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-green-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 bg-[#007744] rounded-full flex items-center justify-center">
                      <User size={12} className="text-white" />
                    </div>
                    <span className="text-xs text-gray-500">Minh đang nhập...</span>
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Câu hỏi thường gặp:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => setNewMessage(reply)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 focus-within:border-[#007744] focus-within:ring-2 focus-within:ring-[#007744] focus-within:ring-opacity-20 transition-all">
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Paperclip size={18} />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-sm placeholder-gray-500"
                />
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Smile size={18} />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="w-8 h-8 bg-gradient-to-r from-[#007744] to-[#00aa55] text-white rounded-full flex items-center justify-center hover:from-[#006633] hover:to-[#009944] transition-all duration-300 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
                >
                  <Send size={14} />
                </button>
              </div>
              
              {/* Status */}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Trực tuyến • Phản hồi trong vài giây</span>
                </div>
                <span>Powered by Fremed</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveChat;