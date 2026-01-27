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
            h-screen w-64 border-r border-neutral-200 dark:border-neutral-800
            bg-[#F9FAFB] dark:bg-neutral-950">
            <div className="flex flex-col h-full px-4 py-6">

                <Link to="/feed" className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center shadow-sm">
                        <span className="text-lg font-bold text-white">V</span>
                    </div>
                    <span className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
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
                                flex items-center gap-3 h-10 px-3 rounded-xl transition w-full
                                ${isSettingsOpen
                                    ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                                    : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/60 cursor-pointer'
                                }
                            `}
                        >
                            <Settings size={20} />
                            <span className="text-sm font-medium">Settings</span>
                        </button>

                        {isSettingsOpen && (
                            <div className="
                                absolute left-0 bottom-full mb-2 w-64 rounded-xl shadow-lg
                                bg-white dark:bg-neutral-900
                                border border-neutral-200 dark:border-neutral-800
                            ">
                                <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                                    <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                                        {currentUser.name}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
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
                                            w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-xl
                                            text-neutral-700 hover:bg-neutral-50
                                            dark:text-neutral-300 dark:hover:bg-neutral-800/60 cursor-pointer
                                        "
                                    >
                                        {isDark ? 'Light Mode' : 'Dark Mode'}
                                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                                    </button>
                                </div>

                                <div className="border-t border-neutral-200 dark:border-neutral-800 px-2 py-2">
                                    <button
                                        onClick={handleLogout}
                                        className="
                                            w-full text-left px-4 py-2.5 text-sm font-medium rounded-xl
                                            text-red-600 hover:bg-red-50/70
                                            dark:text-red-400 dark:hover:bg-red-900/40 cursor-pointer
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
            flex items-center gap-3 h-10 px-3 rounded-xl transition font-medium text-sm
            ${active
                ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/60'
            }
        `}
    >
        <Icon size={20} />
        <span>{children}</span>
    </Link>
));

const MenuLink = React.memo(({ to, onClick, children }) => (
    <Link
        to={to}
        onClick={onClick}
        className="
            block px-4 py-2.5 text-sm font-medium rounded-xl
            text-neutral-700 hover:bg-neutral-50
            dark:text-neutral-300 dark:hover:bg-neutral-800/60
        "
    >
        {children}
    </Link>
));

export default React.memo(Navbar);