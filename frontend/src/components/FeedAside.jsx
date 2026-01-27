import React from 'react';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';

const FeedAside = () => {

    const pulseItems = [
        {
            id: 1,
            type: 'chat',
            user: 'Harshit Gupta',
            avatar: 'H',
            preview: 'Typing...',
            time: 'just now',
            online: true,
        },
        {
            id: 2,
            type: 'reaction',
            user: 'Aryan Singhal',
            avatar: 'A',
            preview: 'liked your post "Weekend vibes ☕"',
            time: '5m ago',
        },
        {
            id: 3,
            type: 'reply',
            user: 'Priya Sharma',
            avatar: 'P',
            preview: 'Same energy bro 🔥',
            time: '12m ago',
        },
    ];

    return (
        <aside
            className="
                hidden lg:block
                w-90 dark:border-zinc-800
                bg-white dark:bg-zinc-950
            "
        >
            <div className="sticky top-0 z-10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 p-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    Vibe Pulse
                    <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-2 py-0.5 rounded-full animate-pulse">
                        Live
                    </span>
                </h2>
            </div>

            <div className="p-4 space-y-4">
                {pulseItems.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 dark:text-zinc-400">
                        <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Your network is quiet right now...</p>
                        <p className="text-xs mt-1">New vibes will appear here</p>
                    </div>
                ) : (
                    pulseItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900/70 transition-colors cursor-pointer border-l-2 border-blue-500/30 dark:border-blue-600/50"
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
                                    {item.avatar}
                                </div>
                                {item.online && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-zinc-950" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate text-gray-900 dark:text-white">
                                    {item.user}
                                </p>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-0.5">
                                    {item.preview}
                                </p>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-500 mt-1">
                                    {item.time}
                                </p>
                            </div>

                            {item.type === 'chat' && (
                                <MessageCircle className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                            )}
                            {item.type === 'reaction' && (
                                <Heart className="w-4 h-4 text-red-500 dark:text-red-400" />
                            )}
                            {item.type === 'reply' && (
                                <MessageCircle className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                            )}
                        </div>
                    ))
                )}

                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                        See all activity →
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default FeedAside;