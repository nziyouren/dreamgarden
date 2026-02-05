import { useNavigate } from "react-router-dom";

export function PlantSeedPage() {
    const navigate = useNavigate();

    const handlePlantSeed = () => {
        // In a real app, this would save the seed to contract or state
        navigate("/dashboard");
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
                        Start saving for something special! You can grow one dream at a time.
                    </p>
                </div>

                <div className="bg-white dark:bg-[#1a2e1a] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden relative">
                    <div className="grid lg:grid-cols-2 gap-0">
                        {/* Left Side - Image Upload */}
                        <div className="relative hidden lg:flex flex-col p-6 bg-gradient-to-br from-green-50 to-primary/10 dark:from-green-950/30 dark:to-primary/5">
                            <label className="flex-1 w-full border-4 border-dashed border-primary/30 hover:border-primary dark:border-primary/20 dark:hover:border-primary rounded-3xl flex flex-col items-center justify-center text-center p-8 transition-all duration-300 cursor-pointer hover:bg-white/40 dark:hover:bg-white/5 group relative overflow-hidden">
                                <input accept="image/*" className="hidden" type="file" />
                                <span className="material-symbols-outlined absolute top-12 left-12 text-primary/10 text-5xl -rotate-12 group-hover:scale-110 transition-transform duration-500">cloud</span>
                                <span className="material-symbols-outlined absolute bottom-12 right-12 text-primary/10 text-5xl rotate-12 group-hover:scale-110 transition-transform duration-500">wb_sunny</span>
                                <div className="size-24 rounded-full bg-white dark:bg-[#102210] shadow-sm shadow-green-900/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 border border-green-100 dark:border-green-800">
                                    <span className="material-symbols-outlined text-5xl text-primary">add_a_photo</span>
                                </div>
                                <h3 className="text-2xl font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors">
                                    Drag and drop a photo<br />of your dream here!
                                </h3>
                                <p className="text-[#608a60] dark:text-gray-400 font-medium">
                                    or click to upload
                                </p>
                            </label>
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
                                        <input className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary h-14 px-4 text-lg transition-all" placeholder="e.g., New Bicycle, Lego Set" type="text" />
                                    </label>
                                    <div>
                                        <span className="text-text-main dark:text-gray-200 text-sm font-medium mb-3 block">Choose an icon</span>
                                        <div className="grid grid-cols-4 gap-3">
                                            {['pedal_bike', 'videogame_asset', 'flight', 'add_a_photo'].map(icon => (
                                                <button key={icon} className="aspect-square rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/5 flex flex-col items-center justify-center gap-1 transition-all group bg-white dark:bg-transparent text-gray-400 hover:text-primary">
                                                    <span className="material-symbols-outlined text-3xl">{icon}</span>
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
                                            <input className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary h-14 pl-8 pr-4 text-lg font-mono transition-all" placeholder="50.00" type="number" />
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <span className="text-xs font-bold text-gray-400 uppercase">USDC</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-[#608a60] dark:text-gray-500 mt-2">One seed per vault. Funds are locked until goal is reached.</p>
                                    </label>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button onClick={handlePlantSeed} className="w-full group flex items-center justify-center gap-2 bg-primary hover:bg-[#1ee01e] active:scale-[0.98] text-text-main text-lg font-bold py-4 rounded-xl shadow-xl shadow-primary/30 transition-all duration-200">
                                    <span className="material-symbols-outlined transition-transform group-hover:-translate-y-1">local_florist</span>
                                    Plant My Seed
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
