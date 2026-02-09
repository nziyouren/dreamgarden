

interface GiveUpDreamDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isProcessing?: boolean;
}

export function GiveUpDreamDialog({ isOpen, onClose, onConfirm, isProcessing }: GiveUpDreamDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#0d1c0d]/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative z-20 w-full max-w-[400px] animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col bg-white dark:bg-[#1a2e1a] rounded-2xl shadow-soft overflow-hidden border border-white/60 dark:border-white/10 ring-4 ring-white/20">
                    {/* Visual Header */}
                    <div className="p-4 pb-0">
                        <div className="w-full aspect-[4/3] bg-gradient-to-b from-sky-50 to-emerald-50 dark:from-[#233523] dark:to-[#1a2a1a] rounded-xl overflow-hidden relative flex items-end justify-center group pb-4 border border-black/5 dark:border-white/5">
                            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#25f425]/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-3xl"></div>

                            {/* Detailed Wilted Illustration - Scaled Down */}
                            <div className="relative flex items-end gap-2 transform translate-y-2 scale-90">
                                {/* Wilted Plant in Pot */}
                                <div className="relative flex flex-col items-center z-10 mr-3">
                                    <div className="relative mb-[-4px] animate-[droop_3s_ease-in-out_infinite] origin-bottom">
                                        <div className="w-2 h-14 bg-green-600 rounded-full mx-auto origin-bottom"></div>
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div className="absolute top-2 left-0 w-6 h-8 bg-green-500 rounded-full rounded-tr-none origin-bottom-right -rotate-[130deg] -translate-x-1 shadow-sm"></div>
                                        <div className="absolute top-5 right-0 w-5 h-6 bg-green-500 rounded-full rounded-tl-none origin-bottom-left rotate-[130deg] translate-x-1 shadow-sm"></div>
                                    </div>
                                    <div className="w-16 h-14 bg-[#d97757] rounded-b-xl rounded-t-sm relative shadow-md">
                                        <div className="absolute -top-2.5 -left-1 w-[calc(100%+8px)] h-4 bg-[#c56242] rounded-md shadow-sm"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-30">
                                            <div className="flex gap-3 mb-1">
                                                <div className="w-1 h-1 bg-amber-900 rounded-full"></div>
                                                <div className="w-1 h-1 bg-amber-900 rounded-full"></div>
                                            </div>
                                            <div className="w-2 h-0.5 bg-amber-900 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sad Block Character */}
                                <div className="relative z-20">
                                    <div className="absolute top-3 -right-3 w-14 h-14 border-[10px] border-sky-400 rounded-full -z-10"></div>
                                    <div className="absolute bottom-5 -left-6 w-12 h-4 bg-sky-400 origin-right -rotate-[25deg]"></div>
                                    <div className="relative w-28 h-20 bg-sky-400 rounded-2xl flex flex-col items-center justify-center shadow-md border-b-4 border-sky-500">
                                        <div className="flex gap-5 mt-1">
                                            <div className="relative w-3.5 h-3.5 bg-slate-900 rounded-full">
                                                <div className="absolute top-2.5 left-0.5 w-1.5 h-2.5 bg-sky-200 rounded-full animate-[tear_4s_ease-in-out_infinite] z-20"></div>
                                            </div>
                                            <div className="w-3.5 h-3.5 bg-slate-900 rounded-full"></div>
                                        </div>
                                        <div className="w-5 h-2.5 border-t-[2.5px] border-slate-900 rounded-t-full mt-3 opacity-70"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col px-6 pt-5 pb-6 text-center">
                        <h2 className="text-[#0d1c0d] dark:text-white text-2xl font-bold leading-tight tracking-tight mb-2">
                            Oops! Want to change your dream?
                        </h2>
                        <p className="text-[#4a594a] dark:text-[#aebfae] text-base font-medium leading-relaxed mb-6">
                            If you stop growing this seed, all your saved gold will go back to your wallet so you can start a brand new adventure. <span className="text-red-500 dark:text-red-400 font-bold block mt-1 text-sm">Your current progress will be lost!</span>
                        </p>
                        <div className="flex flex-col gap-2.5 w-full">
                            <button onClick={onClose} disabled={isProcessing} className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-primary hover:bg-[#1ee61e] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] shadow-[0_0_20px_rgba(37,244,37,0.3)] border border-transparent">
                                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                <span className="material-symbols-outlined text-[#0d1c0d] mr-2 text-[20px]">water_drop</span>
                                <span className="text-[#0d1c0d] text-base font-bold tracking-wide">Keep Growing</span>
                            </button>
                            <button onClick={onConfirm} disabled={isProcessing} className="group flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-[#ffebee] hover:bg-[#ffcdd2] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-900/20 dark:hover:bg-red-900/40 text-[#c62828] dark:text-[#ef9a9a] transition-colors duration-200 active:scale-[0.98]">
                                <span className="material-symbols-outlined mr-2 text-[20px]">{isProcessing ? 'sync' : 'replay'}</span>
                                <span className="text-base font-bold tracking-wide">{isProcessing ? 'Processing...' : 'Take Back Gold & Restart'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute -top-12 right-0 md:-right-12 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-colors cursor-pointer shadow-sm"
                >
                    <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
            </div>
        </div>
    );
}
