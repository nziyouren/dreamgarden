import { Link } from "react-router-dom";

export function LandingPage() {
    return (
        <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 flex flex-col items-center">
            <header className="w-full mb-8 text-center">
                <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-white/5 backdrop-blur px-4 py-2 rounded-full mb-4 border border-white/20">
                    <span className="material-symbols-outlined text-yellow-500">wb_sunny</span>
                    <span className="text-sm font-bold text-text-muted dark:text-gray-300 uppercase tracking-wider">Good Morning, Alex!</span>
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-text-main dark:text-white">
                    Ready to start your <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600 drop-shadow-sm">Savings Adventure?</span>
                </h2>
                <p className="mt-4 text-xl text-text-muted dark:text-gray-400 font-medium max-w-2xl mx-auto">
                    Your garden is empty! Plant your first dream seed to start growing your savings.
                </p>
            </header>

            <div className="w-full max-w-4xl relative mt-4">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/30 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
                <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-[3rem] border-4 border-white/60 dark:border-white/10 shadow-glass flex flex-col items-center justify-center overflow-hidden p-8 group transition-all duration-500 hover:shadow-glow-primary cursor-pointer">

                    {/* Floating Icons */}
                    <div className="absolute top-12 left-12 animate-float" style={{ animationDelay: '0s' }}>
                        <span className="material-symbols-outlined text-4xl text-blue-400/50">water_drop</span>
                    </div>
                    <div className="absolute top-20 right-20 animate-float" style={{ animationDelay: '2s' }}>
                        <span className="material-symbols-outlined text-5xl text-yellow-400/50">wb_sunny</span>
                    </div>
                    <div className="absolute bottom-32 left-24 animate-float" style={{ animationDelay: '1s' }}>
                        <span className="material-symbols-outlined text-3xl text-primary/40">eco</span>
                    </div>

                    <Link to="/plant" className="relative z-20 flex flex-col items-center justify-center group/btn transition-transform duration-300 hover:scale-105">
                        <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-b from-[#8B5E3C] to-[#5D4037] border-8 border-white/30 dark:border-white/10 shadow-xl flex items-center justify-center relative overflow-hidden glowing-plot">
                            {/* Pattern overlay handled by CSS/SVG if needed, simplified here */}
                            <div className="absolute inset-4 rounded-full border-4 border-dashed border-white/20 animate-[spin_10s_linear_infinite]"></div>
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center shadow-lg group-hover/btn:bg-primary group-hover/btn:text-white transition-colors duration-300">
                                <span className="material-symbols-outlined text-6xl sm:text-8xl text-primary group-hover/btn:text-white transition-colors duration-300">add</span>
                            </div>
                        </div>
                        <div className="mt-8 bg-white dark:bg-card-dark px-8 py-4 rounded-full shadow-lg border-2 border-primary transform group-hover/btn:-translate-y-2 transition-transform duration-300">
                            <span className="text-xl sm:text-2xl font-black text-primary uppercase tracking-wide">Plant My Seed</span>
                        </div>
                    </Link>

                    <div className="absolute bottom-0 left-0 w-full h-16 sm:h-24 soil-base rounded-b-[2.5rem] border-t-4 border-[#6d462b] pointer-events-none">
                        {/* Soil details omitted for brevity, can add back if needed */}
                    </div>
                </div>
            </div>

            <section className="mt-12 w-full max-w-[800px] grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: 'rocket_launch', color: 'blue', title: '1. Pick a Dream', desc: "Choose what you want to save for. A toy? A game? It's up to you!" },
                    { icon: 'water_drop', color: 'green', title: '2. Water It', desc: "Add money to your vault to water your seed and help it grow." },
                    { icon: 'redeem', color: 'yellow', title: '3. Harvest', desc: "When your plant is fully grown, you can buy your dream!" }
                ].map((item, i) => (
                    <div key={i} className="bg-card-light dark:bg-card-dark p-6 rounded-3xl border border-white/20 shadow-sm flex flex-col items-center text-center">
                        <div className={`size-14 bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-500 rounded-full flex items-center justify-center mb-4`}>
                            <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                        <p className="text-sm text-text-muted dark:text-gray-400">{item.desc}</p>
                    </div>
                ))}
            </section>
        </main>
    );
}
