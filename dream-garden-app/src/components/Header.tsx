import { ConnectButton } from "@mysten/dapp-kit";

export function Header() {
    return (
        <nav className="sticky top-0 z-50 w-full bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-white/20 dark:border-white/5 px-4 sm:px-10 py-4 transition-all duration-300">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-12 bg-primary rounded-2xl rotate-3 flex items-center justify-center text-background-dark shadow-sm transform hover:rotate-6 transition-transform border-4 border-white dark:border-white/10">
                        <span className="material-symbols-outlined text-3xl">emoji_nature</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-text-main dark:text-white">Dream Garden</h1>
                </div>
                <div className="flex items-center gap-3">
                    <ConnectButton className="!bg-white !text-text-main !font-bold !rounded-full !h-12 !px-4 !border-2 !border-primary/30 hover:!bg-gray-50" />

                    <button className="size-12 flex items-center justify-center bg-accent text-white rounded-full hover:bg-red-500 hover:rotate-12 transition-all shadow-md">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
