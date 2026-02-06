import { useState, useEffect } from "react";
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction, coinWithBalance } from "@mysten/sui/transactions";
import { StableLayerClient } from "stable-layer-sdk";
import { GiveUpDreamDialog } from "../components/GiveUpDreamDialog.tsx";
import { useNavigate } from "react-router-dom";

import { AddWaterDialog } from "../components/AddWaterDialog.tsx";

// Constants (Should be moved to a config file)
const USDC_TYPE = "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC";
const BTC_USD_TYPE = "0x6d9fc33611f4881a3f5c0cd4899d95a862236ce52b3a38fef039077b0c5b5834::btc_usdc::BtcUSDC";

const sdk = new StableLayerClient({
    network: "mainnet", // Adjust based on env
    sender: "0x0" // Placeholder, will be updated per tx
});

export function DashboardPage() {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();
    const navigate = useNavigate();

    const [balance, setBalance] = useState<string>("0.00");
    const [usdcBalance, setUsdcBalance] = useState<string>("0.00");
    const [activeUsdcType, setActiveUsdcType] = useState<string>(USDC_TYPE);
    const [isGiveUpOpen, setIsGiveUpOpen] = useState(false);
    const [isAddWaterOpen, setIsAddWaterOpen] = useState(false);

    // Fetch Balances
    useEffect(() => {
        if (!account) return;

        const fetchBalances = async () => {
            try {
                // Fetch all balances for debugging and fallback
                const allCoins = await suiClient.getAllCoins({
                    owner: account.address,
                });
                console.log("All wallet coins:", allCoins.data);

                // Fetch btcUSDC balance
                const lpRes = await suiClient.getBalance({
                    owner: account.address,
                    coinType: BTC_USD_TYPE
                });
                setBalance((parseInt(lpRes.totalBalance) / 100_000_000).toFixed(2));

                // Primary Fetch for USDC
                const usdcRes = await suiClient.getBalance({
                    owner: account.address,
                    coinType: USDC_TYPE
                });

                let detectedUsdcBalance = parseInt(usdcRes.totalBalance);
                let detectedUsdcType = USDC_TYPE;

                // Fallback: If primary fetch is 0, try to find ANY USDC coin in the wallet
                if (detectedUsdcBalance === 0 && allCoins.data.length > 0) {
                    const usdcCoins = allCoins.data.filter(coin =>
                        coin.coinType.toLowerCase().includes('usdc')
                    );
                    if (usdcCoins.length > 0) {
                        detectedUsdcBalance = usdcCoins.reduce((sum, coin) => sum + parseInt(coin.balance), 0);
                        detectedUsdcType = usdcCoins[0].coinType;
                        console.log(`Detected alternative USDC coins! Type: ${detectedUsdcType}, Total: ${detectedUsdcBalance}`);
                    }
                }

                setUsdcBalance((detectedUsdcBalance / 1_000_000).toFixed(2));
                setActiveUsdcType(detectedUsdcType);
            } catch (e) {
                console.error("Failed to fetch balances", e);
            }
        };

        fetchBalances();
        const interval = setInterval(fetchBalances, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [account, suiClient]);

    const handleConfirmDeposit = async (amountStr: string) => {
        if (!account) return;

        const tx = new Transaction();
        const depositAmount = BigInt(Math.floor(parseFloat(amountStr) * 1_000_000));

        try {
            await sdk.buildMintTx({
                tx,
                amount: depositAmount,
                sender: account.address,
                usdcCoin: coinWithBalance({
                    balance: depositAmount,
                    type: activeUsdcType,
                })(tx),
                autoTransfer: true,
                lpToken: "btcUSDC" as any
            });

            signAndExecute({
                transaction: tx,
            }, {
                onSuccess: (result) => {
                    console.log("Water added!", result);
                    setIsAddWaterOpen(false);
                    alert(`Success! You added ${amountStr} USDC to your garden.`);
                },
                onError: (error) => {
                    console.error("Transaction failed", error);
                    alert("Transaction failed: " + error.message);
                }
            });
        } catch (e) {
            console.error("Mint setup failed", e);
            alert("Deposit failed - Could not build transaction.");
        }
    };

    const handleGiveUp = async () => {
        if (!account) {
            navigate("/");
            return;
        }

        const tx = new Transaction();
        try {
            await sdk.buildBurnTx({
                tx,
                all: true, // Burn all
                sender: account.address,
                lpToken: "btcUSDC" as any
            } as any);

            signAndExecute({
                transaction: tx,
            }, {
                onSuccess: () => {
                    console.log("Withdrawn!");
                    navigate("/");
                }
            });
        } catch (e) {
            console.error("Burn failed", e);
            alert("Withdraw simulation (Mock): Funds returned.");
            navigate("/");
        }
    };

    return (
        <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 flex flex-col items-center">
            <GiveUpDreamDialog
                isOpen={isGiveUpOpen}
                onClose={() => setIsGiveUpOpen(false)}
                onConfirm={handleGiveUp}
            />

            <AddWaterDialog
                isOpen={isAddWaterOpen}
                onClose={() => setIsAddWaterOpen(false)}
                onConfirm={handleConfirmDeposit}
                availableBalance={usdcBalance}
            />

            <header className="w-full mb-8 text-center">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-text-main dark:text-white">
                    Let's grow your <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600 drop-shadow-sm">Mega Block Set!</span>
                </h2>
            </header>

            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Vault Status */}
                <div className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
                    <div className="bg-card-light dark:bg-card-dark p-8 rounded-[2.5rem] shadow-soft border border-white/40 dark:border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <span className="material-symbols-outlined text-9xl">savings</span>
                        </div>
                        <h3 className="text-lg font-bold text-text-muted dark:text-gray-400 mb-2">Vault Balance</h3>
                        <div className="flex items-baseline gap-1 mb-6 relative z-10">
                            <span className="text-5xl font-black text-text-main dark:text-white">${balance}</span>
                            <span className="text-xl font-bold text-text-muted dark:text-gray-500">/ $80.00</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative w-full h-8 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner-lg mb-2 border-2 border-white dark:border-gray-700">
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-green-400 w-[25%] rounded-full flex items-center justify-end pr-2 transition-all duration-1000">
                                <div className="h-4 w-4 bg-white rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    <button onClick={() => setIsAddWaterOpen(true)} className="group relative w-full py-6 bg-primary hover:bg-primary-dark text-background-dark rounded-[2rem] font-black text-xl shadow-[0_10px_0_0_#1a9e1a] hover:shadow-[0_5px_0_0_#1a9e1a] hover:translate-y-[5px] active:shadow-none active:translate-y-[10px] transition-all duration-150 flex items-center justify-center gap-3 overflow-hidden">
                        <span className="material-symbols-outlined text-3xl animate-bounce">water_drop</span>
                        Add Water (Deposit)
                    </button>

                    <button onClick={() => setIsGiveUpOpen(true)} className="w-full py-4 bg-white dark:bg-card-dark text-red-500 dark:text-red-400 border-2 border-red-100 dark:border-red-900/30 rounded-2xl font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">cancel</span>
                        Cancel Dream & Withdraw Funds
                    </button>
                </div>

                {/* Right Column: Visualization */}
                <div className="lg:col-span-8 h-full min-h-[500px] relative order-1 lg:order-2">
                    <div className="relative w-full h-full bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-[3rem] border-4 border-white/60 dark:border-white/10 shadow-glass flex flex-col items-center justify-end overflow-hidden p-8 group">
                        {/* Plant Visualization */}
                        <div className="relative z-20 mb-8 transition-transform duration-500 group-hover:scale-105">
                            {/* Placeholder for plant image/animation */}
                            <div className="size-64 sm:size-80 bg-white p-4 rounded-3xl shadow-xl border-4 border-white dark:border-gray-700 flex items-center justify-center">
                                <span className="material-symbols-outlined text-9xl text-green-500">potted_plant</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
