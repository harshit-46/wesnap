import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/navbar";
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