import { ConnectModal, useCurrentAccount } from "@mysten/dapp-kit";
import { useState, useEffect } from "react";

interface ConnectWalletDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ConnectWalletDialog({ isOpen, onClose }: ConnectWalletDialogProps) {
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const account = useCurrentAccount();

    useEffect(() => {
        if (account && isOpen) {
            onClose();
        }
    }, [account, isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-[#0A1F22]/80 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal Content */}
                <div className="relative w-full max-w-md bg-white dark:bg-[#14282B] rounded-[2.5rem] border-4 border-white/50 dark:border-white/10 shadow-2xl overflow-hidden animate-float">
                    {/* Subtle decoration pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#25f425_1px,transparent_1px)] [background-size:16px_16px]"></div>

                    <div className="relative p-8 flex flex-col items-center text-center z-10">
                        {/* Mystery Box / Magic Key Visual */}
                        <div className="relative w-32 h-32 mb-6">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-secondary/30 rounded-full blur-2xl"></div>

                            {/* Gold Chest/Box */}
                            <div className="absolute inset-0 bg-[#FFD700] rounded-3xl border-[6px] border-white shadow-[0_8px_0_rgba(218,165,32,1)] transform -rotate-6 flex items-center justify-center">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/40 rounded-full"></div>
                            </div>

                            {/* Magic Key Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-20 bg-accent rounded-xl border-4 border-white shadow-lg transform rotate-3 flex flex-col items-center justify-center relative">
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-t-full border-[6px] border-white border-b-0"></div>
                                    <div className="w-3 h-3 bg-white rounded-full mt-1"></div>
                                    <div className="w-1.5 h-3 bg-white rounded-full mt-1"></div>
                                </div>
                            </div>

                            {/* Floating Star */}
                            <span className="material-symbols-outlined absolute -top-2 -right-4 text-4xl text-yellow-300 drop-shadow-sm animate-bounce">
                                star
                            </span>
                        </div>

                        <h2 className="text-3xl font-black text-text-main dark:text-white leading-tight mb-3">
                            Wait! We need your <span className="text-primary block">Magic Source!</span>
                        </h2>

                        <p className="text-lg text-text-muted dark:text-gray-300 font-bold leading-snug mb-8">
                            Please connect your magic wallet to continue. This is where your Magic Drops and garden progress are safely managed!
                        </p>

                        <div className="w-full space-y-3">
                            <ConnectModal
                                trigger={
                                    <button className="w-full bg-primary hover:bg-primary-dark text-white text-xl font-black py-4 px-6 rounded-2xl shadow-[0_6px_0_#1bc41b] hover:shadow-[0_4px_0_#1bc41b] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-3">
                                        <span className="material-symbols-outlined text-2xl font-bold">account_balance_wallet</span>
                                        Connect Wallet
                                    </button>
                                }
                                open={isConnectModalOpen}
                                onOpenChange={setIsConnectModalOpen}
                            />

                            <button
                                onClick={onClose}
                                className="w-full bg-gray-200 dark:bg-white/10 hover:bg-gray-300 text-gray-500 dark:text-gray-400 text-lg font-bold py-3 px-6 rounded-2xl transition-colors"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
