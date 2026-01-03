import React, { useState } from 'react';
import Post from '../components/Post';
import { useAuth } from "../context/useAuth";

// Main Profile Page
export default function ProfilePage() {
    const {logout} = useAuth();
    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState([
        {
            id: 1,
            user: { name: 'John Doe', username: 'johndoe' },
            content: 'Just finished working on a new project! Really excited about how it turned out. The structured design makes everything so much cleaner and easier to maintain. 🚀',
            date: 'December 31, 2025',
            likes: [1, 3, 5],
            comments: 5,
            imageUrl: null
        },
        {
            id: 2,
            user: { name: 'John Doe', username: 'johndoe' },
            content: 'Beautiful sunset view from my workspace today! Sometimes you need to take a moment to appreciate the little things. 🌅',
            date: 'December 30, 2025',
            likes: [1, 2],
            comments: 8,
            imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
        },
        {
            id: 3,
            user: { name: 'John Doe', username: 'johndoe' },
            content: 'Learning something new every day! Today I dove into advanced CSS techniques and I\'m amazed at what you can do with modern web technologies. 💻✨',
            date: 'December 28, 2025',
            likes: [1],
            comments: 3,
            imageUrl: null
        }
    ]);

    const currentUser = { id: 1, name: 'John Doe', username: 'johndoe' };
    const profileUser = currentUser; // In real app, this could be different user

    const handleLike = (postId) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                const isLiked = post.likes.includes(currentUser.id);
                return {
                    ...post,
                    likes: isLiked
                        ? post.likes.filter(id => id !== currentUser.id)
                        : [...post.likes, currentUser.id]
                };
            }
            return post;
        }));
    };

    const handleDelete = (postId) => {
        if (confirm('Are you sure you want to delete this post?')) {
            setPosts(posts.filter(post => post.id !== postId));
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <a href="/" className="text-zinc-400 hover:text-white transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </a>
                            <h1 className="text-xl font-semibold">Profile</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <a href="/" className="text-zinc-400 hover:text-white font-medium transition duration-200 text-sm">
                                Home
                            </a>
                            <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-5 rounded-lg transition duration-200 text-sm" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 py-8">
                {/* Profile Header Section */}
                <section className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-6">
                    {/* Cover Image */}
                    <div className="h-48 bg-linear-to-br from-zinc-800 via-zinc-700 to-zinc-800 relative">
                        <div className="absolute inset-0 opacity-20">
                            <div className="w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="px-6 pb-6">
                        {/* Profile Picture */}
                        <div className="flex justify-between items-start -mt-16 mb-4">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-zinc-900 bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-4xl font-bold shadow-xl">
                                    {profileUser.name.charAt(0)}
                                </div>
                                <button className="absolute bottom-1 right-1 w-9 h-9 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center border-2 border-zinc-900 transition">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                            <button className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 text-sm">
                                Edit Profile
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold mb-1">{profileUser.name}</h2>
                            <p className="text-zinc-400 text-sm mb-3">@{profileUser.username}</p>
                            <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                                Software developer | Tech enthusiast | Coffee lover ☕ | Building cool things on the internet
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 pt-4 border-t border-zinc-800">
                            <div className="text-center">
                                <p className="text-xl font-bold">{posts.length}</p>
                                <p className="text-zinc-400 text-xs">Posts</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold">342</p>
                                <p className="text-zinc-400 text-xs">Followers</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold">189</p>
                                <p className="text-zinc-400 text-xs">Following</p>
                            </div>
                            <div className="text-center ml-auto">
                                <p className="text-zinc-400 text-xs">Joined</p>
                                <p className="text-sm font-medium">Jan 2024</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tabs */}
                <div className="border-b border-zinc-800 mb-6">
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'posts' ? 'text-white' : 'text-zinc-400 hover:text-zinc-300'
                                }`}
                        >
                            Posts
                            {activeTab === 'posts' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('media')}
                            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'media' ? 'text-white' : 'text-zinc-400 hover:text-zinc-300'
                                }`}
                        >
                            Media
                            {activeTab === 'media' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('likes')}
                            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'likes' ? 'text-white' : 'text-zinc-400 hover:text-zinc-300'
                                }`}
                        >
                            Likes
                            {activeTab === 'likes' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Posts Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-zinc-300">My Posts</h3>
                        <a href="/createpost" className="text-zinc-400 hover:text-white text-sm font-medium transition">
                            + Create Post
                        </a>
                    </div>

                    {activeTab === 'posts' && (
                        <div className="space-y-4">
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <Post
                                        key={post.id}
                                        post={post}
                                        currentUser={currentUser}
                                        onLike={handleLike}
                                        onDelete={handleDelete}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-xl">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-zinc-300 mb-2">No posts yet</h3>
                                    <p className="text-zinc-500 text-sm mb-4">Share your first post with your followers</p>
                                    <a href="/createpost" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create Post
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'media' && (
                        <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-xl">
                            <svg className="w-16 h-16 mx-auto mb-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-zinc-300 mb-2">No media yet</h3>
                            <p className="text-zinc-500 text-sm">Posts with photos and videos will appear here</p>
                        </div>
                    )}

                    {activeTab === 'likes' && (
                        <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-xl">
                            <svg className="w-16 h-16 mx-auto mb-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-zinc-300 mb-2">No likes yet</h3>
                            <p className="text-zinc-500 text-sm">Posts you've liked will appear here</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}