import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Post from "../components/Post";
import FeedAside from "../components/FeedAside";
import FeedSkeleton from "../components/skeletons/FeedSkeleton";

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

    const handleDelete = useCallback(async (postId) => {
        const loadingToast = toast.loading("Deleting post...");
        try {
            const response = await fetch(
                `http://localhost:3000/api/posts/${postId}/discard`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Delete failed");
            }

            setPosts(prev => prev.filter(p => p._id !== postId));
            toast.success("Post deleted successfully", {
                id: loadingToast,
            });

        } catch (err) {
            toast.error(err.message || "Post deletion failed", {
                id: loadingToast,
            });
        }
    }, [setPosts]);


    if (loading) {
        return (
            <FeedSkeleton />
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex">
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
                    posts.map((post, index) => (
                        <Post
                            key={post._id}
                            post={post}
                            index={index}
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