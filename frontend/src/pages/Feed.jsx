import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/navbar";
import Post from "../components/Post";
import { useAuth } from "../context/useAuth";

export default function FeedPage() {
    const { user } = useAuth();
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

    const handleLike = useCallback((postId) => {
        setPosts(prev =>
            prev.map(post => {
                if (post._id !== postId) return post;

                const hasLiked = post.likes.includes(user._id);

                return {
                    ...post,
                    likes: hasLiked
                        ? post.likes.filter(id => id !== user._id)
                        : [...post.likes, user._id],
                };
            })
        );
    }, [user]);

    const handleComment = useCallback((postId, content) => {
        setPosts(prev =>
            prev.map(post => {
                if (post._id !== postId) return post;

                return {
                    ...post,
                    comments: [
                        ...post.comments,
                        {
                            _id: Date.now().toString(),
                            user,
                            content,
                            createdAt: new Date().toISOString(),
                        },
                    ],
                };
            })
        );
    }, [user]);

    const handleDelete = useCallback((postId) => {
        if (!window.confirm("Delete this post?")) return;

        setPosts(prev => prev.filter(post => post._id !== postId));
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
                            loggedInUser={user.username}
                            onLike={handleLike}
                            onComment={handleComment}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </main>
        </div>
    );
}