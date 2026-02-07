import { useState, useEffect } from "react";
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction, coinWithBalance } from "@mysten/sui/transactions";
import { StableLayerClient } from "stable-layer-sdk";
import { GiveUpDreamDialog } from "../components/GiveUpDreamDialog.tsx";
import { useNavigate } from "react-router-dom";

import { AddWaterDialog } from "../components/AddWaterDialog.tsx";
import { DepositSuccessDialog } from "../components/DepositSuccessDialog.tsx";
import { DepositFailureDialog } from "../components/DepositFailureDialog.tsx";

import { DREAM_GARDEN_PACKAGE_ID, DREAM_GARDEN_MODULE, BTC_USD_TYPE, USDC_TYPE } from "../constants";

const sdk = new StableLayerClient({
    network: "mainnet",
    sender: "0x0"
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
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isFailureOpen, setIsFailureOpen] = useState(false);
    const [lastDepositAmount, setLastDepositAmount] = useState("");
    const [depositError, setDepositError] = useState("");

    const [activeSeed, setActiveSeed] = useState<any>(null);
    const [isLoadingSeeds, setIsLoadingSeeds] = useState(true);

    // Fetch Balances and Seeds
    useEffect(() => {
        if (!account) return;

        const fetchData = async () => {
            try {
                // Fetch all balances
                const allCoins = await suiClient.getAllCoins({
                    owner: account.address,
                });

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

                if (detectedUsdcBalance === 0 && allCoins.data.length > 0) {
                    const usdcCoins = allCoins.data.filter(coin =>
                        coin.coinType.toLowerCase().includes('usdc')
                    );
                    if (usdcCoins.length > 0) {
                        detectedUsdcBalance = usdcCoins.reduce((sum, coin) => sum + parseInt(coin.balance), 0);
                        detectedUsdcType = usdcCoins[0].coinType;
                    }
                }

                setUsdcBalance((detectedUsdcBalance / 1_000_000).toFixed(2));
                setActiveUsdcType(detectedUsdcType);

                // Fetch Seeds
                setIsLoadingSeeds(true);
                const objects = await suiClient.getOwnedObjects({
                    owner: account.address,
                    filter: {
                        StructType: `${DREAM_GARDEN_PACKAGE_ID}::${DREAM_GARDEN_MODULE}::Seed<${BTC_USD_TYPE}>`
                    },
                    options: {
                        showContent: true,
                    }
                });

                const seeds = objects.data.map((obj: any) => ({
                    ...obj.data?.content?.fields,
                    objectId: obj.data?.objectId
                }));
                const uncompletedSeed = seeds.find((s: any) => !s.is_finished);
                setActiveSeed(uncompletedSeed || null);

                // If no active seed, redirect to plant page
                if (!uncompletedSeed && seeds.length === 0) {
                    navigate("/plant-seed");
                }

                setIsLoadingSeeds(false);
            } catch (e) {
                console.error("Failed to fetch data", e);
                setIsLoadingSeeds(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [account, suiClient, navigate]);

    const handleConfirmDeposit = async (amountStr: string) => {
        if (!account) return;
        setLastDepositAmount(amountStr);
        setIsAddWaterOpen(false);

        const tx = new Transaction();
        const depositAmount = BigInt(Math.floor(parseFloat(amountStr) * 1_000_000));

        try {
            const mintedCoin = await sdk.buildMintTx({
                tx,
                amount: depositAmount,
                sender: account.address,
                usdcCoin: coinWithBalance({
                    balance: depositAmount,
                    type: activeUsdcType,
                })(tx),
                autoTransfer: false, // Don't transfer to user, we'll join to seed
                stableCoinType: BTC_USD_TYPE
            });

            // If we have an active seed, join the minted LP tokens to it
            if (activeSeed) {
                tx.moveCall({
                    target: `${DREAM_GARDEN_PACKAGE_ID}::${DREAM_GARDEN_MODULE}::add_water`,
                    arguments: [
                        tx.object(activeSeed.objectId),
                        mintedCoin as any
                    ],
                    typeArguments: [BTC_USD_TYPE]
                });
            }

            signAndExecute({
                transaction: tx,
            }, {
                onSuccess: (result) => {
                    console.log("Water added!", result);
                    setIsSuccessOpen(true);
                },
                onError: (error) => {
                    console.error("Transaction failed", error);
                    setDepositError(error.message || "Unknown transaction error");
                    setIsFailureOpen(true);
                }
            });
        } catch (e) {
            console.error("Mint setup failed", e);
            setDepositError(e instanceof Error ? e.message : "Could not build transaction");
            setIsFailureOpen(true);
        }
    };

    const handleGiveUp = async () => {
        if (!account || !activeSeed) {
            navigate("/");
            return;
        }

        const tx = new Transaction();
        try {
            // 1. Withdraw funds from seed
            const [fundsCoin] = tx.moveCall({
                target: `${DREAM_GARDEN_PACKAGE_ID}::${DREAM_GARDEN_MODULE}::withdraw_and_delete`,
                arguments: [tx.object(activeSeed.objectId)],
                typeArguments: [BTC_USD_TYPE]
            });

            // 2. Transfer the withdrawn LP tokens back to the user
            tx.transferObjects([fundsCoin], tx.pure.address(account.address));

            // Wait, buildBurnTx in v1.x usually takes 'coin' if we want to burn a specific coin result.
            // But let's check sdk buildBurnTx params again. 
            // If it doesn't take 'coin', we might need to transfer the coin to user first then let sdk find it.
            // But usually PTBs allow passing the result.

            signAndExecute({
                transaction: tx,
            }, {
                onSuccess: () => {
                    console.log("Withdrawn and Deleted!");
                    navigate("/");
                }
            });
        } catch (e) {
            console.error("Burn failed", e);
            navigate("/");
        }
    };

    const handleFinish = async () => {
        if (!account || !activeSeed) return;

        const tx = new Transaction();
        try {
            // 1. Mark finished and withdraw ALL funds
            const [fundsCoin] = tx.moveCall({
                target: `${DREAM_GARDEN_PACKAGE_ID}::${DREAM_GARDEN_MODULE}::finish`,
                arguments: [tx.object(activeSeed.objectId)],
                typeArguments: [BTC_USD_TYPE]
            });

            // 2. Transfer the yield-bearing LP tokens back to the user
            tx.transferObjects([fundsCoin], tx.pure.address(account.address));

            signAndExecute({
                transaction: tx,
            }, {
                onSuccess: () => {
                    console.log("Finished!");
                    setIsSuccessOpen(true);
                }
            });
        } catch (e) {
            console.error("Finish failed", e);
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

            <DepositSuccessDialog
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
            />

            <DepositFailureDialog
                isOpen={isFailureOpen}
                onClose={() => setIsFailureOpen(false)}
                error={depositError}
                onTryAgain={() => {
                    setIsFailureOpen(false);
                    handleConfirmDeposit(lastDepositAmount);
                }}
            />

            <header className="w-full mb-8 text-center">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-text-main dark:text-white">
                    {activeSeed ? "Growing your dream..." : "Let's grow your "} <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600 drop-shadow-sm">
                        {activeSeed ? activeSeed.name : "Mega Block Set!"}
                    </span>
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
                            <span className="text-5xl font-black text-text-main dark:text-white">
                                ${activeSeed ? (parseInt(activeSeed.funds || "0") / 100_000_000).toFixed(2) : balance}
                            </span>
                            <span className="text-xl font-bold text-text-muted dark:text-gray-500">
                                / ${activeSeed ? (parseInt(activeSeed.target_amount) / 1_000_000).toFixed(2) : "80.00"}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative w-full h-8 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner-lg mb-2 border-2 border-white dark:border-gray-700">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-green-400 rounded-full flex items-center justify-end pr-2 transition-all duration-1000"
                                style={{ width: `${Math.min(100, (parseInt(activeSeed?.funds || "0") / parseInt(activeSeed?.target_amount || "1")) * 100)}%` }}
                            >
                                <div className="h-4 w-4 bg-white rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsAddWaterOpen(true)}
                        disabled={activeSeed?.is_finished || isLoadingSeeds}
                        className="group relative w-full py-6 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none text-background-dark rounded-[2rem] font-black text-xl shadow-[0_10px_0_0_#1a9e1a] hover:shadow-[0_5px_0_0_#1a9e1a] hover:translate-y-[5px] active:shadow-none active:translate-y-[10px] transition-all duration-150 flex items-center justify-center gap-3 overflow-hidden"
                    >
                        <span className="material-symbols-outlined text-3xl animate-bounce">water_drop</span>
                        {isLoadingSeeds ? 'Checking Seeds...' : 'Add Water (Deposit)'}
                    </button>

                    {activeSeed && parseInt(activeSeed.funds) >= parseInt(activeSeed.target_amount) && !activeSeed.is_finished && (
                        <button onClick={handleFinish} className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] font-black text-xl shadow-[0_10px_0_0_#065f46] hover:shadow-[0_5px_0_0_#065f46] hover:translate-y-[5px] active:shadow-none active:translate-y-[10px] transition-all duration-150 flex items-center justify-center gap-3 overflow-hidden">
                            <span className="material-symbols-outlined text-3xl">celebration</span>
                            Finish Dream & Collect!
                        </button>
                    )}

                    <button onClick={() => setIsGiveUpOpen(true)} className="w-full py-4 bg-white dark:bg-card-dark text-red-500 dark:text-red-400 border-2 border-red-100 dark:border-red-900/30 rounded-2xl font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">cancel</span>
                        {activeSeed?.is_finished ? 'Remove Dream Record' : (activeSeed ? 'Cancel Dream & Withdraw Funds' : 'Go Back')}
                    </button>
                </div>

                {/* Right Column: Visualization */}
                <div className="lg:col-span-8 h-full min-h-[500px] relative order-1 lg:order-2">
                    <div className="relative w-full h-full bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-[3rem] border-4 border-white/60 dark:border-white/10 shadow-glass flex flex-col items-center justify-end overflow-hidden p-8 group">
                        {/* Plant Visualization */}
                        <div className="relative z-20 mb-8 transition-transform duration-500 group-hover:scale-105">
                            {/* Placeholder for plant image/animation */}
                            <div className="size-64 sm:size-80 bg-white p-4 rounded-3xl shadow-xl border-4 border-white dark:border-gray-700 flex flex-col items-center justify-center">
                                <span className="material-symbols-outlined text-9xl text-green-500">{activeSeed?.seed_type || 'potted_plant'}</span>
                                <span className="mt-4 text-2xl font-black text-text-main">{activeSeed?.name || 'Growing...'}</span>
                                {activeSeed?.is_finished && <div className="mt-2 px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">COMPLETED</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
