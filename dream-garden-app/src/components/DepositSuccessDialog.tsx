import { useEffect } from "react";
import { TRANSACTION_STATUS_AUTO_CLOSE_DELAY } from "../constants";

interface DepositSuccessDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DepositSuccessDialog({ isOpen, onClose }: DepositSuccessDialogProps) {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, TRANSACTION_STATUS_AUTO_CLOSE_DELAY);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <main className="relative z-10 w-full max-w-md animate-[popIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
                <div className="relative bg-white dark:bg-[#2C241B] rounded-[48px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden border-4 border-white dark:border-[#3a3025]">
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="absolute top-6 right-6 z-50 p-2 text-text-main/40 hover:text-text-main hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-3xl font-bold">close</span>
                    </button>

                    {/* Decorative Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                        <div className="absolute top-8 left-8 text-modal-primary animate-[confetti-spin_5s_linear_infinite]">
                            <span className="material-symbols-outlined text-4xl">star</span>
                        </div>
                        <div className="absolute top-20 left-4 text-accent-blue transform rotate-45">
                            <div className="w-4 h-4 rounded-full bg-current"></div>
                        </div>
                        <div className="absolute top-6 right-10 text-accent-green animate-[confetti-spin_7s_linear_infinite]">
                            <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M12 2L15 22L2 9L22 9L9 22Z"></path></svg>
                        </div>
                        <div className="absolute top-24 right-6 text-modal-primary transform -rotate-12">
                            <div className="w-3 h-3 rounded-full bg-current"></div>
                        </div>
                        <div className="absolute bottom-32 left-10 text-[#FFD700] animate-[confetti-spin_6s_linear_infinite]">
                            <span className="material-symbols-outlined text-3xl">change_history</span>
                        </div>
                        <div className="absolute bottom-40 right-12 text-accent-blue opacity-50">
                            <div className="w-6 h-6 rounded-full border-4 border-current"></div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center p-8 pb-10 pt-12 text-center relative z-10 font-display">
                        {/* Animation Section */}
                        <div className="relative w-64 h-56 mb-6 flex items-center justify-center">
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 z-10 flex flex-col items-center">
                                <div className="relative mb-[-5px] animate-float">
                                    <div className="w-10 h-10 bg-[#FF6B6B] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"></div>
                                    <div className="w-16 h-16 flex items-center justify-center animate-[confetti-spin_4s_linear_infinite]">
                                        <div className="absolute w-5 h-16 bg-[#FFD93D] rounded-full rotate-0"></div>
                                        <div className="absolute w-5 h-16 bg-[#FFD93D] rounded-full rotate-45"></div>
                                        <div className="absolute w-5 h-16 bg-[#FFD93D] rounded-full rotate-90"></div>
                                        <div className="absolute w-5 h-16 bg-[#FFD93D] rounded-full rotate-135"></div>
                                    </div>
                                </div>
                                <div className="w-4 h-24 bg-accent-green rounded-full relative">
                                    <div className="absolute top-8 -left-6 w-8 h-4 bg-accent-green rounded-t-full rounded-bl-full transform -rotate-12"></div>
                                    <div className="absolute top-12 -right-6 w-8 h-4 bg-accent-green rounded-t-full rounded-br-full transform rotate-12"></div>
                                </div>
                                <div className="w-32 h-8 bg-[#8a7560] rounded-t-full mt-[-4px]"></div>
                            </div>

                            {/* Watering Can */}
                            <div className="absolute top-0 right-[-10px] transform -rotate-[25deg] z-20 animate-float" style={{ animationDelay: '0.5s' }}>
                                <div className="absolute top-2 -left-6 w-16 h-24 border-8 border-modal-primary rounded-l-3xl"></div>
                                <div className="absolute top-12 -left-8 w-16 h-4 bg-modal-primary transform -rotate-45 origin-right"></div>
                                <div className="relative w-28 h-28 bg-modal-primary rounded-2xl flex items-center justify-center shadow-lg">
                                    <div className="w-16 h-16 bg-white/20 rounded-full blur-sm"></div>
                                </div>
                                <div className="absolute top-[85px] -left-[35px] flex flex-col gap-2 z-0 transform rotate-[25deg]">
                                    <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDuration: '0.8s' }}></div>
                                    <div className="w-3 h-3 bg-accent-blue rounded-full animate-bounce" style={{ animationDuration: '0.9s', animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDuration: '0.7s', animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mb-8 max-w-[90%]">
                            <h1 className="text-4xl md:text-5xl font-black text-text-main dark:text-white tracking-tight leading-none uppercase drop-shadow-sm">
                                You Did It!
                            </h1>
                            <p className="text-lg text-[#8a7560] dark:text-[#bcaaa4] font-medium leading-snug">
                                Your Magic Drops are safely in the vault. Look at your dream grow!
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="group relative w-full max-w-[280px] h-16 bg-modal-primary hover:bg-modal-primary-dark transition-all duration-300 rounded-2xl shadow-[0_6px_0_0_theme(colors.modal-primary-dark)] active:shadow-none active:translate-y-[6px] flex items-center justify-center overflow-hidden"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-text-main font-bold text-2xl tracking-wide relative z-10 flex items-center gap-2">
                                Yay!
                                <span className="material-symbols-outlined text-3xl animate-bounce">celebration</span>
                            </span>
                        </button>
                    </div>
                </div>

                <div className="text-center mt-6 opacity-0 animate-[popIn_0.5s_0.5s_forwards]">
                    <p className="text-sm font-medium text-text-main/50 dark:text-white/50 cursor-pointer hover:text-text-main transition-colors">Tap anywhere outside to close</p>
                </div>
            </main>

            <style>{`
                @keyframes confetti-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes popIn {
                    0% { transform: scale(0.9); opacity: 0; }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
