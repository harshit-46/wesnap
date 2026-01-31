import React, { useState, useEffect } from 'react';
import UserCard from '../components/UserCard';
import { useAuth } from '../context/useAuth';

export default function SearchUsersPage() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [users, setUsers] = useState([]);

    const currentUser = user;

    useEffect(() => {
        if (!searchQuery.trim()) {
            setUsers([]);
            return;
        }

        const timer = setTimeout(() => {
            const fetchUsers = async () => {
                try {
                    const res = await fetch(
                        `http://localhost:3000/api/search?query=${searchQuery}`,
                        { credentials: "include" }
                    );
                    const data = await res.json();
                    setUsers(data);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchUsers();
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery])

    const handleFollow = (userId) => {
        setUsers(users.map(user => {
            if (user.id === userId) {
                const isFollowing = user.followers.includes(currentUser.id);
                return {
                    ...user,
                    followers: isFollowing
                        ? user.followers.filter(id => id !== currentUser.id)
                        : [...user.followers, currentUser.id]
                };
            }
            return user;
        }));
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = searchQuery === '' ||
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase());

        if (activeFilter === 'all') return matchesSearch;
        if (activeFilter === 'following') return matchesSearch && user.followers.includes(currentUser.id);
        if (activeFilter === 'followers') return matchesSearch;
        if (activeFilter === 'suggested') return matchesSearch && !user.followers.includes(currentUser.id);

        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex">
            <main className="flex-1 lg:ml-64 px-4 py-10">
                <div className="max-w-3xl mx-auto">
                    <section className="mb-10">
                        <div className="space-y-4">
                            <div className="relative">
                                <svg
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by username or name..."
                                    className="
                                        w-full bg-white dark:bg-neutral-900
                                        border border-neutral-200 dark:border-neutral-700
                                        rounded-xl pl-12 pr-5 py-3.5
                                        text-neutral-900 dark:text-neutral-100
                                        placeholder-neutral-400 dark:placeholder-neutral-500
                                        focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500
                                        focus:ring-1 focus:ring-neutral-200 dark:focus:ring-neutral-700
                                        shadow-sm transition
                                    "
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
                                {filteredUsers.length} {filteredUsers.length === 1 ? 'User' : 'Users'} Found
                            </h2>
                        </div>

                        {filteredUsers.length > 0 ? (
                            <div className="space-y-4">
                                {filteredUsers.map(user => (
                                    <UserCard
                                        key={user._id}
                                        user={user}
                                        currentUser={currentUser}
                                        onFollow={handleFollow}
                                    />
                                ))}
                            </div>
                        ) : searchQuery.trim() ? (
                            <div className="text-center py-16">
                                <svg
                                    className="w-16 h-16 mx-auto mb-5 text-neutral-300 dark:text-neutral-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <h3 className="text-xl font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                    No users found
                                </h3>
                                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                                    Try adjusting your search or check the spelling
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-16 text-neutral-500 dark:text-neutral-400">
                                Start typing to search for users
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}