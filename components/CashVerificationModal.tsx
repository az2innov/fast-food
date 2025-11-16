
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface CashVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
}

const CORRECT_CODE = '1001';

export const CashVerificationModal: React.FC<CashVerificationModalProps> = ({ isOpen, onClose, onVerify }) => {
  const { t } = useLanguage();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerifyClick = () => {
    if (code === CORRECT_CODE) {
      setError('');
      onVerify();
    } else {
      setError(t('checkout.verification.errorCode'));
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and limit length
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 4) {
        setCode(value);
    }
    if (error) {
        setError('');
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm transform transition-all" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-center mb-2">{t('checkout.verification.title')}</h2>
        <p className="text-center text-gray-600 mb-4">{t('checkout.verification.message')}</p>
        <input
          type="tel"
          value={code}
          onChange={handleInputChange}
          placeholder="----"
          maxLength={4}
          className={`w-full p-3 border rounded-md text-center tracking-[1rem] font-bold text-2xl ${error ? 'border-red-500 animate-shake' : 'border-gray-300'}`}
          style={{ animation: error ? 'shake 0.5s' : 'none' }}
        />
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">{t('checkout.verification.cancel')}</button>
          <button onClick={handleVerifyClick} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-semibold">{t('checkout.verification.confirm')}</button>
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};
