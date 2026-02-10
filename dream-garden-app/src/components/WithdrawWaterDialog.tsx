import { useState } from "react";

interface WithdrawWaterDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: string) => void;
    availableBalance: string;
    isProcessing?: boolean;
}

export function WithdrawWaterDialog({ isOpen, onClose, onConfirm, availableBalance, isProcessing }: WithdrawWaterDialogProps) {
    const [amount, setAmount] = useState("");

    if (!isOpen) return null;

    const handleQuickSelect = (percent: number) => {
        const balanceNum = parseFloat(availableBalance) || 0;
        const targetAmount = (balanceNum * percent).toFixed(2);
        setAmount(targetAmount);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[420px] bg-white dark:bg-[#2e1a1a] rounded-3xl shadow-2xl z-20 overflow-hidden border-4 border-[#e6dbdb] dark:border-[#442a2a] flex flex-col max-h-[90vh]">
                <div className="absolute top-3 right-3 z-30">
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f5f0f0]/80 dark:bg-[#442a2a]/80 text-[#181111] dark:text-white hover:bg-[#e5e0e0] dark:hover:bg-[#553a3a] transition-colors backdrop-blur-sm"
                    >
                        <span className="material-symbols-outlined font-bold text-xs">close</span>
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 scrollbar-hide">
                    {/* Visual Section - Harvesting/Extraction Theme */}
                    <div className="w-full h-[180px] bg-[#FFAB91] relative overflow-hidden flex justify-center items-end border-b-4 border-[#E08D79]">
                        <svg className="w-full h-full absolute inset-0 pointer-events-none" preserveAspectRatio="xMidYMax slice" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                            <rect fill="#FFAB91" height="300" width="600"></rect>

                            {/* Simple extraction visual */}
                            <g transform="translate(300, 150)">
                                <circle cx="0" cy="0" r="60" fill="white" fillOpacity="0.2">
                                    <animate attributeName="r" values="60;70;60" dur="3s" repeatCount="indefinite" />
                                </circle>
                                <text x="0" y="20" textAnchor="middle" fill="white" fontSize="60" className="material-symbols-outlined select-none">outbound</text>
                            </g>

                            {/* Particles moving up */}
                            {[...Array(8)].map((_, i) => (
                                <circle key={i} cx={200 + Math.random() * 200} cy="250" r="4" fill="white" opacity="0.6">
                                    <animate attributeName="cy" from="250" to="50" dur={`${1 + Math.random()}s`} begin={`${Math.random()}s`} repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.6;0" dur={`${1 + Math.random()}s`} begin={`${Math.random()}s`} repeatCount="indefinite" />
                                </circle>
                            ))}
                        </svg>
                    </div>

                    <div className="px-6 py-6 flex flex-col items-center">
                        <h2 className="text-[#181111] dark:text-white text-2xl font-extrabold tracking-tight text-center mb-1 leading-tight">
                            Withdraw from Seed
                        </h2>
                        <p className="text-[#8a6060] dark:text-[#cfa0a0] text-center font-medium text-base mb-6">
                            Need some drops back? You can withdraw any amount.
                        </p>

                        {/* Gold Input */}
                        <div className="w-full relative mb-6 group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF7043]">
                                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                            </div>
                            <input
                                className="w-full bg-[#f5f0f0] dark:bg-[#2e1515] border-2 border-transparent focus:border-[#FF7043] dark:focus:border-[#FF7043] text-[#111811] dark:text-white text-2xl font-bold rounded-xl py-3 pl-12 pr-16 text-center placeholder-[#bca0a0] focus:ring-0 transition-all outline-none"
                                placeholder="0.00"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[#111811] dark:text-white font-bold text-lg opacity-60 tracking-tight">DROP</span>
                        </div>

                        {/* Quick Targets */}
                        <div className="w-full grid grid-cols-4 gap-3 sm:gap-4 mb-8">
                            {[
                                { label: '25%', percent: 0.25, color: 'text-[#FF8A65]', bg: 'bg-[#FF8A65]/10', border: 'border-[#FF8A65]' },
                                { label: '50%', percent: 0.50, color: 'text-[#FF7043]', bg: 'bg-[#FF7043]/10', border: 'border-[#FF7043]' },
                                { label: '75%', percent: 0.75, color: 'text-[#F4511E]', bg: 'bg-[#F4511E]/10', border: 'border-[#F4511E]' },
                                { label: 'ALL', percent: 1, color: 'text-[#E64A19]', bg: 'bg-[#E64A19]/10', border: 'border-[#E64A19]' },
                            ].map((btn, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleQuickSelect(btn.percent)}
                                    className="group flex flex-col items-center gap-1 active:scale-95 transition-transform"
                                >
                                    <div className={`w-full aspect-square ${btn.bg} rounded-full flex items-center justify-center border-2 ${btn.border} ${btn.color} hover:bg-opacity-100 hover:text-white transition-all cursor-pointer shadow-sm hover:translate-y-[2px]`}>
                                        <span className="text-lg sm:text-xl font-bold">{btn.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Info Section */}
                        <div className="w-full flex items-start gap-3 bg-[#fdf2f2] dark:bg-[#331a1a] p-4 rounded-lg mb-8 border border-[#FF7043]/20">
                            <span className="material-symbols-outlined text-[#FF7043] shrink-0">info</span>
                            <p className="text-sm text-[#181111] dark:text-[#ebdbe6] font-medium leading-snug">
                                You currently have <span className="font-bold text-[#FF7043]">{availableBalance} Magic Drops</span> in this seed.
                            </p>
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={() => onConfirm(amount)}
                            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(availableBalance) || isProcessing}
                            className="w-full bg-[#FF7043] hover:bg-[#F4511E] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xl font-bold py-5 rounded-lg shadow-lg hover:translate-y-[-2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-3"
                        >
                            <span className="material-symbols-outlined font-bold">
                                {isProcessing ? 'sync' : 'outbound'}
                            </span>
                            {isProcessing ? 'Processing...' : 'Confirm Withdrawal'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
