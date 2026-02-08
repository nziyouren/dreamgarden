import { useNavigate, Link } from "react-router-dom";
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useState, useEffect } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { DREAM_GARDEN_PACKAGE_ID, DREAM_GARDEN_MODULE, BTC_USD_TYPE, SEED_STATUS, SEED_TYPE_LIST } from "../constants";

export function LandingPage() {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const navigate = useNavigate();

    const [seeds, setSeeds] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBatchProcessing, setIsBatchProcessing] = useState(false);
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();

    useEffect(() => {
        if (!account) {
            setSeeds([]);
            setIsLoading(false);
            return;
        }

        const fetchSeeds = async () => {
            try {
                const objects = await suiClient.getOwnedObjects({
                    owner: account.address,
                    filter: {
                        StructType: `${DREAM_GARDEN_PACKAGE_ID}::${DREAM_GARDEN_MODULE}::Seed<${BTC_USD_TYPE}>`
                    },
                    options: {
                        showContent: true,
                    }
                });

                const parsedSeeds = objects.data.map((obj: any) => ({
                    ...obj.data?.content?.fields,
                    objectId: obj.data?.objectId
                }));
                // Sort by creation_time descending (newest first)
                const sortedSeeds = parsedSeeds.sort((a: any, b: any) =>
                    Number(b.creation_time || 0) - Number(a.creation_time || 0)
                );
                setSeeds(sortedSeeds);
            } catch (e) {
                console.error("Failed to fetch seeds", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeeds();
    }, [account, suiClient]);

    const activeSeeds = seeds.filter(s => s.status === SEED_STATUS.CREATED || s.status === SEED_STATUS.IN_PROGRESS);
    const totalSaved = activeSeeds.reduce((sum, s) => sum + parseInt(s.funds || "0"), 0);
    const growingCount = activeSeeds.length;
    const harvestedCount = seeds.filter(s => s.status === SEED_STATUS.COMPLETED).length;

    const handleBatchWithdraw = async () => {
        if (!account || activeSeeds.length === 0) return;

        const seedsWithFunds = activeSeeds.filter(s => parseInt(s.funds || "0") > 0);
        if (seedsWithFunds.length === 0) {
            alert("No funds to withdraw!");
            return;
        }

        setIsBatchProcessing(true);
        const tx = new Transaction();

        seedsWithFunds.forEach(seed => {
            const [coin] = tx.moveCall({
                target: `${DREAM_GARDEN_PACKAGE_ID}::${DREAM_GARDEN_MODULE}::withdraw`,
                arguments: [
                    tx.object(seed.objectId),
                    tx.pure.u64(seed.funds)
                ],
                typeArguments: [BTC_USD_TYPE]
            });
            tx.transferObjects([coin], account.address);
        });

        signAndExecute({ transaction: tx }, {
            onSuccess: () => {
                alert("Test Success: All funds withdrawn to your wallet!");
                window.location.reload();
            },
            onError: (err) => {
                console.error(err);
                alert("Batch withdraw failed: " + err.message);
                setIsBatchProcessing(false);
            }
        });
    };

    return (
        <main className="flex-grow w-full max-w-[1040px] mx-auto px-4 sm:px-6 py-8">
            {/* Welcome Header */}
            <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                        <span className="material-symbols-outlined text-sm">wb_sunny</span>
                        Welcome to your Garden!
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-text-main dark:text-white">
                        Your dreams are <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">growing nicely!</span>
                    </h2>
                    <p className="text-text-muted dark:text-gray-400 text-lg mt-2 max-w-md">
                        {seeds.length > 0
                            ? `You have ${seeds.length} seeds in your garden. Keep watering them to reach harvest!`
                            : "Your garden is empty! Plant your first dream seed to start growing your savings."}
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <Link
                        to="/plant"
                        className="group flex items-center justify-center gap-3 bg-text-main dark:bg-white text-white dark:text-text-main px-8 py-4 rounded-xl font-bold text-lg hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
                    >
                        <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
                        Plant a New Seed
                    </Link>
                </div>
            </header>

            {/* Stats Overview */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                {/* Stat Card 1 */}
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-4 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 bg-yellow-100 dark:bg-yellow-900/30 size-24 rounded-full opacity-50 blur-xl group-hover:scale-110 transition-transform"></div>
                    <div className="flex items-center gap-3 z-10">
                        <div className="size-10 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                            <span className="material-symbols-outlined">savings</span>
                        </div>
                        <span className="font-medium text-text-muted dark:text-gray-400">Total Saved</span>
                    </div>
                    <div className="z-10">
                        <p className="text-3xl font-black tracking-tight text-text-main dark:text-white">
                            ${(totalSaved / 1_000_000).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1 text-primary text-sm font-bold mt-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            <span>Real-time yield</span>
                        </div>
                    </div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-4 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 bg-green-100 dark:bg-green-900/30 size-24 rounded-full opacity-50 blur-xl group-hover:scale-110 transition-transform"></div>
                    <div className="flex items-center gap-3 z-10">
                        <div className="size-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
                            <span className="material-symbols-outlined">potted_plant</span>
                        </div>
                        <span className="font-medium text-text-muted dark:text-gray-400">Seeds Growing</span>
                    </div>
                    <div className="z-10">
                        <p className="text-3xl font-black tracking-tight text-text-main dark:text-white">{growingCount} Items</p>
                        <p className="text-sm text-text-muted dark:text-gray-500 mt-1 font-medium">Keep watering them!</p>
                    </div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-4 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 bg-purple-100 dark:bg-purple-900/30 size-24 rounded-full opacity-50 blur-xl group-hover:scale-110 transition-transform"></div>
                    <div className="flex items-center gap-3 z-10">
                        <div className="size-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                        <span className="font-medium text-text-muted dark:text-gray-400">Harvested</span>
                    </div>
                    <div className="z-10">
                        <p className="text-3xl font-black tracking-tight text-text-main dark:text-white">{harvestedCount} Goals</p>
                        <p className="text-sm text-text-muted dark:text-gray-500 mt-1 font-medium">Great job!</p>
                    </div>
                </div>
            </section>

            {/* The Garden Grid */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2 text-text-main dark:text-white">
                        <span className="material-symbols-outlined text-primary">grass</span>
                        Active Dream Seeds
                    </h3>
                    <Link to="/gallery" className="text-sm font-bold text-primary hover:text-primary-dark hover:underline">
                        View All Seeds
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : seeds.filter(s => s.status === SEED_STATUS.CREATED || s.status === SEED_STATUS.IN_PROGRESS).length === 0 ? (
                    <div className="bg-white dark:bg-card-dark p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center gap-6 text-center">
                        <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-5xl">local_florist</span>
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-text-main dark:text-white mb-2">No Active Seeds</h4>
                            <p className="text-text-muted dark:text-gray-400 max-w-md">
                                Your garden is ready for your next dream. Plant a seed to start saving for something special!
                            </p>
                        </div>
                        <Link
                            to="/plant"
                            className="bg-primary hover:bg-primary-dark text-background-dark font-black px-10 py-4 rounded-xl shadow-soft transition-all hover:scale-105"
                        >
                            Plant A New Seed
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {seeds.filter(s => s.status === SEED_STATUS.CREATED || s.status === SEED_STATUS.IN_PROGRESS).map((seed) => {
                            const funds = parseInt(seed.funds || "0");
                            const target = parseInt(seed.target_amount || "1");
                            const progress = Math.min(100, (funds / target) * 100);

                            const isPresetType = SEED_TYPE_LIST.some(t => t.id === seed.seed_type);

                            return (
                                <div key={seed.objectId} className="bg-card-light dark:bg-card-dark rounded-xl p-5 shadow-soft border border-gray-100 dark:border-white/5 hover:shadow-hover transition-all duration-300 flex flex-col h-full">
                                    <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center group overflow-hidden">
                                        {isPresetType ? (
                                            <img
                                                src={`/previews/${seed.seed_type}.png`}
                                                alt={seed.seed_type}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-6xl text-primary group-hover:scale-110 transition-transform duration-500">
                                                    {seed.seed_type || 'potted_plant'}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 dark:text-blue-300">
                                            {seed.status === SEED_STATUS.COMPLETED ? 'Harvested' : progress >= 100 ? 'Ready' : 'Growing'}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-xl font-bold text-text-main dark:text-white truncate max-w-[150px]">{seed.name}</h4>
                                            <p className="text-xs text-text-muted dark:text-gray-400 uppercase tracking-wide font-bold mt-1">Target: ${(target / 1_000_000).toFixed(2)}</p>
                                        </div>
                                        <div className="size-10 flex-shrink-0 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <span className="material-symbols-outlined text-xl">
                                                {SEED_TYPE_LIST.find(t => t.id === seed.seed_type)?.icon || seed.seed_type || 'potted_plant'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-auto">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-2xl font-black text-text-main dark:text-white">${(funds / 1_000_000).toFixed(2)}</span>
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{progress.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(37,244,37,0.5)] relative transition-all duration-1000"
                                                style={{ width: `${progress}%` }}
                                            >
                                                {progress > 0 && <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>}
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-between text-xs font-medium text-text-muted dark:text-gray-500">
                                            <span>Needs water</span>
                                            <span>Remaining: ${((target - funds) / 1_000_000).toFixed(2)}</span>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/dashboard/${seed.objectId}`)}
                                            className="w-full mt-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Learning Hint Section */}
            <section className="mt-12 bg-background-dark text-white rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full filter blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    <div className="size-16 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-3xl text-primary">school</span>
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <h4 className="text-2xl font-bold mb-2">Did you know?</h4>
                        <p className="text-gray-300 text-lg">Compound interest is like planting a seed that drops more seeds! The longer you leave it, the bigger your garden grows.</p>
                    </div>
                    <Link
                        to="/lesson/1"
                        className="bg-primary hover:bg-primary-dark text-background-dark font-bold py-3 px-6 rounded-lg whitespace-nowrap transition-colors"
                    >
                        Learn More
                    </Link>
                </div>
            </section>
            {/* Test Tool: Batch Withdraw Button */}
            <button
                onClick={handleBatchWithdraw}
                disabled={isBatchProcessing || activeSeeds.length === 0}
                className="fixed bottom-8 right-8 z-[60] bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-2xl transition-all active:scale-95 group flex items-center gap-2 overflow-hidden max-w-[56px] hover:max-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed border-4 border-white/20"
                title="Test Tool: Withdraw all funds"
            >
                <span className={`material-symbols-outlined ${isBatchProcessing ? 'animate-spin' : ''}`}>
                    {isBatchProcessing ? 'sync' : 'experimental'}
                </span>
                <span className="whitespace-nowrap font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {isBatchProcessing ? 'Running PTB...' : 'TEST: Batch Withdraw'}
                </span>
            </button>
        </main>
    );
}
