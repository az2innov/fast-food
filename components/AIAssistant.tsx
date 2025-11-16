import React, { useState, useRef, useEffect } from 'react';
import { getAIAssistantResponse } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { MenuItem } from '../types';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface AIAssistantProps {
  menu: MenuItem[];
}

const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

export const AIAssistant: React.FC<AIAssistantProps> = ({ menu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Fix: Get language from context to pass to AI service.
  const { t, language } = useLanguage();
  const chatBoxRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if(isOpen && messages.length === 0) {
        setMessages([{ sender: 'ai', text: t('ai.greeting') }]);
    }
  }, [isOpen, messages, t]);

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: Message = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Fix: Pass language to AI assistant to ensure it has the correct context.
      const aiResponse = await getAIAssistantResponse(userInput, menu, t, language);
      const newAiMessage: Message = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, newAiMessage]);
    } catch (error) {
      const errorMessage: Message = { sender: 'ai', text: 'An error occurred. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform transform hover:scale-110"
        >
          {isOpen ? (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.425v-2.287a6.75 6.75 0 0 1-.61-3.483c0-3.726 3.024-6.75 6.75-6.75S21 8.274 21 12Z" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-5 w-full max-w-sm h-[60vh] bg-white rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden border">
          <header className="bg-blue-600 text-white p-4 font-bold text-center">
            {t('ai.assistant')}
          </header>
          <div ref={chatBoxRef} className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <ChatBubble key={index} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none p-2">
                      <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      </div>
                  </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSendMessage} className="p-2 border-t flex">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={t('ai.placeholder')}
              className="flex-1 p-2 border rounded-l-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isLoading}
            />
            <button type="submit" className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};
