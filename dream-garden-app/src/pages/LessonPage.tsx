import { useState } from "react";
import { Link } from "react-router-dom";

export function LessonPage() {
    const [years, setYears] = useState(5);

    // Simple compound interest logic for the calculator
    // Base amount $100, 40% annual growth (just for demo)
    const baseAmount = 100;
    const growthRate = 0.4;
    const calculatedAmount = (baseAmount * Math.pow(1 + growthRate, years)).toFixed(2);

    return (
        <main className="flex-grow w-full max-w-[1040px] mx-auto px-4 sm:px-6 py-12 relative">
            <div className="absolute top-8 left-4 sm:left-6">
                <Link
                    to="/"
                    className="flex items-center gap-2 bg-text-main dark:bg-white text-white dark:text-text-main px-6 py-3 rounded-xl font-bold text-sm hover:shadow-hover hover:-translate-y-1 transition-all duration-300 group"
                >
                    <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                    Back to My Garden
                </Link>
            </div>

            <header className="mb-12 text-center">
                <div className="inline-block bg-[#ffdd00] text-amber-900 px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] border-2 border-amber-900/10">
                    Lesson 1: Magic Growth
                </div>
                <h1 className="text-5xl sm:text-6xl font-black text-text-main dark:text-white mb-6 leading-tight">
                    The Magic of <br />
                    <span className="text-primary drop-shadow-sm">Growing Seeds!</span>
                </h1>
                <p className="text-xl text-text-muted dark:text-gray-300 max-w-2xl mx-auto font-medium">
                    Learn how your money grows just like a magic forest.
                </p>
            </header>

            <section className="mb-16">
                <div className="bg-white dark:bg-white/5 rounded-[3rem] p-8 border-4 border-dashed border-primary/30 relative">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary text-background-dark px-8 py-3 rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] border-2 border-primary-dark z-10 text-lg whitespace-nowrap">
                        How Magic Seeds Work
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-full bg-blue-50 dark:bg-blue-900/20 aspect-square rounded-2xl border-4 border-blue-200 dark:border-blue-800 flex items-center justify-center mb-6 relative overflow-hidden transition-transform group-hover:scale-105 duration-300">
                                <div className="absolute bottom-0 w-full h-1/3 bg-green-200 dark:bg-green-900/40 rounded-b-xl"></div>
                                <div className="size-16 bg-amber-700 rounded-full border-4 border-amber-900 z-10 shadow-lg relative">
                                    <div className="absolute top-2 right-3 size-4 bg-amber-600 rounded-full opacity-50"></div>
                                </div>
                                <div className="absolute top-4 right-4 font-black text-4xl text-blue-200 dark:text-blue-800 opacity-50">1</div>
                            </div>
                            <h3 className="font-bold text-2xl mb-2 text-blue-600 dark:text-blue-300">Season 1</h3>
                            <p className="font-medium text-text-muted">You plant <span className="font-bold text-text-main dark:text-white">1 seed</span>.</p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-full bg-purple-50 dark:bg-purple-900/20 aspect-square rounded-2xl border-4 border-purple-200 dark:border-purple-800 flex items-center justify-center mb-6 relative overflow-hidden transition-transform group-hover:scale-105 duration-300">
                                <div className="absolute bottom-0 w-full h-1/3 bg-green-200 dark:bg-green-900/40 rounded-b-xl"></div>
                                <div className="flex gap-4 z-10">
                                    <div className="size-12 bg-amber-700 rounded-full border-4 border-amber-900 shadow-lg relative">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-2 h-6 bg-green-500 rounded-full"></div>
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 size-4 bg-green-400 rounded-full border-2 border-green-600"></div>
                                    </div>
                                    <div className="size-12 bg-amber-500 rounded-full border-4 border-amber-800 shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                                        <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-amber-900 font-bold">star</span>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 font-black text-4xl text-purple-200 dark:text-purple-800 opacity-50">2</div>
                            </div>
                            <h3 className="font-bold text-2xl mb-2 text-purple-600 dark:text-blue-300">Season 2</h3>
                            <p className="font-medium text-text-muted">Your seed makes <span className="font-bold text-text-main dark:text-white">a new friend!</span></p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-full bg-orange-50 dark:bg-orange-900/20 aspect-square rounded-2xl border-4 border-orange-200 dark:border-orange-800 flex items-center justify-center mb-6 relative overflow-hidden transition-transform group-hover:scale-105 duration-300">
                                <div className="absolute bottom-0 w-full h-1/3 bg-green-200 dark:bg-green-900/40 rounded-b-xl"></div>
                                <div className="grid grid-cols-2 gap-3 z-10">
                                    <div className="size-10 bg-amber-700 rounded-full border-[3px] border-amber-900"></div>
                                    <div className="size-10 bg-amber-700 rounded-full border-[3px] border-amber-900"></div>
                                    <div className="size-10 bg-amber-500 rounded-full border-[3px] border-amber-800 flex items-center justify-center"><span className="material-symbols-outlined text-sm text-amber-900">star</span></div>
                                    <div className="size-10 bg-amber-500 rounded-full border-[3px] border-amber-800 flex items-center justify-center"><span className="material-symbols-outlined text-sm text-amber-900">star</span></div>
                                </div>
                                <div className="absolute top-4 right-4 font-black text-4xl text-orange-200 dark:text-orange-800 opacity-50">4</div>
                            </div>
                            <h3 className="font-bold text-2xl mb-2 text-orange-600 dark:text-blue-300">Season 3</h3>
                            <p className="font-medium text-text-muted">Now both seeds make <span className="font-bold text-text-main dark:text-white">more seeds!</span></p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <div className="bg-card-light dark:bg-card-dark rounded-[3rem] p-6 md:p-10 shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="w-full md:w-1/2 flex flex-col gap-6">
                            <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                                <div className="size-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined">calculate</span>
                                </div>
                                Magic Calculator
                            </h2>
                            <p className="text-text-muted font-medium mb-4 text-lg">Slide the bar to see your garden grow over time!</p>
                            <div className="space-y-8 bg-background-light dark:bg-white/5 p-8 rounded-[2rem]">
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <label className="font-bold text-text-muted text-sm uppercase tracking-wide">Time (Seasons)</label>
                                        <span className="font-black text-2xl text-primary">{years} Years</span>
                                    </div>
                                    <input
                                        className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-dark"
                                        max="10"
                                        min="1"
                                        type="range"
                                        value={years}
                                        onChange={(e) => setYears(parseInt(e.target.value))}
                                    />
                                    <div className="flex justify-between mt-2 text-sm text-gray-400 font-bold">
                                        <span>1 Year</span>
                                        <span>10 Years</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 bg-gradient-to-b from-sky-200 to-sky-50 dark:from-sky-900/40 dark:to-background-dark rounded-[3rem] h-[400px] relative overflow-hidden border-4 border-white dark:border-white/10 shadow-lg flex items-end justify-center pb-0 group transition-all">
                            <div className="absolute top-8 right-8 size-20 bg-yellow-400 rounded-full border-4 border-yellow-500 shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-pulse"></div>
                            <div className="absolute top-12 left-12 text-white/60">
                                <span className="material-symbols-outlined text-7xl opacity-30">cloud</span>
                            </div>
                            <div className="absolute bottom-0 w-full h-16 bg-[#4ade80] dark:bg-[#15803d] border-t-4 border-[#22c55e]"></div>

                            <div className="flex items-end gap-3 md:gap-5 mb-14 px-8 w-full justify-center">
                                {[...Array(Math.min(5, Math.ceil(years / 2)))].map((_, i) => (
                                    <div key={i} className="flex flex-col items-center origin-bottom transition-all duration-700" style={{ transform: `scale(${0.8 + (years * 0.1)})` }}>
                                        <div className={`size-${12 + i * 2} bg-primary rounded-full border-4 border-primary-dark relative z-10 shadow-lg`}>
                                            {i % 2 === 0 && <div className="absolute top-2 right-2 size-3 bg-red-500 rounded-full border-2 border-red-700 shadow-sm"></div>}
                                            {i % 3 === 0 && <div className="absolute top-6 left-2 size-3 bg-red-500 rounded-full border-2 border-red-700 shadow-sm"></div>}
                                        </div>
                                        <div className="w-4 h-20 bg-amber-800 border-x-4 border-amber-900 -mt-2"></div>
                                    </div>
                                ))}
                            </div>

                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white/95 dark:bg-black/80 backdrop-blur px-8 py-4 rounded-2xl font-black shadow-xl border-2 border-primary/30 text-center scale-110">
                                <span className="text-xs uppercase text-text-muted block mb-1">Total Savings Value</span>
                                <span className="text-3xl font-black text-primary">${calculatedAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
