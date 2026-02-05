import type { ReactNode } from "react";
import { Header } from "./Header.tsx";

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
            {children}
            <footer className="mt-auto border-t border-[#f0f5f0] dark:border-white/10 py-8 bg-card-light dark:bg-card-dark">
                <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">emoji_nature</span>
                        <span className="font-bold text-sm text-text-muted">© 2023 Dream Garden</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
