import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Home,
    Search,
    PlusSquare,
    MessageCircle,
    User,
    Settings,
    Sun,
    Moon
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const { user, logout, updateTheme } = useAuth();
    const location = useLocation();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsRef = useRef(null);

    if (!user) return null;

    const currentUser = user;
    const isDark = user.theme === 'dark';
    const pathname = location.pathname;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                settingsRef.current &&
                !settingsRef.current.contains(event.target)
            ) {
                setIsSettingsOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsSettingsOpen(false);
            }
        };

        document.addEventListener('pointerdown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        
        return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) root.classList.add('dark');
        else root.classList.remove('dark');
    }, [isDark]);

    const toggleSettings = useCallback(() => {
        setIsSettingsOpen((prev) => !prev);
    }, []);

    const closeSettings = useCallback(() => {
        setIsSettingsOpen(false);
    }, []);

    const handleLogout = useCallback(async () => {
        await logout();
    }, [logout]);

    return (
        <aside className="
            fixed left-0 top-0 z-50 h-screen w-64 flex flex-col shadow-2xl
            bg-[#FFF8F0] dark:bg-[#0a0a0a]
            border-r border-zinc-200 dark:border-zinc-800/50
        ">
            <div className="flex flex-col h-full px-4 py-6">

                {/* Logo */}
                <Link to="/feed" className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="text-lg font-bold text-white">V</span>
                    </div>
                    <span className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Vibely
                    </span>
                </Link>

                <nav className="flex flex-col gap-2 flex-1">

                    <NavItem to="/feed" active={pathname === '/feed'} icon={Home}>
                        Home
                    </NavItem>

                    <NavItem to="/search" active={pathname.startsWith('/search')} icon={Search}>
                        Search
                    </NavItem>

                    <NavItem to="/createpost" active={pathname === '/createpost'} icon={PlusSquare}>
                        New Post
                    </NavItem>

                    <NavItem to="/chat" active={pathname.startsWith('/chat')} icon={MessageCircle}>
                        Messages
                    </NavItem>

                    <NavItem
                        to={`/u/${currentUser.username}`}
                        active={pathname.startsWith('/u/')}
                        icon={User}
                    >
                        Profile
                    </NavItem>

                    <div className="relative mt-auto" ref={settingsRef}>
                        <button
                            onClick={toggleSettings}
                            aria-haspopup="menu"
                            aria-expanded={isSettingsOpen}
                            className={`
                                flex items-center gap-3 h-10 px-3 rounded-lg transition w-full
                                ${isSettingsOpen
                                    ? 'bg-zinc-200 text-black dark:bg-zinc-900/80 dark:text-white'
                                    : 'text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-900/50'
                                }
                            `}
                        >
                            <Settings size={20} />
                            <span className="text-sm">Settings</span>
                        </button>

                        {isSettingsOpen && (
                            <div className="
                                absolute left-0 bottom-full mb-2 w-64 rounded-xl shadow-2xl
                                bg-[#FFF8F0] dark:bg-[#0f0f0f]
                                border border-zinc-200 dark:border-zinc-800/50
                            ">
                                <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800/50">
                                    <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                                        {currentUser.name}
                                    </p>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                        @{currentUser.username}
                                    </p>
                                </div>

                                <div className="py-2 px-2">
                                    <MenuLink to="/settings/account" onClick={closeSettings}>
                                        Account Settings
                                    </MenuLink>
                                    <MenuLink to="/settings/privacy" onClick={closeSettings}>
                                        Privacy & Security
                                    </MenuLink>
                                    <MenuLink to="/settings/notifications" onClick={closeSettings}>
                                        Notifications
                                    </MenuLink>

                                    <button
                                        onClick={() => updateTheme(isDark ? 'light' : 'dark')}
                                        className="
                                            w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg
                                            text-zinc-700 hover:bg-zinc-200
                                            dark:text-zinc-300 dark:hover:bg-zinc-900/50
                                        "
                                    >
                                        {isDark ? 'Light Mode' : 'Dark Mode'}
                                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                                    </button>
                                </div>

                                <div className="border-t border-zinc-200 dark:border-zinc-800/50 px-2 py-2">
                                    <button
                                        onClick={handleLogout}
                                        className="
                                            w-full text-left px-4 py-2 text-sm rounded-lg
                                            text-red-500 hover:bg-red-50
                                            dark:text-red-400 dark:hover:bg-red-950/30
                                        "
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </aside>
    );
}

const NavItem = React.memo(({ to, active, icon: Icon, children }) => (
    <Link
        to={to}
        className={`
            flex items-center gap-3 h-10 px-3 rounded-lg transition
            ${active
                ? 'bg-zinc-200 text-black dark:bg-zinc-900/80 dark:text-white'
                : 'text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-900/50'
            }
        `}
    >
        <Icon size={20} />
        <span className="text-sm">{children}</span>
    </Link>
));

const MenuLink = React.memo(({ to, onClick, children }) => (
    <Link
        to={to}
        onClick={onClick}
        className="
            block px-4 py-2 text-sm rounded-lg
            text-zinc-700 hover:bg-zinc-200
            dark:text-zinc-300 dark:hover:bg-zinc-900/50
        "
    >
        {children}
    </Link>
));

export default React.memo(Navbar);