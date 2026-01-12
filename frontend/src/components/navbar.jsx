import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function Navbar({ currentPage = 'home' }) {
    const { user, logout } = useAuth();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsRef = useRef(null);

    const currentUser = user ?? {};

    // close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                settingsRef.current &&
                !settingsRef.current.contains(event.target)
            ) {
                setIsSettingsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // memoized handlers (important for React.memo)
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
        <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/feed" className="flex items-center gap-3 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <span className="text-lg font-bold text-white">V</span>
                        </div>
                        <span className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Vibely
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-2">

                        {/* Home */}
                        <NavItem to="/feed" active={currentPage === 'home'}>
                            Home
                        </NavItem>

                        {/* Search */}
                        <NavItem to="/search" active={currentPage === 'search'}>
                            Search
                        </NavItem>

                        {/* Create Post */}
                        <Link
                            to="/createpost"
                            className="hidden md:flex items-center justify-center gap-2 h-10 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white"
                        >
                            + New Post
                        </Link>

                        {/* Profile */}
                        <Link
                            to={currentUser?.username ? `/u/${currentUser.username}` : '#'}
                            className={`flex items-center gap-2 h-10 px-3 rounded-lg transition ${currentPage === 'profile'
                                    ? 'bg-zinc-800 text-white'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                }`}
                        >
                            {currentUser?.profileImage ? (
                                <img
                                    src={currentUser.profileImage}
                                    alt={currentUser.name}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                            ) : (
                                <span className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">
                                    {(currentUser?.username || 'U').charAt(0).toUpperCase()}
                                </span>
                            )}
                            <span className="hidden lg:inline text-sm">Profile</span>
                        </Link>

                        {/* Settings */}
                        <div className="relative" ref={settingsRef}>
                            <button
                                onClick={toggleSettings}
                                className="flex items-center gap-2 h-10 px-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                            >
                                ⚙️
                                <span className="hidden lg:inline text-sm">Settings</span>
                            </button>

                            {isSettingsOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl">
                                    <div className="px-4 py-3 border-b border-zinc-800">
                                        <p className="font-semibold text-sm">
                                            {currentUser?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            @{currentUser?.username || 'unknown'}
                                        </p>
                                    </div>

                                    <MenuLink to="/settings/account" onClick={closeSettings}>
                                        Account Settings
                                    </MenuLink>

                                    <MenuLink to="/settings/privacy" onClick={closeSettings}>
                                        Privacy & Security
                                    </MenuLink>

                                    <MenuLink to="/settings/notifications" onClick={closeSettings}>
                                        Notifications
                                    </MenuLink>

                                    <div className="border-t border-zinc-800">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </nav>
                </div>
            </div>
        </header>
    );
}

const NavItem = React.memo(({ to, active, children }) => (
    <Link
        to={to}
        className={`flex items-center justify-center h-10 px-3 rounded-lg transition ${active
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
    >
        <span className="text-sm">{children}</span>
    </Link>
));

const MenuLink = React.memo(({ to, onClick, children }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
    >
        {children}
    </Link>
));

export default React.memo(Navbar);