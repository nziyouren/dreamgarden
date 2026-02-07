import { useState, useEffect, useMemo } from "react";
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction, coinWithBalance } from "@mysten/sui/transactions";
import { StableLayerClient } from "stable-layer-sdk";
import { USDC_TYPE, BTC_USD_TYPE } from "../constants";
import { DepositSuccessDialog } from "../components/DepositSuccessDialog";
import { DepositFailureDialog } from "../components/DepositFailureDialog";

export function SeedStationPage() {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();

    const sdk = useMemo(() => new StableLayerClient({
        network: "mainnet",
        sender: account?.address || "0x0"
    }), [account]);

    const [usdcBalance, setUsdcBalance] = useState<string>("0.00");
    const [lpBalance, setLpBalance] = useState<string>("0.00");
    const [mintAmount, setMintAmount] = useState<string>("");
    const [burnAmount, setBurnAmount] = useState<string>("");
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isFailureOpen, setIsFailureOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchData = async () => {
        if (!account) return;
        try {
            const [usdcRes, lpRes, usdcMeta, lpMeta] = await Promise.all([
                suiClient.getBalance({
                    owner: account.address,
                    coinType: USDC_TYPE
                }),
                suiClient.getBalance({
                    owner: account.address,
                    coinType: BTC_USD_TYPE
                }),
                suiClient.getCoinMetadata({ coinType: USDC_TYPE }),
                suiClient.getCoinMetadata({ coinType: BTC_USD_TYPE })
            ]);

            const usdcDecimals = usdcMeta?.decimals ?? 6;
            const lpDecimals = lpMeta?.decimals ?? 6;

            setUsdcBalance((parseInt(usdcRes.totalBalance) / Math.pow(10, usdcDecimals)).toFixed(2));
            setLpBalance((parseInt(lpRes.totalBalance) / Math.pow(10, lpDecimals)).toFixed(2));
        } catch (e) {
            console.error("Fetch failed", e);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [account]);

    const handleMint = async () => {
        if (!account || !mintAmount) return;
        const tx = new Transaction();
        const amount = BigInt(Math.floor(parseFloat(mintAmount) * 1_000_000));

        try {
            await sdk.buildMintTx({
                tx,
                amount,
                sender: account.address,
                usdcCoin: coinWithBalance({
                    balance: amount,
                    type: USDC_TYPE,
                })(tx),
                autoTransfer: true,
                stableCoinType: BTC_USD_TYPE
            });

            signAndExecute({ transaction: tx }, {
                onSuccess: () => {
                    setIsSuccessOpen(true);
                    setMintAmount("");
                },
                onError: (e) => {
                    setErrorMsg(e.message);
                    setIsFailureOpen(true);
                }
            });
        } catch (e: any) {
            setErrorMsg(e.message);
            setIsFailureOpen(true);
        }
    };

    const handleBurn = async () => {
        if (!account || !burnAmount) return;
        const tx = new Transaction();
        const amount = BigInt(Math.floor(parseFloat(burnAmount) * 1_000_000));

        try {
            await sdk.buildBurnTx({
                tx,
                stableCoinType: BTC_USD_TYPE,
                amount,
                all: false,
                sender: account.address,
                autoTransfer: true
            });

            signAndExecute({ transaction: tx }, {
                onSuccess: () => {
                    setIsSuccessOpen(true);
                    setBurnAmount("");
                },
                onError: (e) => {
                    setErrorMsg(e.message);
                    setIsFailureOpen(true);
                }
            });
        } catch (e: any) {
            setErrorMsg(e.message);
            setIsFailureOpen(true);
        }
    };

    return (
        <main className="flex-grow w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-8 flex flex-col justify-center">
            <header className="text-center mb-12 mt-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full font-bold text-sm mb-4">
                    <span className="material-symbols-outlined text-lg">hotel_class</span>
                    Magic Gold Exchange
                </div>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-text-main dark:text-white mb-4">
                    Manage Your <span className="text-primary underline decoration-wavy decoration-4 underline-offset-4">Magic Gold</span>
                </h2>
                <p className="text-lg text-text-muted dark:text-gray-400 max-w-2xl mx-auto font-medium">
                    Turn your real coins into Magic Gold to water your seeds, or turn your Magic Gold back into coins to spend!
                </p>
            </header>

            <div className="relative z-10 -mb-10 mx-auto w-fit">
                <div className="bg-text-main text-white dark:bg-white dark:text-text-main px-10 py-6 rounded-2xl shadow-xl flex flex-col items-center transform rotate-[-2deg] border-4 border-white dark:border-card-dark transition-all hover:rotate-0">
                    <span className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Magic Gold Balance</span>
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-primary">monetization_on</span>
                        <span className="text-5xl font-black tracking-tight">{lpBalance}</span>
                    </div>
                    <div className="text-xs font-bold bg-white/20 dark:bg-black/10 px-3 py-1 rounded-full mt-2 uppercase">
                        Current Yield Active
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
                {/* Mint Section */}
                <div className="bg-card-light dark:bg-card-dark rounded-[2.5rem] p-8 shadow-soft border-4 border-white dark:border-white/5 relative overflow-hidden group hover:border-accent-mint/30 transition-all duration-300">
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 size-64 bg-[#00E676]/10 rounded-full blur-3xl group-hover:bg-[#00E676]/20 transition-colors"></div>
                    <div className="relative z-10 flex flex-col h-full items-center text-center">
                        <div className="size-24 rounded-full bg-[#00E676]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <div className="size-16 rounded-full bg-[#00E676] text-white flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-4xl font-bold">add</span>
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-text-main dark:text-white mb-2">Mint Magic Gold</h3>
                        <p className="text-text-muted dark:text-gray-400 font-medium mb-8 px-4 text-sm">
                            Convert your USDC into Magic Gold to start growing your dream seeds and earn rewards.
                        </p>

                        <div className="w-full bg-background-light dark:bg-black/20 p-6 rounded-2xl mb-6">
                            <label className="block text-left text-sm font-bold text-text-muted mb-2 ml-1">Amount to Mint</label>
                            <div className="relative mb-3">
                                <input
                                    className="w-full bg-white dark:bg-card-dark border-2 border-transparent focus:border-[#00E676] focus:ring-0 rounded-xl py-4 pl-4 pr-16 text-2xl font-bold text-text-main dark:text-white shadow-sm placeholder-gray-300 transition-all outline-none"
                                    placeholder="0"
                                    type="number"
                                    value={mintAmount}
                                    onChange={(e) => setMintAmount(e.target.value)}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm font-bold text-text-muted select-none pointer-events-none">
                                    <span>USDC</span>
                                </div>
                            </div>
                            <div className="flex gap-2 justify-between w-full">
                                {[25, 50, 75, 100].map(pct => (
                                    <button
                                        key={`mint-${pct}`}
                                        onClick={() => setMintAmount((parseFloat(usdcBalance) * pct / 100).toFixed(2))}
                                        className="flex-1 py-1.5 text-xs sm:text-sm font-bold bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-[#00E676]/20 hover:text-[#00E676] transition-colors border-b-2 border-gray-100 dark:border-transparent active:border-none shadow-sm"
                                    >
                                        {pct === 100 ? 'Max' : `${pct}%`}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-4 text-xs font-bold text-text-muted">
                                <span>Wallet Balance: {usdcBalance} USDC</span>
                            </div>
                        </div>

                        <div className="mt-auto w-full">
                            <button
                                onClick={handleMint}
                                className="w-full py-4 bg-[#00E676] hover:bg-[#00c965] text-white rounded-xl text-xl font-black shadow-[0_6px_0_0_#009661] hover:shadow-[0_4px_0_0_#009661] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
                            >
                                Mint Now
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Burn Section */}
                <div className="bg-card-light dark:bg-card-dark rounded-[2.5rem] p-8 shadow-soft border-4 border-white dark:border-white/5 relative overflow-hidden group hover:border-[#FF5252]/30 transition-all duration-300">
                    <div className="absolute top-0 left-0 -ml-10 -mt-10 size-64 bg-[#FF5252]/10 rounded-full blur-3xl group-hover:bg-[#FF5252]/20 transition-colors"></div>
                    <div className="relative z-10 flex flex-col h-full items-center text-center">
                        <div className="size-24 rounded-full bg-[#FF5252]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <div className="size-16 rounded-full bg-[#FF5252] text-white flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-4xl font-bold">remove</span>
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-text-main dark:text-white mb-2">Burn Magic Gold</h3>
                        <p className="text-text-muted dark:text-gray-400 font-medium mb-8 px-4 text-sm">
                            Finished growing? Exchange your Magic Gold back into real USDC to spend or save.
                        </p>

                        <div className="w-full bg-background-light dark:bg-black/20 p-6 rounded-2xl mb-6">
                            <label className="block text-left text-sm font-bold text-text-muted mb-2 ml-1">Amount to Burn</label>
                            <div className="relative mb-3">
                                <input
                                    className="w-full bg-white dark:bg-card-dark border-2 border-transparent focus:border-[#FF5252] focus:ring-0 rounded-xl py-4 pl-4 pr-16 text-2xl font-bold text-text-main dark:text-white shadow-sm placeholder-gray-300 transition-all outline-none"
                                    placeholder="0"
                                    type="number"
                                    value={burnAmount}
                                    onChange={(e) => setBurnAmount(e.target.value)}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm font-bold text-text-muted select-none pointer-events-none">
                                    <span>MG</span>
                                </div>
                            </div>
                            <div className="flex gap-2 justify-between w-full">
                                {[25, 50, 75, 100].map(pct => (
                                    <button
                                        key={`burn-${pct}`}
                                        onClick={() => setBurnAmount((parseFloat(lpBalance) * pct / 100).toFixed(2))}
                                        className="flex-1 py-1.5 text-xs sm:text-sm font-bold bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-[#FF5252]/20 hover:text-[#FF5252] transition-colors border-b-2 border-gray-100 dark:border-transparent active:border-none shadow-sm"
                                    >
                                        {pct === 100 ? 'Max' : `${pct}%`}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-4 text-xs font-bold text-text-muted">
                                <span>Available: {lpBalance} Magic Gold</span>
                            </div>
                        </div>

                        <div className="mt-auto w-full">
                            <button
                                onClick={handleBurn}
                                className="w-full py-4 bg-[#FF5252] hover:bg-[#ff3b3b] text-white rounded-xl text-xl font-black shadow-[0_6px_0_0_#cc4242] hover:shadow-[0_4px_0_0_#cc4242] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
                            >
                                Burn & Exchange
                                <span className="material-symbols-outlined">currency_exchange</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-black/40 border border-[#e0e5e0] dark:border-white/5 py-6 mt-12 mb-8 rounded-2xl shadow-sm">
                <div className="max-w-[1100px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-xl font-bold">info</span>
                        </div>
                        <div>
                            <p className="font-bold text-sm text-text-main dark:text-white">Exchange Rate</p>
                            <p className="text-xs text-text-muted">1 USDC = 1 Magic Gold (btcUSDC)</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-xs font-bold text-text-muted uppercase tracking-wider">
                            Real-time Yield Active
                        </div>
                        <div className="text-xs font-bold text-text-muted border-l border-gray-200 dark:border-white/10 pl-4">
                            StableLayer v2.0
                        </div>
                    </div>
                </div>
            </div>

            <DepositSuccessDialog isOpen={isSuccessOpen} onClose={() => { setIsSuccessOpen(false); fetchData(); }} />
            <DepositFailureDialog
                isOpen={isFailureOpen}
                onClose={() => setIsFailureOpen(false)}
                onTryAgain={handleMint}
                error={errorMsg}
            />
        </main>
    );
}
