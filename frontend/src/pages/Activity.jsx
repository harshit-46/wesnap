import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';

export default function Activity() {
    const { user } = useAuth();
    const userId = user ? user._id : null;
    const [activeTab, setActiveTab] = useState('all');

    // Mock activity data
    const activities = [
        {
            id: 1,
            type: 'post',
            action: 'published',
            title: 'How to Build Scalable React Applications',
            timestamp: '2 hours ago',
            engagement: { likes: 234, comments: 45, views: 1200 },
            category: 'Engineering'
        },
        {
            id: 2,
            type: 'comment',
            action: 'commented on',
            title: 'The Future of Web Development',
            timestamp: '5 hours ago',
            engagement: { likes: 12, replies: 3 },
            category: 'Discussion'
        },
        {
            id: 3,
            type: 'like',
            action: 'liked',
            title: 'Design Systems: A Complete Guide',
            timestamp: '1 day ago',
            category: 'Design'
        },
        {
            id: 4,
            type: 'post',
            action: 'published',
            title: 'Understanding TypeScript Generics',
            timestamp: '2 days ago',
            engagement: { likes: 567, comments: 89, views: 3400 },
            category: 'Engineering'
        },
        {
            id: 5,
            type: 'share',
            action: 'shared',
            title: 'CSS Grid vs Flexbox: When to Use What',
            timestamp: '3 days ago',
            engagement: { shares: 23 },
            category: 'Design'
        },
        {
            id: 6,
            type: 'comment',
            action: 'commented on',
            title: 'Remote Work Best Practices',
            timestamp: '4 days ago',
            engagement: { likes: 8, replies: 2 },
            category: 'Career'
        },
        {
            id: 7,
            type: 'post',
            action: 'published',
            title: 'State Management in Modern React',
            timestamp: '5 days ago',
            engagement: { likes: 445, comments: 67, views: 2100 },
            category: 'Engineering'
        },
        {
            id: 8,
            type: 'like',
            action: 'liked',
            title: 'Accessibility in Web Design',
            timestamp: '1 week ago',
            category: 'Design'
        }
    ];

    const [userStats, setUserStats] = useState({
        likes: 0,
        comments: 0,
        posts: 0,
        followers: 0
    });

    useEffect(() => {
        if (!userId) {
            return;
        }

        const fetchUserStats = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/stats/${userId}`,
                    { credentials: 'include' }
                );

                if (!res.ok) {
                    throw new Error(`HTTP error ${res.status}`);
                }

                const userData = await res.json();
                setUserStats({ likes: userData.stats.likesCount, comments: userData.stats.commentsCount, posts: userData.stats.postsCount, followers: userData.stats.followersCount });

            } catch (err) {
                console.error("Could not fetch user stats", err);
            }
        };

        fetchUserStats();

    }, [userId]);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'post':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                );
            case 'comment':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                );
            case 'like':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                );
            case 'share':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Header with Stats */}
                <header className="mb-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                            Your Activity
                        </h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Track your engagement and contributions
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 hover:shadow-md transition-shadow">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">Posts</p>
                            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{userStats.posts}</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 hover:shadow-md transition-shadow">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">Comments</p>
                            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{userStats.comments}</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 hover:shadow-md transition-shadow">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">Likes</p>
                            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{userStats.likes}</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 hover:shadow-md transition-shadow">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">Followers</p>
                            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{userStats.followers}</p>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800">
                    <nav className="flex gap-6">
                        {['all', 'posts', 'comments', 'likes'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab
                                    ? 'text-zinc-900 dark:text-zinc-100'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Activity Feed */}
                <div className="space-y-3">
                    {activities
                        .filter(activity => activeTab === 'all' || activity.type === activeTab.slice(0, -1))
                        .map((activity, index) => (
                            <div
                                key={activity.id}
                                className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-5 hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 group"
                                style={{
                                    animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`
                                }}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'post' ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400' :
                                        activity.type === 'comment' ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400' :
                                            activity.type === 'like' ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' :
                                                'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400'
                                        }`}>
                                        {getActivityIcon(activity.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                                                    You <span className="font-medium">{activity.action}</span>
                                                </p>
                                                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {activity.title}
                                                </h3>
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                                                {activity.category}
                                            </span>
                                        </div>

                                        {/* Engagement Stats */}
                                        {activity.engagement && (
                                            <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                                                {activity.engagement.views && (
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        {activity.engagement.views.toLocaleString()}
                                                    </span>
                                                )}
                                                {activity.engagement.likes && (
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                        </svg>
                                                        {activity.engagement.likes}
                                                    </span>
                                                )}
                                                {activity.engagement.comments && (
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                        {activity.engagement.comments}
                                                    </span>
                                                )}
                                                {activity.engagement.replies && (
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                        </svg>
                                                        {activity.engagement.replies}
                                                    </span>
                                                )}
                                                {activity.engagement.shares && (
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                        </svg>
                                                        {activity.engagement.shares}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {activity.timestamp}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Load More */}
                <div className="mt-8 text-center">
                    <button className="px-6 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        Load More Activity
                    </button>
                </div>
            </main>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}