import React, { useState , useEffect} from 'react';
import UserCard from '../components/UserCard';
import Navbar from '../components/navbar';
import { useAuth } from '../context/useAuth';

// Main Search Users Page
export default function SearchUsersPage() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [users, setUsers] = useState([]);

    const currentUser = user;

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/users`
            );
            const data = await res.json();
            setUsers(data.users);
        };

        fetchUsers();
    }, []);


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
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.bio.toLowerCase().includes(searchQuery.toLowerCase());

        if (activeFilter === 'all') return matchesSearch;
        if (activeFilter === 'following') return matchesSearch && user.followers.includes(currentUser.id);
        if (activeFilter === 'followers') return matchesSearch; 
        if (activeFilter === 'suggested') return matchesSearch && !user.followers.includes(currentUser.id);

        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <Navbar />

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 py-8">
                {/* Search Section */}
                <section className="mb-8">
                    <div className="space-y-4">
                        {/* Search Input */}
                        <div className="relative">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by username or name..."
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                            />
                        </div>
                    </div>
                </section>

                {/* Search Results */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-zinc-300">
                            {filteredUsers.length} Users Found
                        </h2>
                    </div>

                    {filteredUsers.length > 0 ? (
                        <div className="space-y-3">
                            {filteredUsers.map(user => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    currentUser={currentUser}
                                    onFollow={handleFollow}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto mb-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-zinc-300 mb-2">No users found</h3>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}