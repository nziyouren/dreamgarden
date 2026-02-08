import { useState, useEffect } from "react";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { useNavigate } from "react-router-dom";
import { DREAM_GARDEN_PACKAGE_ID, DREAM_GARDEN_MODULE, BTC_USD_TYPE, SEED_STATUS, SEED_TYPE_LIST } from "../constants";

type TabType = 'active' | 'harvested' | 'giving-up';

export function SeedsGalleryPage() {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const navigate = useNavigate();

    const [seeds, setSeeds] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('active');

    useEffect(() => {
        if (!account) {
            setSeeds([]);
            setIsLoading(false);
            return;
        }

        const fetchSeeds = async () => {
            try {
                setIsLoading(true);
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
                setSeeds(parsedSeeds);
            } catch (e) {
                console.error("Failed to fetch seeds", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeeds();
    }, [account, suiClient]);

    const activeSeedsList = seeds.filter(s => s.status === SEED_STATUS.CREATED || s.status === SEED_STATUS.IN_PROGRESS);
    const harvestedSeedsList = seeds.filter(s => s.status === SEED_STATUS.COMPLETED);
    const abandonedSeedsList = seeds.filter(s => s.status === SEED_STATUS.ABANDONED);

    const getStats = () => {
        return {
            active: activeSeedsList.length,
            harvested: harvestedSeedsList.length,
            abandoned: abandonedSeedsList.length
        };
    };

    const stats = getStats();

    return (
        <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
            <header className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-text-main dark:text-white">Dream Seeds Gallery</h2>
                <p className="text-text-muted dark:text-gray-400 text-lg">Manage your growing investments and see past achievements.</p>
            </header>

            {/* Tab Navigation */}
            <div className="bg-white dark:bg-card-dark rounded-[2rem] p-1.5 mb-10 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col md:flex-row gap-1 w-fit mx-auto">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-8 flex items-center justify-center gap-2 h-11 rounded-full transition-all hover:scale-[1.02] font-bold ${activeTab === 'active' ? 'bg-primary text-background-dark shadow-soft' : 'text-text-muted hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                    <span className="text-sm">Active Seeds</span>
                    <span className={`${activeTab === 'active' ? 'bg-black/10' : 'bg-gray-100 dark:bg-white/10'} px-2 py-0.5 rounded-full text-[10px] ml-1`}>{stats.active}</span>
                </button>
                <button
                    onClick={() => setActiveTab('harvested')}
                    className={`px-8 flex items-center justify-center gap-2 h-11 rounded-full transition-all hover:scale-[1.02] font-bold group ${activeTab === 'harvested' ? 'bg-primary text-background-dark shadow-soft' : 'text-text-muted hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                    <span className={`material-symbols-outlined text-xl ${activeTab === 'harvested' ? 'text-background-dark' : 'text-purple-500'}`}>emoji_events</span>
                    <span className="text-sm">Harvested Dreams</span>
                    <span className={`${activeTab === 'harvested' ? 'bg-black/10' : 'bg-gray-100 dark:bg-white/10'} px-2 py-0.5 rounded-full text-[10px] ml-1`}>{stats.harvested}</span>
                </button>
                <button
                    onClick={() => setActiveTab('giving-up')}
                    className={`px-8 flex items-center justify-center gap-2 h-11 rounded-full transition-all hover:scale-[1.02] font-bold group ${activeTab === 'giving-up' ? 'bg-primary text-background-dark shadow-soft' : 'text-text-muted hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                    <span className={`material-symbols-outlined text-xl ${activeTab === 'giving-up' ? 'text-background-dark' : 'text-[#ff6b6b]'}`}>inventory_2</span>
                    <span className="text-sm">Giving Up</span>
                    <span className={`${activeTab === 'giving-up' ? 'bg-black/10' : 'bg-gray-100 dark:bg-white/10'} px-2 py-0.5 rounded-full text-[10px] ml-1`}>{stats.abandoned}</span>
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {activeTab === 'active' && (
                        <div className="mb-16">
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-text-main dark:text-white">
                                <span className="material-symbols-outlined text-primary">eco</span>
                                Growing Now
                            </h3>
                            {activeSeedsList.length === 0 ? (
                                <div className="bg-white dark:bg-card-dark p-12 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center gap-6 text-center max-w-2xl mx-auto shadow-sm">
                                    <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-5xl">local_florist</span>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-text-main dark:text-white mb-2">No Active Seeds</h4>
                                        <p className="text-text-muted dark:text-gray-400 max-w-md">
                                            Your garden is ready for your next dream. Plant a seed to start saving for something special!
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/plant')}
                                        className="bg-primary hover:bg-primary-dark text-background-dark font-black px-10 py-4 rounded-xl shadow-soft transition-all hover:scale-105"
                                    >
                                        Plant A New Seed
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {activeSeedsList.map((seed) => {
                                        const funds = parseInt(seed.funds || "0");
                                        const target = parseInt(seed.target_amount || "1");
                                        const progress = Math.min(100, (funds / target) * 100);
                                        const isPresetType = SEED_TYPE_LIST.some(t => t.id === seed.seed_type);

                                        return (
                                            <div key={seed.objectId} className="bg-card-light dark:bg-card-dark rounded-xl p-5 shadow-soft border border-gray-100 dark:border-white/5 hover:shadow-hover transition-all duration-300 flex flex-col h-full group">
                                                <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                                    {isPresetType ? (
                                                        <img
                                                            src={`/previews/${seed.seed_type}.png`}
                                                            alt={seed.seed_type}
                                                            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/20 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-6xl text-primary">{seed.seed_type || 'potted_plant'}</span>
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
                                                    <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                                                        <span className="material-symbols-outlined">
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
                                                            className="bg-primary h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,244,37,0.5)] relative"
                                                            style={{ width: `${progress}%` }}
                                                        >
                                                            <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex justify-between text-xs font-medium text-text-muted dark:text-gray-500">
                                                        <span>Needed: ${((target - funds) / 1_000_000).toFixed(2)}</span>
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
                        </div>
                    )}

                    {activeTab === 'harvested' && (
                        <div className="mb-16">
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-text-main dark:text-white">
                                <span className="material-symbols-outlined text-purple-500">emoji_events</span>
                                Harvested Dreams
                            </h3>
                            {harvestedSeedsList.length === 0 ? (
                                <div className="bg-white dark:bg-card-dark p-12 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center gap-6 text-center max-w-2xl mx-auto shadow-sm">
                                    <div className="size-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                                        <span className="material-symbols-outlined text-5xl">emoji_events</span>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-text-main dark:text-white mb-2">No Harvests Yet</h4>
                                        <p className="text-text-muted dark:text-gray-400 max-w-md">
                                            Keep watering those seeds! Once they reach 100%, they'll appear here as your proud achievements.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {harvestedSeedsList.map((seed) => (
                                        <div key={seed.objectId} className="bg-card-light dark:bg-card-dark rounded-xl p-1 shadow-glow-purple border-2 border-purple-200 dark:border-purple-800 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                                            <div className="absolute inset-0 bg-purple-500/5 dark:bg-purple-500/10 z-0"></div>
                                            <div className="p-4 relative z-10 flex flex-col h-full">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="bg-purple-100 dark:bg-purple-900/50 p-2.5 rounded-full text-purple-600 dark:text-purple-300">
                                                        <span className="material-symbols-outlined">check_circle</span>
                                                    </div>
                                                    <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm">stars</span>
                                                        Completed
                                                    </span>
                                                </div>
                                                <h4 className="text-xl font-bold text-text-main dark:text-white mb-1">{seed.name}</h4>
                                                <p className="text-sm text-text-muted dark:text-gray-400 mb-4">Harvested Successfully</p>
                                                <div className="mt-auto pt-4 border-t border-dashed border-purple-200 dark:border-purple-800">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className="text-xs font-bold text-text-muted">Total Saved</span>
                                                        <span className="text-lg font-black text-purple-700 dark:text-purple-300">${(parseInt(seed.target_amount) / 1_000_000).toFixed(2)}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => navigate(`/dashboard/${seed.objectId}`)}
                                                        className="w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'giving-up' && (
                        <div className="mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-text-main dark:text-white">
                                <span className="material-symbols-outlined text-[#ff6b6b]">inventory_2</span>
                                Giving Up (Archive)
                            </h3>
                            {abandonedSeedsList.length === 0 ? (
                                <div className="bg-white dark:bg-card-dark p-12 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center gap-6 text-center max-w-2xl mx-auto shadow-sm">
                                    <div className="size-24 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                                        <span className="material-symbols-outlined text-5xl">inventory_2</span>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-text-main dark:text-white mb-2">Workspace Empty</h4>
                                        <p className="text-text-muted dark:text-gray-400 max-w-md">
                                            This is where seeds you've decided to stop growing are archived. It's clean for now!
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {abandonedSeedsList.map((seed) => (
                                        <div key={seed.objectId} className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 border border-gray-200 dark:border-white/5 flex flex-col h-full opacity-80 hover:opacity-100 transition-opacity">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="bg-gray-200 dark:bg-white/10 p-2 rounded-lg text-gray-500 dark:text-gray-400">
                                                    <span className="material-symbols-outlined">
                                                        {SEED_TYPE_LIST.find(t => t.id === seed.seed_type)?.icon || seed.seed_type || 'potted_plant'}
                                                    </span>
                                                </div>
                                                <span className="bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">lock</span>
                                                    Returned to Vault
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-600 dark:text-gray-300">{seed.name}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Status: Abandoned</p>
                                            <div className="mt-auto pt-4">
                                                <div className="bg-white dark:bg-black/20 rounded-lg p-3 border border-gray-100 dark:border-white/5">
                                                    <p className="text-xs text-gray-500 mb-1">Funds Returned:</p>
                                                    <p className="text-lg font-bold text-gray-700 dark:text-gray-300">${(parseInt(seed.funds) / 1_000_000).toFixed(2)}</p>
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/dashboard/${seed.objectId}`)}
                                                    className="w-full mt-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </main>
    );
}
