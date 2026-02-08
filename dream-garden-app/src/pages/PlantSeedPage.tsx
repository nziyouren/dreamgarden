import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { DREAM_GARDEN_PACKAGE_ID, DREAM_GARDEN_MODULE, BTC_USD_TYPE, SEED_TYPES, SEED_TYPE_LIST } from "../constants";

export function PlantSeedPage() {
    const navigate = useNavigate();
    const account = useCurrentAccount();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();

    const [dreamName, setDreamName] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [seedType, setSeedType] = useState<string>(SEED_TYPES.TOY.id);
    const [isPlanting, setIsPlanting] = useState(false);

    const handlePlantSeed = async () => {
        if (!account || !dreamName || !targetAmount) return;

        setIsPlanting(true);
        const tx = new Transaction();

        // Convert target amount to BtcUSDC units (6 decimals for BtcUSDC as verified on mainnet)
        const amount = BigInt(Math.floor(parseFloat(targetAmount) * 1_000_000));

        try {
            tx.moveCall({
                target: `${DREAM_GARDEN_PACKAGE_ID}::${DREAM_GARDEN_MODULE}::create_seed`,
                arguments: [
                    tx.pure.string(dreamName),
                    tx.pure.u64(amount),
                    tx.pure.string(seedType)
                ],
                typeArguments: [BTC_USD_TYPE] // Use BTC_USD_TYPE as the coin type for the seed vault
            });

            signAndExecute({
                transaction: tx,
            }, {
                onSuccess: (result) => {
                    console.log("Seed planted!", result);
                    navigate("/dashboard");
                },
                onError: (error) => {
                    console.error("Failed to plant seed", error);
                    setIsPlanting(false);
                }
            });
        } catch (e) {
            console.error("Setup failed", e);
            setIsPlanting(false);
        }
    };

    return (
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl flex flex-col gap-8" id="create-wizard-container">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-[#1a2e1a] rounded-full shadow-sm mb-4">
                        <span className="material-symbols-outlined text-primary text-4xl">local_florist</span>
                    </div>
                    <h1 className="text-text-main dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                        Plant a New Dream Seed
                    </h1>
                    <p className="text-[#608a60] dark:text-gray-400 text-lg font-normal max-w-lg mx-auto">
                        Start saving for something special! You can grow multiple dreams at once.
                    </p>
                </div>

                <div className="bg-white dark:bg-[#1a2e1a] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden relative">
                    <div className="grid lg:grid-cols-2 gap-0">
                        {/* Left Side - Image Upload */}
                        <div className="relative hidden lg:flex flex-col p-8 bg-gradient-to-br from-green-50 to-primary/10 dark:from-green-950/30 dark:to-primary/5 items-center justify-center">
                            <div className="w-full aspect-[4/5] rounded-[2rem] bg-white dark:bg-gray-900 shadow-2xl overflow-hidden border-8 border-white dark:border-gray-800 relative group">
                                <img
                                    src={`/previews/${seedType}.png`}
                                    alt={seedType}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                                    <span className="material-symbols-outlined text-4xl mb-2 text-primary">
                                        {SEED_TYPE_LIST.find(t => t.id === seedType)?.icon || 'local_florist'}
                                    </span>
                                    <h3 className="text-2xl font-black">{dreamName || "My Dream"}</h3>
                                    <p className="opacity-80 font-medium">Goal: ${targetAmount || "0.00"}</p>
                                </div>
                            </div>
                            <div className="mt-8 text-center">
                                <p className="text-[#608a60] dark:text-gray-400 font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                                    Previewing your dream
                                </p>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="p-6 md:p-8 lg:p-10 flex flex-col gap-8">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-8 rounded-full bg-primary text-text-main font-bold text-sm">1</div>
                                    <h2 className="text-text-main dark:text-white text-xl font-bold">What is your dream?</h2>
                                </div>
                                <div className="space-y-4 pl-11">
                                    <label className="block">
                                        <span className="text-text-main dark:text-gray-200 text-sm font-medium mb-2 block">Name your Dream Item</span>
                                        <input
                                            value={dreamName}
                                            onChange={(e) => setDreamName(e.target.value)}
                                            className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary h-14 px-4 text-lg transition-all"
                                            placeholder="e.g., Robot, Lunch, Paris"
                                            type="text"
                                        />
                                    </label>
                                    <div>
                                        <span className="text-text-main dark:text-gray-200 text-sm font-medium mb-3 block">Choose a category</span>
                                        <div className="grid grid-cols-4 gap-3">
                                            {SEED_TYPE_LIST.map(type => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setSeedType(type.id)}
                                                    className={`aspect-square rounded-xl border ${seedType === type.id ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent text-gray-400 hover:border-primary hover:text-primary'} flex flex-col items-center justify-center gap-1 transition-all group`}
                                                >
                                                    <span className="material-symbols-outlined text-2xl">{type.icon}</span>
                                                    <span className="text-[10px] font-bold uppercase">{type.id}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-px w-full bg-gray-100 dark:bg-gray-800"></div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm">2</div>
                                    <h2 className="text-text-main dark:text-white text-xl font-bold">Set your goal</h2>
                                </div>
                                <div className="space-y-4 pl-11">
                                    <label className="block">
                                        <span className="text-text-main dark:text-gray-200 text-sm font-medium mb-2 block">Total Seed Amount Needed</span>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-gray-500 font-bold">$</span>
                                            </div>
                                            <input
                                                value={targetAmount}
                                                onChange={(e) => setTargetAmount(e.target.value)}
                                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary h-14 pl-8 pr-4 text-lg font-mono transition-all"
                                                placeholder="50.00"
                                                type="number"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <span className="text-xs font-bold text-gray-400 uppercase">USDC</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-[#608a60] dark:text-gray-500 mt-2">One seed per vault. Funds are locked until goal is reached.</p>
                                    </label>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={handlePlantSeed}
                                    disabled={isPlanting || !dreamName || !targetAmount}
                                    className="w-full group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-primary hover:bg-[#1ee01e] active:scale-[0.98] text-text-main text-lg font-bold py-4 rounded-xl shadow-xl shadow-primary/30 transition-all duration-200"
                                >
                                    <span className="material-symbols-outlined transition-transform group-hover:-translate-y-1">
                                        {isPlanting ? 'sync' : 'local_florist'}
                                    </span>
                                    {isPlanting ? 'Planting...' : 'Plant My Seed'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
