

interface GiveUpDreamDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function GiveUpDreamDialog({ isOpen, onClose, onConfirm }: GiveUpDreamDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#0d1c0d]/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative z-20 w-full max-w-[480px] animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col bg-white dark:bg-[#1a2e1a] rounded-lg shadow-soft overflow-hidden border border-white/60 dark:border-white/10 ring-4 ring-white/20">
                    {/* Visual Header */}
                    <div className="p-5 pb-0">
                        <div className="w-full aspect-[4/3] bg-gradient-to-b from-sky-50 to-emerald-50 dark:from-[#233523] dark:to-[#1a2a1a] rounded-xl overflow-hidden relative flex items-end justify-center group pb-6 border border-black/5 dark:border-white/5">
                            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#25f425]/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-3xl"></div>

                            {/* Sad Plant Illustration (CSS simplified for brevity) */}
                            <div className="text-9xl relative z-10 animate-droop">🥀</div>
                        </div>
                    </div>

                    <div className="flex flex-col px-8 pt-6 pb-8 text-center">
                        <h2 className="text-[#0d1c0d] dark:text-white text-[28px] font-bold leading-tight tracking-tight mb-3">
                            Oops! Want to change your dream?
                        </h2>
                        <p className="text-[#4a594a] dark:text-[#aebfae] text-lg font-medium leading-relaxed mb-8">
                            If you stop growing this seed, all your saved gold will go back to your wallet so you can start a brand new adventure. <span className="text-red-500 dark:text-red-400 font-bold block mt-1">Your current progress will be lost!</span>
                        </p>
                        <div className="flex flex-col gap-3 w-full">
                            <button onClick={onClose} className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-6 bg-primary hover:bg-[#1ee61e] transition-all duration-200 active:scale-[0.98] shadow-glow border border-transparent">
                                <span className="material-symbols-outlined text-[#0d1c0d] mr-2 text-[24px]">water_drop</span>
                                <span className="text-[#0d1c0d] text-lg font-bold tracking-wide">Keep Growing</span>
                            </button>
                            <button onClick={onConfirm} className="group flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-6 bg-[#ffebee] hover:bg-[#ffcdd2] dark:bg-red-900/20 dark:hover:bg-red-900/40 text-[#c62828] dark:text-[#ef9a9a] transition-colors duration-200 active:scale-[0.98]">
                                <span className="material-symbols-outlined mr-2 text-[24px]">replay</span>
                                <span className="text-lg font-bold tracking-wide">Take Back Gold & Restart</span>
                            </button>
                        </div>
                    </div>
                </div>

                <button onClick={onClose} aria-label="Close modal" className="absolute -top-12 right-0 md:-right-12 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-colors cursor-pointer shadow-sm">
                    <span className="material-symbols-outlined text-[28px]">close</span>
                </button>
            </div>
        </div>
    );
}
