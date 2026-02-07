import { useState, useEffect } from "react";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { Link } from "react-router-dom";

// Constants from SDK for identification
const STABLE_LAYER_PACKAGE_ID = "0x41e25d09e20cf3bc43fe321e51ef178fac419ae47b783a7161982158fc9f17d6";

interface TransactionRecord {
    digest: string;
    timestampMs: string;
    type: 'add_water' | 'withdraw' | 'other';
    amount?: string;
    status: 'success' | 'failure';
    actionName: string;
    dateStr: string;
}

export function GardenHistoryPage() {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
    const [isLoading, setIsLoading] = useState(!!account);
    const [filter, setFilter] = useState<'all' | 'add_water' | 'withdraw'>('all');
    const [cursor, setCursor] = useState<string | null | undefined>(null);
    const [hasNextPage, setHasNextPage] = useState(false);

    const fetchTransactions = async (currentCursor?: string | null) => {
        if (!account) return;
        setIsLoading(true);

        try {
            const res = await suiClient.queryTransactionBlocks({
                filter: { FromAddress: account.address },
                options: {
                    showInput: true,
                    showEffects: true,
                    showEvents: true,
                },
                order: "descending",
                limit: 10,
                cursor: currentCursor,
            });

            const parsed = res.data.map(tx => {
                const timestampMs = tx.timestampMs || "0";
                const date = new Date(parseInt(timestampMs));
                const dateStr = date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                });

                let type: 'add_water' | 'withdraw' | 'other' = 'other';
                let actionName = "Other activity";
                let amount = "";

                // Parsing Transaction Input to find specific move calls
                const transaction = tx.transaction?.data.transaction;
                if (transaction && typeof transaction === 'object' && 'transactions' in transaction) {
                    const ptb = transaction as { transactions: any[] };
                    const moveCalls = ptb.transactions.filter(t => 'MoveCall' in t);

                    const isMint = moveCalls.some(m =>
                        'MoveCall' in m &&
                        m.MoveCall.package === STABLE_LAYER_PACKAGE_ID &&
                        m.MoveCall.function === "mint"
                    );

                    const isBurn = moveCalls.some(m =>
                        'MoveCall' in m &&
                        ('MoveCall' in m && m.MoveCall.package === STABLE_LAYER_PACKAGE_ID &&
                            (m.MoveCall.function === "request_burn" || m.MoveCall.function === "fulfill_burn"))
                    );

                    if (isMint) {
                        type = 'add_water';
                        actionName = "Watered the Garden";
                    } else if (isBurn) {
                        type = 'withdraw';
                        actionName = "Moved to Storage";
                    } else if (moveCalls.length > 0) {
                        const firstCall = (moveCalls[0] as any).MoveCall;
                        actionName = firstCall.function.replace(/_/g, ' ');
                        actionName = actionName.charAt(0).toUpperCase() + actionName.slice(1);
                    }
                }

                // Try to find amount from events if available
                if (tx.events) {
                    const mintEvent = tx.events.find(e => e.type.includes('::Minted') || e.type.includes('::Mint'));
                    const burnEvent = tx.events.find(e => e.type.includes('::Burned') || e.type.includes('::Burn'));

                    if (mintEvent) {
                        const data = mintEvent.parsedJson as any;
                        if (data.usdc_amount) {
                            amount = `+ ${(parseInt(data.usdc_amount) / 1_000_000).toFixed(2)} USDC`;
                        } else if (data.mint_amount) {
                            amount = `+ ${(parseInt(data.mint_amount) / 1_000_000).toFixed(2)} USDC`;
                        }
                    } else if (burnEvent) {
                        const data = burnEvent.parsedJson as any;
                        if (data.usdb_amount) {
                            amount = `- ${(parseInt(data.usdb_amount) / 1_000_000).toFixed(2)} USDC`;
                        } else if (data.burn_amount) {
                            amount = `- ${(parseInt(data.burn_amount) / 1_000_000).toFixed(2)} USDC`;
                        }
                    }
                }

                return {
                    digest: tx.digest,
                    timestampMs,
                    type,
                    amount,
                    status: tx.effects?.status.status === 'success' ? 'success' : 'failure',
                    actionName,
                    dateStr
                } as TransactionRecord;
            });

            setTransactions(prev => currentCursor ? [...prev, ...parsed] : parsed);
            setCursor(res.nextCursor);
            setHasNextPage(res.hasNextPage);
        } catch (e) {
            console.error("Failed to fetch transactions", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (account && account.address) {
            fetchTransactions();
        } else {
            setTransactions([]);
            setIsLoading(false);
        }
    }, [account]);

    const filteredTransactions = transactions.filter(tx => {
        if (filter === 'all') return true;
        return tx.type === filter;
    });

    return (
        <main className="flex-grow flex flex-col items-center w-full px-4 py-12 sm:px-6">
            <div className="w-full max-w-3xl flex flex-col gap-8">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-black text-text-main dark:text-white">Garden Activity</h2>
                    <p className="text-text-muted dark:text-gray-400">Track all your watering and harvesting history on blockchain.</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-3 w-full p-2 bg-white/50 dark:bg-card-dark/50 backdrop-blur-md rounded-3xl border border-white dark:border-white/5">
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex-1 min-w-[120px] h-12 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${filter === 'all'
                            ? "bg-text-main text-white shadow-lg scale-[1.02]"
                            : "bg-transparent text-text-muted hover:bg-white/50 dark:hover:bg-card-dark"
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">history</span>
                        All Activity
                    </button>
                    <button
                        onClick={() => setFilter('add_water')}
                        className={`flex-1 min-w-[120px] h-12 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${filter === 'add_water'
                            ? "bg-text-main text-white shadow-lg scale-[1.02]"
                            : "bg-transparent text-[#4BB3FD] hover:bg-white/50 dark:hover:bg-card-dark"
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">water_drop</span>
                        Watering
                    </button>
                    <button
                        onClick={() => setFilter('withdraw')}
                        className={`flex-1 min-w-[120px] h-12 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${filter === 'withdraw'
                            ? "bg-text-main text-white shadow-lg scale-[1.02]"
                            : "bg-transparent text-[#FF6B6B] hover:bg-white/50 dark:hover:bg-card-dark"
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                        Harvesting
                    </button>
                </div>

                {/* History List */}
                <div className="flex flex-col gap-4 w-full">
                    <h3 className="text-xl font-bold text-text-main dark:text-white px-2">
                        {filter === 'all' ? 'Recent History' : filter === 'add_water' ? 'Watering History' : 'Harvesting History'}
                    </h3>

                    {!account ? (
                        <div className="bg-white dark:bg-card-dark/40 p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center gap-4 text-center">
                            <span className="material-symbols-outlined text-6xl text-primary animate-pulse">account_balance_wallet</span>
                            <div>
                                <p className="font-bold text-text-main dark:text-white text-lg">Wallet Not Connected</p>
                                <p className="text-text-muted text-sm">Please connect your wallet to view your garden history.</p>
                            </div>
                        </div>
                    ) : isLoading && transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="font-bold text-text-muted">Fetching on-chain activity...</p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="bg-white dark:bg-card-dark/40 p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center gap-4 text-center">
                            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">history_toggle_off</span>
                            <div>
                                <p className="font-bold text-text-main dark:text-white text-lg">No records found</p>
                                <p className="text-text-muted text-sm">You haven't performed any actions in your garden yet.</p>
                            </div>
                            <Link to="/plant" className="mt-4 px-6 py-3 bg-primary text-text-main font-bold rounded-full hover:scale-105 transition-transform">
                                Start Your Garden
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {filteredTransactions.map((tx) => (
                                <div
                                    key={tx.digest}
                                    className="bg-white dark:bg-card-dark p-5 rounded-[2rem] shadow-soft border border-white/60 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/30 transition-all group flex items-center gap-4 sm:gap-6"
                                >
                                    <div className={`shrink-0 size-14 sm:size-16 rounded-3xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 ${tx.type === 'add_water' ? 'bg-[#4BB3FD]/10' : tx.type === 'withdraw' ? 'bg-[#FF6B6B]/10' : 'bg-gray-100 dark:bg-gray-800'
                                        }`}>
                                        <span className={`material-symbols-outlined text-[28px] sm:text-[32px] ${tx.type === 'add_water' ? 'text-[#4BB3FD]' : tx.type === 'withdraw' ? 'text-[#FF6B6B]' : 'text-gray-400'
                                            }`}>
                                            {tx.type === 'add_water' ? 'water_drop' : tx.type === 'withdraw' ? 'inventory_2' : 'history'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col flex-grow min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-lg font-bold text-text-main dark:text-white truncate">{tx.actionName}</h4>
                                            <span className={`font-black text-lg sm:text-xl whitespace-nowrap ${tx.type === 'add_water' ? 'text-primary' : 'text-text-main dark:text-white opacity-60'}`}>
                                                {tx.amount}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-text-secondary dark:text-gray-400 text-sm font-medium">{tx.dateStr}</p>
                                            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
                                                <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                                                <span className="text-xs font-bold text-primary uppercase">{tx.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {account && hasNextPage && (
                        <button
                            onClick={() => fetchTransactions(cursor)}
                            disabled={isLoading}
                            className="w-full py-6 text-text-muted dark:text-gray-400 font-bold text-sm hover:text-primary transition-colors flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>View Older Activity</span>
                                    <span className="material-symbols-outlined text-[18px] group-hover:translate-y-1 transition-transform">expand_more</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none -z-10"></div>
        </main>
    );
}
