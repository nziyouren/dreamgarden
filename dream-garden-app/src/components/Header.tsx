import { ConnectButton } from "@mysten/dapp-kit";
import { Link, useLocation } from "react-router-dom";

export function Header() {
    const location = useLocation();

    const navItems = [
        { name: "My Garden", icon: "potted_plant", path: "/dashboard" },
        { name: "Garden history", icon: "history", path: "/history" },
    ];

    return (
        <nav className="fixed top-0 z-50 w-full bg-white shadow-lg px-4 sm:px-10 h-20 transition-all duration-300">
            <div className="max-w-[1240px] h-full mx-auto flex items-center justify-between">
                {/* Left: Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-text-main shadow-sm transform hover:rotate-6 transition-transform">
                        <span className="material-symbols-outlined text-2xl font-bold">emoji_nature</span>
                    </div>
                    <h1 className="hidden sm:block text-xl font-black tracking-tight text-text-main">
                        Dream Garden
                    </h1>
                </Link>

                {/* Middle: Navigation */}
                <div className="flex items-center gap-8 px-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-2 group transition-all duration-200 ${location.pathname === item.path
                                ? "text-text-main"
                                : "text-text-muted hover:text-text-main"
                                }`}
                        >
                            <span className={`material-symbols-outlined text-xl group-hover:scale-110 transition-transform ${location.pathname === item.path ? "font-bold" : ""
                                }`}>
                                {item.icon}
                            </span>
                            <span className={`font-bold text-sm tracking-wide ${location.pathname === item.path ? "text-text-main" : ""
                                }`}>
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <ConnectButton className="!bg-primary !text-text-main !font-black !rounded-full !h-12 !px-6 !border-none !text-sm hover:!scale-105 active:!scale-95 transition-all shadow-[0_4px_14px_0_rgba(37,244,37,0.39)] hover:shadow-[0_6px_20px_rgba(37,244,37,0.23)]" />

                    <div className="size-11 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f5f5f5"
                            alt="avatar"
                            className="size-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}

