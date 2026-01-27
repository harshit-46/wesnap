import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import FeedAside from "../components/FeedAside";

export default function FeedPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/feed", {
                    credentials: "include",
                });
                const data = await res.json();
                setPosts(data.posts || []);
            } catch (err) {
                console.error("Feed fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    const handleLike = useCallback((postId, liked) => {
        setPosts(prev =>
            prev.map(p =>
                p._id === postId
                    ? {
                        ...p,
                        likedByMe: liked,
                        likeCount: liked
                            ? p.likeCount + 1
                            : Math.max(0, p.likeCount - 1),
                    }
                    : p
            )
        );
    }, []);

    const handleCommentAdded = useCallback((postId) => {
        setPosts(prev =>
            prev.map(p =>
                p._id === postId
                    ? { ...p, commentCount: p.commentCount + 1 }
                    : p
            )
        );
    }, []);

    const handleDelete = useCallback((postId) => {
        setPosts(prev => prev.filter(p => p._id !== postId));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-neutral-300 border-t-neutral-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-600 dark:text-neutral-400">Loading feed...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex">
                <div className="fixed left-0 top-0 h-screen w-64 border-r border-neutral-200 dark:border-neutral-800 bg-[#F9FAFB] dark:bg-neutral-950 hidden lg:block">
                    <Navbar/>
                </div>

                <main className="flex-1 lg:ml-64 lg:mr-90 px-3 sm:px-4 lg:px-5 py-8 space-y-6">
                    {posts.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                No posts yet
                            </h3>
                            <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                                Follow some users to start seeing their posts in your feed
                            </p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <Post
                                key={post._id}
                                post={post}
                                onLike={handleLike}
                                onDelete={handleDelete}
                                onCommentAdded={handleCommentAdded}
                            />
                        ))
                    )}
                </main>

                <div className="fixed right-0 top-0 h-screen w-90 dark:border-zinc-800 bg-white dark:bg-zinc-950 hidden lg:block">
                    <FeedAside />
                </div>
        </div>
    );
}