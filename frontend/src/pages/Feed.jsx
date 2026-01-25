/*

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Post from "../components/Post";

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
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                Loading feed...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Navbar />
            <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
                {posts.length === 0 ? (
                    <p className="text-center text-zinc-500">
                        No posts yet. Follow users to see posts.
                    </p>
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
        </div>
    );
}

*/








import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Post from "../components/Post";

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
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
            <Navbar />
            <main className="md:ml-64 max-w-3xl mx-auto px-4 py-10 space-y-6">
                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <svg 
                            className="w-16 h-16 mx-auto mb-6 text-neutral-300 dark:text-neutral-600" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
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
        </div>
    );
}