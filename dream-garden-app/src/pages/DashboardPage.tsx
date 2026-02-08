import { useState, useEffect } from "react";
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction, coinWithBalance } from "@mysten/sui/transactions";
import { GiveUpDreamDialog } from "../components/GiveUpDreamDialog.tsx";
import { useNavigate, useParams } from "react-router-dom";

import { AddWaterDialog } from "../components/AddWaterDialog.tsx";
import { WithdrawWaterDialog } from "../components/WithdrawWaterDialog.tsx";
import { DepositSuccessDialog } from "../components/DepositSuccessDialog.tsx";
import { DepositFailureDialog } from "../components/DepositFailureDialog.tsx";

import { DREAM_GARDEN_PACKAGE_ID, DREAM_GARDEN_MODULE, BTC_USD_TYPE, SEED_STATUS, SEED_TYPE_LIST } from "../constants";


export function DashboardPage() {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();
    const navigate = useNavigate();
    const { objectId } = useParams();

    const [balance, setBalance] = useState("0");
    const [isGiveUpOpen, setIsGiveUpOpen] = useState(false);
    const [isAddWaterOpen, setIsAddWaterOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
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
                // Fetch Balances and Metadata
                const [lpRes, lpMeta] = await Promise.all([
                    suiClient.getBalance({
                        owner: account.address,
                        coinType: BTC_USD_TYPE
                    }),
                    suiClient.getCoinMetadata({ coinType: BTC_USD_TYPE }),
                ]);

                const lpDecimals = lpMeta?.decimals ?? 6;

                setBalance((parseInt(lpRes.totalBalance) / Math.pow(10, lpDecimals)).toFixed(2));

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

                // Status: 1 Created, 2 In Progress, 3 Completed, 4 Abandoned
                // Active seeds are status 1 or 2
                // If objectId is provided in URL, prioritize that seed
                let selectedSeed = null;
                if (objectId) {
                    selectedSeed = seeds.find((s: any) => s.objectId === objectId);
                }

                // Fallback to the first active seed if no specific seed selected or found
                if (!selectedSeed) {
                    const activeSeeds = seeds.filter((s: any) => s.status === SEED_STATUS.CREATED || s.status === SEED_STATUS.IN_PROGRESS);
                    selectedSeed = activeSeeds.length > 0 ? activeSeeds[0] : null;
                }

                setActiveSeed(selectedSeed);

                // If no active seed but has seeds, maybe user just completed/abandoned them all?
                // Let's only redirect if they have truly NO seeds at all
                if (seeds.length === 0) {
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
        const amount = BigInt(Math.floor(parseFloat(amountStr) * 1_000_000));

        try {
            // Directly use user's BTC_USD_TYPE (Magic Drop)
            const goldCoin = coinWithBalance({
                balance: amount,
                type: BTC_USD_TYPE,
            })(tx);

            // If we have an active seed, join the gold coins to it
            if (activeSeed) {
                tx.moveCall({
                    target: `${DREAM_GARDEN_PACKAGE_ID}::${DREAM_GARDEN_MODULE}::add_water`,
                    arguments: [
                        tx.object(activeSeed.objectId),
                        goldCoin
                    ],
                    typeArguments: [BTC_USD_TYPE]
                });

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
            }
        } catch (e) {
            console.error("Deposit setup failed", e);
            setDepositError(e instanceof Error ? e.message : "Could not build transaction");
            setIsFailureOpen(true);
        }
    };

    const handleConfirmWithdraw = async (amountStr: string) => {
        if (!account || !activeSeed) return;
        setIsWithdrawOpen(false);

        const tx = new Transaction();
        const withdrawAmount = BigInt(Math.floor(parseFloat(amountStr) * 1_000_000));

        try {
            // 1. Withdraw specific amount from seed
            const [fundsCoin] = tx.moveCall({
                target: `${DREAM_GARDEN_PACKAGE_ID}::${DREAM_GARDEN_MODULE}::withdraw`,
                arguments: [
                    tx.object(activeSeed.objectId),
                    tx.pure.u64(withdrawAmount)
                ],
                typeArguments: [BTC_USD_TYPE]
            });

            // 2. Transfer back to user
            tx.transferObjects([fundsCoin], tx.pure.address(account.address));

            signAndExecute({
                transaction: tx,
            }, {
                onSuccess: (result) => {
                    console.log("Withdrawn!", result);
                    setIsSuccessOpen(true);
                },
                onError: (error) => {
                    console.error("Withdrawal failed", error);
                    setDepositError(error.message || "Unknown transaction error");
                    setIsFailureOpen(true);
                }
            });
        } catch (e) {
            console.error("Withdraw setup failed", e);
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
            // 1. Abandon and withdraw funds from seed
            const [fundsCoin] = tx.moveCall({
                target: `${DREAM_GARDEN_PACKAGE_ID}::${DREAM_GARDEN_MODULE}::abandon`,
                arguments: [tx.object(activeSeed.objectId)],
                typeArguments: [BTC_USD_TYPE]
            });

            // 2. Transfer the withdrawn LP tokens back to the user
            tx.transferObjects([fundsCoin], tx.pure.address(account.address));

            signAndExecute({
                transaction: tx,
            }, {
                onSuccess: () => {
                    console.log("Abandoned!");
                    setIsGiveUpOpen(false);
                    // Force refresh or redirect?
                }
            });
        } catch (e) {
            console.error("Abandon failed", e);
            setIsGiveUpOpen(false);
        }
    };

    const handleFinish = async () => {
        if (!account || !activeSeed) return;

        const tx = new Transaction();
        try {
            // 1. Mark completed and withdraw ALL funds
            const [fundsCoin] = tx.moveCall({
                target: `${DREAM_GARDEN_PACKAGE_ID}::${DREAM_GARDEN_MODULE}::complete`,
                arguments: [tx.object(activeSeed.objectId)],
                typeArguments: [BTC_USD_TYPE]
            });

            // 2. Transfer the yield-bearing LP tokens back to the user
            tx.transferObjects([fundsCoin], tx.pure.address(account.address));

            signAndExecute({
                transaction: tx,
            }, {
                onSuccess: () => {
                    console.log("Completed!");
                    setIsSuccessOpen(true);
                }
            });
        } catch (e) {
            console.error("Complete failed", e);
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
                availableBalance={balance}
            />

            <WithdrawWaterDialog
                isOpen={isWithdrawOpen}
                onClose={() => setIsWithdrawOpen(false)}
                onConfirm={handleConfirmWithdraw}
                availableBalance={activeSeed ? (parseInt(activeSeed.funds || "0") / 1_000_000).toFixed(2) : "0.00"}
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
                        <span className="text-5xl font-black text-text-main dark:text-white">
                            ${activeSeed ? (parseInt(activeSeed.funds || "0") / 1_000_000).toFixed(2) : balance}
                        </span>
                        <span className="text-xl font-bold text-text-muted dark:text-gray-500">
                            / ${activeSeed ? (parseInt(activeSeed.target_amount) / 1_000_000).toFixed(2) : "80.00"}
                        </span>

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

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setIsAddWaterOpen(true)}
                            disabled={(activeSeed?.status !== SEED_STATUS.CREATED && activeSeed?.status !== SEED_STATUS.IN_PROGRESS) || isLoadingSeeds}
                            className="group relative w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none text-background-dark rounded-2xl font-black text-lg shadow-[0_4px_0_0_#1a9e1a] hover:shadow-[0_2px_0_0_#1a9e1a] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-150 flex items-center justify-center gap-3 overflow-hidden"
                        >
                            <span className="material-symbols-outlined text-2xl animate-bounce">water_drop</span>
                            {isLoadingSeeds ? '...' : 'Add (Deposit)'}
                        </button>

                        <button
                            onClick={() => setIsWithdrawOpen(true)}
                            disabled={(activeSeed?.status !== SEED_STATUS.CREATED && activeSeed?.status !== SEED_STATUS.IN_PROGRESS) || isLoadingSeeds || !activeSeed || parseInt(activeSeed.funds || "0") === 0}
                            className="group relative w-full py-3 bg-orange-400 hover:bg-orange-500 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none text-white rounded-2xl font-black text-lg shadow-[0_4px_0_0_#c2410c] hover:shadow-[0_2px_0_0_#c2410c] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-150 flex items-center justify-center gap-3 overflow-hidden"
                        >
                            <span className="material-symbols-outlined text-2xl">logout</span>
                            {isLoadingSeeds ? '...' : 'Take (Withdraw)'}
                        </button>
                    </div>

                    {activeSeed && parseInt(activeSeed.funds) >= parseInt(activeSeed.target_amount) && activeSeed.status !== SEED_STATUS.COMPLETED && (
                        <button onClick={handleFinish} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-[0_4px_0_0_#065f46] hover:shadow-[0_2px_0_0_#065f46] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-150 flex items-center justify-center gap-3 overflow-hidden">
                            <span className="material-symbols-outlined text-2xl">celebration</span>
                            Finish Dream & Collect!
                        </button>
                    )}

                    <button onClick={() => setIsGiveUpOpen(true)} className="w-full py-2.5 bg-white dark:bg-card-dark text-red-500 dark:text-red-400 border-2 border-red-100 dark:border-red-900/30 rounded-xl font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">cancel</span>
                        {activeSeed?.status === SEED_STATUS.COMPLETED ? 'Remove Dream Record' : (activeSeed ? 'Cancel Dream & Withdraw Funds' : 'Go Back')}
                    </button>
                </div>

                {/* Right Column: Visualization */}
                <div className="lg:col-span-8 h-full min-h-[500px] relative order-1 lg:order-2">
                    <div className="relative w-full h-full bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-[3rem] border-4 border-white/60 dark:border-white/10 shadow-glass flex flex-col items-center justify-center overflow-hidden p-8 group">
                        {/* Plant Visualization */}
                        <div className="relative z-20 transition-transform duration-500 group-hover:scale-105 w-full max-w-lg aspect-[4/5] bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border-[12px] border-white dark:border-gray-700 overflow-hidden flex flex-col">
                            <div className="flex-1 relative overflow-hidden">
                                {SEED_TYPE_LIST.some(t => t.id === activeSeed?.seed_type) ? (
                                    <img
                                        src={`/previews/${activeSeed.seed_type}.png`}
                                        alt={activeSeed.seed_type}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[10rem] text-primary">{activeSeed?.seed_type || 'local_florist'}</span>
                                    </div>
                                )}
                                <div className="absolute top-6 right-6 bg-white/90 dark:bg-black/60 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">
                                        {SEED_TYPE_LIST.find(t => t.id === activeSeed?.seed_type)?.icon || 'local_florist'}
                                    </span>
                                    <span className="font-black text-blue-600 dark:text-blue-300 uppercase tracking-widest text-xs">
                                        {activeSeed?.seed_type || 'Other'}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-8 text-center border-t border-gray-100 dark:border-gray-700">
                                <h3 className="text-3xl font-black text-text-main dark:text-white mb-2">{activeSeed?.name || 'Growing Dream...'}</h3>
                                <div className="flex items-center justify-center gap-2 text-text-muted dark:text-gray-400 font-bold uppercase tracking-widest text-sm">
                                    <span className="material-symbols-outlined text-primary">verified</span>
                                    On-chain Dream Seed
                                </div>
                                {activeSeed?.status === SEED_STATUS.COMPLETED && (
                                    <div className="mt-4 px-6 py-2 bg-green-500 text-white rounded-xl text-lg font-black shadow-lg animate-bounce">
                                        DREAM ACHIEVED! 🎉
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
