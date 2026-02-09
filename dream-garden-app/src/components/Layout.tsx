import type { ReactNode } from "react";
import { Header } from "./Header.tsx";
import { Link } from "react-router-dom";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="flex flex-col min-h-screen relative overflow-x-hidden">
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px]"></div>
            </div>
            <Header />
            <div className="pt-20 flex-grow flex flex-col">
                {children}
            </div>

            <footer className="mt-auto border-t border-[#f0f5f0] dark:border-white/10 py-8 bg-card-light dark:bg-card-dark">
                <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">emoji_nature</span>
                        <span className="font-bold text-sm text-text-muted">© 2023 Dream Garden</span>
                    </div>
                </div>
            </footer>

            {/* Floating Help Button */}
            <Link
                to="/help"
                className="fixed bottom-8 right-8 z-[100] group"
                aria-label="Help"
            >
                <div className="relative">
                    {/* Shadow/Ring effect - Even softer and lighter */}
                    <div className="absolute inset-0 bg-orange-300/5 rounded-full scale-110 blur-md group-hover:bg-orange-300/10 transition-all duration-300"></div>

                    {/* Main Button - Lightened 3D shadow color */}
                    <div className="relative size-14 bg-[#FF8A33] rounded-full flex items-center justify-center shadow-[0_4px_0_0_#EF7E22] group-hover:shadow-[0_2px_0_0_#EF7E22] group-hover:translate-y-[2px] group-active:shadow-none group-active:translate-y-[4px] transition-all duration-150 border-[3px] border-white/30">
                        <span className="material-symbols-outlined text-3xl text-white font-black">
                            question_mark
                        </span>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#1a2e1a] text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                        How to Grow Your Garden?
                    </div>
                </div>
            </Link>
        </div>
    );
}
