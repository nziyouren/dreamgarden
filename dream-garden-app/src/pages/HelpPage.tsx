import { useEffect } from "react";
import { Link } from "react-router-dom";

export function HelpPage() {
    useEffect(() => {
        localStorage.setItem("dream_garden_help_seen", "true");
    }, []);

    const steps = [
        {
            number: 1,
            title: "Get Magic Drops",
            description: "Start by converting your USDC into Magic Drops. This is the magical currency you need to water seeds.",
            icon: "monetization_on",
            iconBg: "bg-emerald-50 text-emerald-500",
            footer: (
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-black/20 rounded-xl text-[10px] font-bold">
                    <span className="text-gray-400">1 USDC</span>
                    <span className="text-gray-300">→</span>
                    <span className="text-emerald-500">1 Magic Drop</span>
                </div>
            )
        },
        {
            number: 2,
            title: "Plant a Seed",
            description: "What is your dream? A new robot? A trip? Create a goal and Plant a Seed to start saving for it.",
            icon: "robot_2",
            iconBg: "bg-blue-50 text-blue-500",
            footer: (
                <div className="flex justify-center gap-2">
                    {['smart_toy', 'flight', 'lunch_dining'].map((icon, i) => (
                        <div key={i} className="size-8 rounded-full bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm text-orange-500">{icon}</span>
                        </div>
                    ))}
                </div>
            )
        },
        {
            number: 3,
            title: "Grow Dream",
            description: "Keep adding Magic Drops to your seed. Like watering a plant, regular deposits make your dream grow faster!",
            icon: "water_drop",
            iconBg: "bg-orange-50 text-orange-500",
            footer: (
                <div className="space-y-2">
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full w-[65%] bg-emerald-500 rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-emerald-500 font-bold text-center">65% Grown</p>
                </div>
            )
        },
        {
            number: 4,
            title: "Reach Goal",
            description: "You did it! Once your seed is fully grown, Harvest it to withdraw your funds and buy your dream item!",
            icon: "redeem",
            iconBg: "bg-pink-50 text-pink-500",
            footer: (
                <button disabled className="w-full py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-xl text-xs font-bold opacity-80 cursor-default">
                    Harvest
                </button>
            )
        }
    ];

    return (
        <main className="flex-grow flex flex-col items-center py-16 px-4 bg-[#f0f9f4] dark:bg-[#0a150f]">
            <div className="max-w-6xl w-full">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white dark:bg-card-dark rounded-full shadow-sm text-emerald-500 font-bold text-sm border border-emerald-100 dark:border-emerald-900/30">
                        <span className="material-symbols-outlined text-lg">wb_sunny</span>
                        WELCOME NEW GARDENER!
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[#1a2e1a] dark:text-white leading-[1.1]">
                        How to grow your <br />
                        <span className="text-primary italic">Dream Garden!</span>
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                        Follow these 4 simple steps to turn your savings into magical rewards. It's time to plant the seeds for your future!
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step) => (
                        <div key={step.number} className="relative bg-white dark:bg-card-dark rounded-3xl p-8 shadow-xl shadow-emerald-500/5 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300">
                            {/* Step Number Badge */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 size-10 bg-primary text-[#1a2e1a] rounded-full flex items-center justify-center font-black shadow-lg border-4 border-white dark:border-card-dark">
                                {step.number}
                            </div>

                            {/* Icon Container */}
                            <div className={`size-24 rounded-full ${step.iconBg} flex items-center justify-center mb-8 mt-2 group-hover:scale-110 transition-transform duration-300`}>
                                <span className="material-symbols-outlined text-5xl font-variation-fill">
                                    {step.icon}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black text-[#1a2e1a] dark:text-white mb-4">
                                {step.title}
                            </h3>
                            <p className="text-sm font-medium text-gray-400 leading-relaxed mb-10 flex-grow">
                                {step.description}
                            </p>

                            <div className="w-full mt-auto">
                                {step.footer}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Action */}
                <div className="mt-16 text-center">
                    <Link
                        to="/magic-drops"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-primary hover:bg-[#1ee01e] text-[#1a2e1a] text-xl font-black rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                    >
                        Start Your First Dream
                        <span className="material-symbols-outlined font-black">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
