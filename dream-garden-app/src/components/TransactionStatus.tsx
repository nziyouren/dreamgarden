import React, { useEffect, useState } from 'react';
import { TRANSACTION_STATUS_AUTO_CLOSE_DELAY } from '../constants';

export type TransactionStatusType = 'idle' | 'pending' | 'success' | 'error';

interface TransactionStatusProps {
    status: TransactionStatusType;
    title?: string;
    message?: string;
    error?: string;
    onClose?: () => void;
    autoCloseDelay?: number;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
    status,
    title,
    message,
    error,
    onClose,
    autoCloseDelay = TRANSACTION_STATUS_AUTO_CLOSE_DELAY,
}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (status !== 'idle') {
            setVisible(true);
        }
    }, [status]);

    useEffect(() => {
        if (status === 'success') {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
        if ((status === 'success' || status === 'error') && autoCloseDelay > 0) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, autoCloseDelay);
            return () => clearTimeout(timer);
        }
    }, [status, autoCloseDelay, onClose]);

    if (!visible || status === 'idle') return null;

    return (
        <div className="fixed top-[100px] right-8 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none max-w-[calc(100vw-4rem)] sm:max-w-md">
            <div className={`
        flex items-center gap-2.5 px-4 py-2.5 rounded-3xl border shadow-xl backdrop-blur-md transition-all duration-300 pointer-events-auto w-full
        ${status === 'error'
                    ? 'bg-[#FFF5F5]/90 border-[#FFE0E0] text-[#C53030]'
                    : 'bg-[#F0FFF4]/90 border-[#D1FAE5] text-[#1A202C]'
                }
      `}>
                {/* Icon Area */}
                <div className="relative">
                    {status === 'pending' && (
                        <div className="size-9 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center relative shadow-sm border border-green-100">
                            <div className="absolute inset-0 rounded-full border-[2px] border-green-100 border-t-primary animate-spin"></div>
                            <span className="material-symbols-outlined text-primary text-xl">local_florist</span>
                            <div className="absolute -top-0.5 -right-0.5">
                                <span className="material-symbols-outlined text-yellow-400 text-[9px] animate-pulse">star</span>
                            </div>
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="relative">
                            <div className="size-9 rounded-full bg-[#D1FAE5] flex items-center justify-center text-primary relative z-10 shadow-sm border border-green-200">
                                <span className="material-symbols-outlined text-[22px] font-black">check</span>
                            </div>
                            <Fireworks />
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="size-9 rounded-full bg-[#FED7D7] flex items-center justify-center text-[#E53E3E] shadow-sm border border-red-200">
                            <span className="material-symbols-outlined text-[22px] font-black">priority_high</span>
                        </div>
                    )}
                </div>

                {/* Text Area */}
                <div className="flex flex-col pr-1.5 min-w-[125px] overflow-hidden">
                    <h4 className="font-black text-[15px] leading-tight shrink-0">
                        {title || (status === 'pending' ? 'Processing...' : status === 'success' ? 'Success!' : 'Oops!')}
                    </h4>
                    <p className={`
            text-[9px] font-bold tracking-wide uppercase opacity-70 break-all
            ${status === 'error' ? 'text-[#E53E3E]' : 'text-primary'}
          `}>
                        {status === 'error' ? (error || 'Failed') : (message || (status === 'pending' ? 'Confirming...' : 'Wait a moment'))}
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => { setVisible(false); if (onClose) onClose(); }}
                    className="p-1 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center opacity-40 hover:opacity-100"
                >
                    <span className="material-symbols-outlined text-sm">close</span>
                </button>
            </div>
        </div>
    );
};

const Fireworks = () => {
    const particles = Array.from({ length: 24 });
    const COLORS = ['#FF0000', '#00FF00', '#4299E1', '#F6E05E', '#FF00FF', '#00FFFF', '#FFA500', '#800080'];

    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            {particles.map((_, i) => {
                const type = i % 3; // 0: star, 1: circle, 2: triangle
                const angle = (i * 360) / 24;
                const distance = 60 + Math.random() * 80;

                return (
                    <div
                        key={i}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-firework"
                        style={{
                            '--angle': `${angle}deg`,
                            '--distance': `${distance}px`,
                            '--delay': `${Math.random() * 0.4}s`,
                            '--color': COLORS[i % COLORS.length],
                            animationDelay: 'var(--delay)'
                        } as any}
                    >
                        {type === 0 && (
                            <span className="material-symbols-outlined text-[14px]" style={{ color: 'var(--color)' }}>star</span>
                        )}
                        {type === 1 && (
                            <div className="size-2 rounded-full" style={{ backgroundColor: 'var(--color)' }}></div>
                        )}
                        {type === 2 && (
                            <div
                                className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[9px]"
                                style={{ borderBottomColor: 'var(--color)' }}
                            ></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};


