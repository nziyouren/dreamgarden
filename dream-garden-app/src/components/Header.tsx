import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Link, useLocation } from "react-router-dom";

export function Header() {
    const location = useLocation();
    const account = useCurrentAccount();

    const navItems = [
        { name: "My Garden", icon: "potted_plant", path: "/" },
        { name: "Magic Drops", icon: "token", path: "/magic-drops" },
        { name: "Seeds Gallery", icon: "gallery_thumbnail", path: "/gallery" },
        { name: "Garden History", icon: "history", path: "/history" },
    ];

    return (
        <nav className="fixed top-0 z-50 w-full bg-white shadow-lg px-4 sm:px-10 h-20 transition-all duration-300">
            <style>{`
                /* 覆盖 ConnectButton 的默认样式 */
                .custom-connect-btn button {
                    background-color: #25f425 !important; 
                    color: #1a2e1a !important; 
                    font-weight: 900 !important;
                    border-radius: 9999px !important;
                    height: 40px !important; /* 统一高度 */
                    padding-left: 1.25rem !important;
                    padding-right: 1.25rem !important;
                    font-size: 0.8rem !important;
                    transition: all 0.2s !important;
                    border: none !important;
                    box-shadow: 0 4px 10px 0 rgba(37, 244, 37, 0.2) !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 8px !important;
                    vertical-align: middle !important;
                    box-sizing: border-box !important;
                }
                .custom-connect-btn button:hover {
                    transform: scale(1.02) !important;
                    box-shadow: 0 6px 15px rgba(37, 244, 37, 0.15) !important;
                }
                
                .custom-connect-btn div[data-connected="true"] button::before {
                    content: 'account_balance_wallet';
                    font-family: 'Material Symbols Outlined';
                    font-size: 18px;
                    font-weight: normal;
                }

                /* 扁平精致下拉菜单 */
                div[role="menu"] {
                    background-color: white !important;
                    border-radius: 16px !important;
                    padding: 6px !important;
                    border: 1px solid #e5e7eb !important; /* 更实线的扁平边框 */
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important; /* 更扁平的阴影 */
                    min-width: 200px !important;
                    margin-top: 8px !important;
                    animation: dropdownFadeIn 0.15s ease-out !important;
                }

                @keyframes dropdownFadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                div[role="menuitem"] {
                    padding: 10px 14px !important;
                    border-radius: 10px !important;
                    font-weight: 600 !important;
                    font-size: 0.85rem !important;
                    transition: all 0.15s ease !important;
                    cursor: pointer !important;
                    color: #1a2e1a !important;
                    margin-bottom: 1px !important;
                }

                div[role="menuitem"]:hover {
                    background-color: #f0fdf4 !important;
                    color: #25f425 !important;
                    /* 移除 translateX(4px) 以防止文字跳动 */
                }

                /* 针对断开连接按钮的特殊样式 */
                div[role="menuitem"]:last-child {
                    margin-top: 4px !important;
                    padding-top: 10px !important;
                    color: #666 !important;
                    /* 移除了 border-top */
                }

                div[role="menuitem"]:last-child:hover {
                    background-color: #fef2f2 !important;
                    color: #ef4444 !important;
                }
            `}</style>
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
                <div className="flex items-center gap-4 h-full">
                    <div className="flex items-center h-10 gap-4">
                        <div className="custom-connect-btn flex items-center" data-connected={!!account}>
                            <ConnectButton connectText="Connect Wallet" />
                        </div>

                        <div className="size-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-50 flex items-center justify-center shrink-0 box-border">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${account?.address || 'default'}&backgroundColor=f5f5f5`}
                                alt="avatar"
                                className="size-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
