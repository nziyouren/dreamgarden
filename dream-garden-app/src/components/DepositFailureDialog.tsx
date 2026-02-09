import { useEffect } from "react";
import { TRANSACTION_STATUS_AUTO_CLOSE_DELAY } from "../constants";

interface DepositFailureDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onTryAgain: () => void;
    error?: string;
}

export function DepositFailureDialog({ isOpen, onClose, onTryAgain, error }: DepositFailureDialogProps) {
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
            <div className="relative w-full max-w-[420px] flex flex-col bg-white dark:bg-[#2c241b] rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all animate-[popIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-full text-stone-600 dark:text-stone-300 transition-all duration-200 hover:scale-110 active:scale-95"
                >
                    <span className="material-symbols-outlined text-[24px] font-bold">close</span>
                </button>

                <div className="relative w-full aspect-[4/3] flex items-center justify-center pt-12">
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        {/* Cloud with Rain */}
                        <div className="w-[120px] h-[50px] bg-[#90a4ae] rounded-[50px] relative mb-10 before:content-[''] before:absolute before:w-[60px] before:h-[60px] before:bg-[#90a4ae] before:rounded-full before:-top-[30px] before:left-[20px] after:content-[''] after:absolute after:w-[45px] after:height-[45px] after:bg-[#90a4ae] after:rounded-full after:-top-[20px] after:right-[15px]">
                            <div className="w-2 h-4 bg-[#4fc3f7] rounded-[4px] absolute top-[60px] left-[20px] animate-bounce" style={{ animationDuration: '1.2s' }}></div>
                            <div className="w-2 h-4 bg-[#4fc3f7] rounded-[4px] absolute top-[85px] left-[55px] animate-bounce" style={{ animationDuration: '1s', animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-4 bg-[#4fc3f7] rounded-[4px] absolute top-[65px] left-[90px] animate-bounce" style={{ animationDuration: '1.4s', animationDelay: '0.4s' }}></div>
                        </div>
                        {/* Sad Sprout and Soil */}
                        <div className="relative flex flex-col items-center opacity-70">
                            <div className="w-6 h-9 bg-[#7cb342] rounded-[50%_50%_50%_50%/_60%_60%_40%_40%] absolute bottom-[60px] -rotate-15 -translate-x-3"></div>
                            <div className="w-6 h-9 bg-[#7cb342] rounded-[50%_50%_50%_50%/_60%_60%_40%_40%] absolute bottom-[60px] rotate-15 translate-x-3"></div>
                            <div className="w-[140px] h-[70px] bg-[#8d6e63] rounded-[70px_70px_0_0] relative"></div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center px-8 pt-6 pb-8 text-center font-display">
                    <h2 className="text-3xl font-extrabold tracking-tight text-[#181411] dark:text-white mb-3">
                        Oops! The magic failed...
                    </h2>
                    <p className="text-base text-stone-500 dark:text-stone-300 font-medium leading-relaxed mb-4 max-w-[320px]">
                        Something went wrong and your gold didn't move. Don't worry, you can try watering again!
                    </p>
                    {error && (
                        <p className="text-xs text-red-400 dark:text-red-400/80 font-mono mb-6 max-w-[320px] break-words bg-red-50 dark:bg-red-900/10 p-2 rounded-lg border border-red-100 dark:border-red-900/20">
                            Error: {error}
                        </p>
                    )}

                    <div className="w-full flex flex-col gap-3">
                        <button
                            onClick={onTryAgain}
                            className="group relative w-full h-14 bg-modal-primary hover:bg-modal-primary-dark active:translate-y-[2px] active:shadow-none transition-all duration-150 flex items-center justify-center rounded-2xl shadow-[0_6px_0_0_theme(colors.modal-primary-dark)] overflow-hidden"
                        >
                            <div className="flex items-center gap-2 relative z-10 font-display">
                                <span className="material-symbols-outlined text-white text-[28px] font-bold drop-shadow-sm">water_drop</span>
                                <span className="text-white text-[1.15rem] font-extrabold tracking-wide drop-shadow-sm">Try Again</span>
                            </div>
                            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_0_0_rgba(255,255,255,0.2)] pointer-events-none"></div>
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full h-14 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 active:scale-95 transition-all duration-200 flex items-center justify-center rounded-2xl text-stone-600 dark:text-stone-300 font-extrabold text-[1.1rem] tracking-wide"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 absolute bottom-10 left-1/2 -translate-x-1/2">
                <a className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500 hover:text-primary transition-colors text-sm font-semibold" href="#">
                    <span className="material-symbols-outlined text-[18px]">help</span>
                    <span>Need help from a grown-up?</span>
                </a>
            </div>

            <style>{`
                @keyframes popIn {
                    0% { transform: scale(0.9); opacity: 0; }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
