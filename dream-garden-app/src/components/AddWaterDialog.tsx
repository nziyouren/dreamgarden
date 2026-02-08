import { useState } from "react";

interface AddWaterDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: string) => void;
    availableBalance: string;
}

export function AddWaterDialog({ isOpen, onClose, onConfirm, availableBalance }: AddWaterDialogProps) {
    const [amount, setAmount] = useState("");
    const [growthScale, setGrowthScale] = useState(1);
    const [isMax, setIsMax] = useState(false);

    if (!isOpen) return null;

    const handleUpdateGrowth = (scale: number, isMaxFlag = false) => {
        setGrowthScale(scale);
        setIsMax(isMaxFlag);

        // Simple heuristic: if user clicks a percentage, update the amount based on balance
        const balanceNum = parseFloat(availableBalance.replace(/[^0-9.]/g, '')) || 0;
        if (scale === 1.2) setAmount((balanceNum * 0.25).toFixed(2));
        else if (scale === 1.5) setAmount((balanceNum * 0.50).toFixed(2));
        else if (scale === 1.8) setAmount((balanceNum * 0.75).toFixed(2));
        else if (isMaxFlag) setAmount(balanceNum.toFixed(2));
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[420px] bg-white dark:bg-[#1a331a] rounded-3xl shadow-2xl z-20 overflow-hidden border-4 border-[#dbe6db] dark:border-[#2a442a] flex flex-col max-h-[90vh]">
                <div className="absolute top-3 right-3 z-30">
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f0f5f0]/80 dark:bg-[#2a442a]/80 text-[#111811] dark:text-white hover:bg-[#e0e5e0] dark:hover:bg-[#3a553a] transition-colors backdrop-blur-sm"
                    >
                        <span className="material-symbols-outlined font-bold text-xs">close</span>
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 scrollbar-hide">
                    {/* Visual Section */}
                    <div className="w-full h-[180px] bg-[#87CEEB] relative overflow-hidden flex justify-center items-end border-b-4 border-[#7AB8D1]">
                        <svg className="w-full h-full absolute inset-0 pointer-events-none" preserveAspectRatio="xMidYMax slice" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="soilGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#8D6E63', stopOpacity: 1 }}></stop>
                                    <stop offset="100%" style={{ stopColor: '#5D4037', stopOpacity: 1 }}></stop>
                                </linearGradient>
                            </defs>
                            <rect fill="#87CEEB" height="300" width="600"></rect>

                            {/* Clouds */}
                            <g fill="#FFFFFF" opacity="0.8">
                                <circle cx="100" cy="60" r="30"></circle>
                                <circle cx="140" cy="70" r="25"></circle>
                                <circle cx="60" cy="70" r="25"></circle>
                                <circle cx="440" cy="90" r="35"></circle>
                                <circle cx="490" cy="110" r="30"></circle>
                                <circle cx="390" cy="100" r="25"></circle>
                            </g>

                            {/* Soil */}
                            <g transform="translate(0, 20)">
                                <ellipse cx="300" cy="300" fill="url(#soilGradient)" rx="180" ry="80"></ellipse>
                                <g fill="#A1887F">
                                    <ellipse cx="220" cy="300" rx="8" ry="5"></ellipse>
                                    <ellipse cx="380" cy="310" fill="#8D6E63" rx="6" ry="4"></ellipse>
                                    <ellipse cx="235" cy="310" fill="#BCAAA4" rx="5" ry="3"></ellipse>
                                </g>

                                {/* Decor flowers */}
                                <g transform="translate(260, 270)">
                                    <path d="M0,0 Q-5,-10 0,-30" fill="none" stroke="#66BB6A" strokeLinecap="round" strokeWidth="3"></path>
                                    <g transform="translate(0, -30)">
                                        <circle cx="0" cy="-5" fill="#FDD835" r="6"></circle>
                                        <circle cx="5" cy="-2" fill="#FDD835" r="6"></circle>
                                        <circle cx="0" cy="0" fill="#F57F17" r="4"></circle>
                                    </g>
                                </g>
                            </g>

                            {/* Sprout with Dynamic Scale */}
                            <g transform="translate(300, 280)">
                                <g
                                    style={{
                                        transform: `scale(${growthScale * 0.75})`,
                                        filter: isMax ? 'saturate(1.8) drop-shadow(0 0 15px rgba(37, 244, 37, 0.6)) brightness(1.1)' : 'none',
                                        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.6s ease',
                                        transformOrigin: '0px 0px'
                                    }}
                                >
                                    <g className="animate-[sway_4s_ease-in-out_infinite]" style={{ transformOrigin: '0px 0px' }}>
                                        <rect fill="#66BB6A" height="50" width="6" x="-3" y="-50"></rect>
                                        <ellipse cx="-15" cy="-25" fill="#66BB6A" rx="15" ry="8" transform="rotate(-30 -15 -25)"></ellipse>
                                        <ellipse cx="15" cy="-25" fill="#66BB6A" rx="15" ry="8" transform="rotate(30 15 -25)"></ellipse>
                                        <circle cx="0" cy="-55" fill="#81C784" r="16"></circle>
                                        <circle cx="-5" cy="-58" fill="#1B5E20" r="2"></circle>
                                        <circle cx="5" cy="-58" fill="#1B5E20" r="2"></circle>
                                        <path d="M-5,-52 Q0,-48 5,-52" fill="none" stroke="#1B5E20" strokeLinecap="round" strokeWidth="2"></path>
                                    </g>
                                </g>
                            </g>

                            {/* Watering Can and Drops */}
                            <g transform="translate(210, 80)">
                                <g transform="translate(85, 30)">
                                    <circle cx="0" cy="0" fill="#E1F5FE" r="4">
                                        <animate attributeName="cy" begin="0s" dur="1s" from="0" repeatCount="indefinite" to="180"></animate>
                                        <animate attributeName="opacity" begin="0s" dur="1s" repeatCount="indefinite" values="1;0"></animate>
                                    </circle>
                                    <circle cx="0" cy="0" fill="#B3E5FC" r="3">
                                        <animate attributeName="cy" begin="0.3s" dur="1s" from="0" repeatCount="indefinite" to="180"></animate>
                                        <animate attributeName="opacity" begin="0.3s" dur="1s" repeatCount="indefinite" values="1;0"></animate>
                                    </circle>
                                </g>
                                <g transform="rotate(-20 50 50)">
                                    <path d="M10,20 C-20,20 -20,80 10,80" fill="none" stroke="#E65100" strokeLinecap="round" strokeWidth="10"></path>
                                    <rect fill="#FF9800" height="80" rx="8" width="80" x="10" y="10"></rect>
                                    <path d="M90,30 L130,10 L135,30 L90,50 Z" fill="#FF9800"></path>
                                    <circle cx="50" cy="45" fill="#FFB74D" r="15"></circle>
                                </g>
                            </g>
                        </svg>
                    </div>

                    <div className="px-6 py-6 flex flex-col items-center">
                        <h2 className="text-[#111811] dark:text-white text-2xl font-extrabold tracking-tight text-center mb-1 leading-tight">
                            Time to water your seed!
                        </h2>
                        <p className="text-[#608a60] dark:text-[#a0cfa0] text-center font-medium text-base mb-6">
                            How much water (gold) will you add today?
                        </p>

                        {/* Gold Input */}
                        <div className="w-full relative mb-6 group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFA500]">
                                <span className="material-symbols-outlined text-2xl font-variation-fill">savings</span>
                            </div>
                            <input
                                className="w-full bg-[#f0f5f0] dark:bg-[#152e15] border-2 border-transparent focus:border-primary dark:focus:border-primary text-[#111811] dark:text-white text-2xl font-bold rounded-xl py-3 pl-12 pr-16 text-center placeholder-[#a0bca0] focus:ring-0 transition-all outline-none"
                                placeholder="0.00"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[#111811] dark:text-white font-bold text-lg opacity-60 tracking-tight">GOLD</span>
                        </div>

                        {/* Quick Targets */}
                        <div className="w-full grid grid-cols-4 gap-3 sm:gap-4 mb-8">
                            {[
                                { label: '25%', scale: 1.2, color: 'text-[#40E0D0]', bg: 'bg-[#40E0D0]/10', border: 'border-[#40E0D0]' },
                                { label: '50%', scale: 1.5, color: 'text-[#FFA500]', bg: 'bg-[#FFD700]/10', border: 'border-[#FFD700]' },
                                { label: '75%', scale: 1.8, color: 'text-[#FFA500]', bg: 'bg-[#FFA500]/10', border: 'border-[#FFA500]' },
                                { label: 'ALL', scale: 2.4, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary', isMax: true },
                            ].map((btn, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleUpdateGrowth(btn.scale, btn.isMax)}
                                    className="group flex flex-col items-center gap-1 active:scale-95 transition-transform"
                                >
                                    <div className={`w-full aspect-square ${btn.bg} rounded-full flex items-center justify-center border-2 ${btn.border} ${btn.color} hover:bg-opacity-100 hover:text-white transition-all cursor-pointer shadow-[0px_8px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[8px]`}>
                                        <span className="text-lg sm:text-xl font-bold">{btn.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Info Section */}
                        <div className="w-full flex items-start gap-3 bg-[#e6fcf5] dark:bg-[#1a331a] p-4 rounded-lg mb-8 border border-[#40E0D0]/20">
                            <span className="material-symbols-outlined text-[#40E0D0] shrink-0">info</span>
                            <p className="text-sm text-[#111811] dark:text-[#dbe6db] font-medium leading-snug">
                                Adding water helps your seed grow faster! You have <span className="font-bold text-[#FFA500]">{availableBalance} Gold(btcUSDC)</span> available.
                            </p>
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={() => onConfirm(amount)}
                            disabled={!amount || parseFloat(amount) <= 0}
                            className="w-full bg-primary hover:bg-[#1ee01e] disabled:opacity-50 disabled:cursor-not-allowed text-[#111811] text-xl font-bold py-5 rounded-lg shadow-[0px_8px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[8px] transition-all flex items-center justify-center gap-3"
                        >
                            <span className="material-symbols-outlined font-bold">water_drop</span>
                            Confirm Deposit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
