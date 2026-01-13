/*


import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { timeAgo } from "../utils/timeAgo";
import { useAuth } from "../context/useAuth";

function Post({ post, onLike, onDelete, onCommentAdded }) {
    const { user } = useAuth();

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = useCallback(() => {
        setShowMenu(prev => !prev);
    }, []);

    const toggleComments = useCallback(async () => {
        if (!showComments) {
            setLoadingComments(true);
            try {
                const res = await fetch(
                    `http://localhost:3000/api/comments/${post._id}`,
                    { credentials: "include" }
                );
                const data = await res.json();
                setComments(data.comments || []);
            } catch (err) {
                console.error("Failed to load comments", err);
            } finally {
                setLoadingComments(false);
            }
        }
        setShowComments(prev => !prev);
    }, [showComments, post._id]);

    const handleLike = async () => {
        try {
            const res = await fetch(
                `http://localhost:3000/api/posts/${post._id}/like`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const data = await res.json();

            onLike?.(post._id, data.liked);
        } catch (err) {
            console.error("Like failed", err);
        }
    };


    const handleCommentSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (!commentText.trim()) return;

            try {
                const res = await fetch("http://localhost:3000/api/comments", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        postId: post._id,
                        content: commentText,
                    }),
                });

                const data = await res.json();

                setComments(prev => [data.comment, ...prev]);
                setCommentText("");

                onCommentAdded?.(post._id);
            } catch (err) {
                console.error("Comment failed", err);
            }
        },
        [commentText, post._id, onCommentAdded]
    );

    const isOwnPost =
        user?.username && post?.userId?.username
            ? user.username === post.userId.username
            : false;

    return (
        <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Link to={`/u/${post.userId.username}`} className="shrink-0">
                        <div className="w-11 h-11 rounded-full bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-sm font-semibold">
                            {(post.userId?.name || post.userId?.username || "U")
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    </Link>

                    <div>
                        <Link to={`/u/${post.userId.username}`}>
                            <h4 className="font-semibold text-sm text-white">
                                {post.userId?.name || "Unknown"}
                            </h4>
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                            @{post.userId?.username}
                            <span>•</span>
                            <span>{timeAgo(post.createdAt)}</span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={toggleMenu}
                        className="text-zinc-500 hover:text-zinc-300"
                    >
                        ⋮
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg py-1 z-10">
                            {isOwnPost ? (
                                <button
                                    onClick={() => onDelete?.(post._id)}
                                    className="menu-btn text-red-400"
                                >
                                    Delete Post
                                </button>
                            ) : (
                                <button className="menu-btn">Report Post</button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <p className="text-zinc-200 text-sm mb-4 whitespace-pre-wrap">
                {post.content}
            </p>

            {post.imageUrl && (
                <img
                    src={post.imageUrl}
                    alt="Post"
                    className="rounded-lg mb-4"
                />
            )}

            <div className="flex gap-4 text-xs text-zinc-500 mb-3">
                <span>{post.likeCount} likes</span>
                <span>{post.commentCount} comments</span>
            </div>

            <div className="flex gap-6 text-sm text-zinc-500">
                <button
                    onClick={handleLike}
                    className={`hover:text-red-500 ${post.likedByMe ? "text-red-500" : ""}`}
                >
                    {post.likedByMe ? "Liked" : "Like"}
                </button>
                <button
                    onClick={toggleComments}
                    className="hover:text-blue-500"
                >
                    Comment
                </button>
            </div>

            {showComments && (
                <div className="mt-4 space-y-4">
                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            rows={2}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                        />
                        <div className="flex justify-end">
                            <button className="bg-blue-600 px-4 py-1.5 rounded-lg text-xs">
                                Comment
                            </button>
                        </div>
                    </form>

                    {loadingComments ? (
                        <p className="text-sm text-zinc-500">Loading comments…</p>
                    ) : comments.length ? (
                        comments.map(c => (
                            <div key={c._id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs">
                                    {(c.userId?.name || "U").charAt(0)}
                                </div>
                                <p className="text-sm">
                                    <span className="font-semibold">
                                        {c.userId?.name}
                                    </span>{" "}
                                    {c.content}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-zinc-500">No comments yet</p>
                    )}
                </div>
            )}
        </article>
    );
}

export default React.memo(Post);


*/


import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, MoreVertical } from "lucide-react";
import { timeAgo } from "../utils/timeAgo";
import { useAuth } from "../context/useAuth";

function Post({ post, onLike, onDelete, onCommentAdded }) {
    const { user } = useAuth();

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = useCallback(() => {
        setShowMenu(prev => !prev);
    }, []);

    const toggleComments = useCallback(async () => {
        if (!showComments) {
            setLoadingComments(true);
            try {
                const res = await fetch(
                    `http://localhost:3000/api/comments/${post._id}`,
                    { credentials: "include" }
                );
                const data = await res.json();
                setComments(data.comments || []);
            } catch (err) {
                console.error("Failed to load comments", err);
            } finally {
                setLoadingComments(false);
            }
        }
        setShowComments(prev => !prev);
    }, [showComments, post._id]);

    const handleLike = async () => {
        try {
            const res = await fetch(
                `http://localhost:3000/api/posts/${post._id}/like`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const data = await res.json();

            onLike?.(post._id, data.liked);
        } catch (err) {
            console.error("Like failed", err);
        }
    };

    const handleCommentSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (!commentText.trim()) return;

            try {
                const res = await fetch("http://localhost:3000/api/comments", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        postId: post._id,
                        content: commentText,
                    }),
                });

                const data = await res.json();

                // optimistic UI
                setComments(prev => [data.comment, ...prev]);
                setCommentText("");

                // notify parent to update count
                onCommentAdded?.(post._id);
            } catch (err) {
                console.error("Comment failed", err);
            }
        },
        [commentText, post._id, onCommentAdded]
    );

    const isOwnPost =
        user?.username && post?.userId?.username
            ? user.username === post.userId.username
            : false;

    return (
        <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition">
            {/* HEADER */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Link to={`/u/${post.userId.username}`} className="shrink-0">
                        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white">
                            {(post.userId?.name || post.userId?.username || "U")
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    </Link>

                    <div>
                        <Link to={`/u/${post.userId.username}`}>
                            <h4 className="font-semibold text-sm text-white hover:text-blue-400 transition">
                                {post.userId?.name || "Unknown"}
                            </h4>
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                            @{post.userId?.username}
                            <span>•</span>
                            <span>{timeAgo(post.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* MENU */}
                <div className="relative">
                    <button
                        onClick={toggleMenu}
                        className="text-zinc-500 hover:text-zinc-300 transition p-1"
                    >
                        <MoreVertical size={20} />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg py-1 z-10">
                            {isOwnPost ? (
                                <button
                                    onClick={() => onDelete?.(post._id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-700 transition"
                                >
                                    Delete Post
                                </button>
                            ) : (
                                <button className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition">
                                    Report Post
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* CONTENT */}
            <p className="text-zinc-200 text-sm mb-4 whitespace-pre-wrap leading-relaxed">
                {post.content}
            </p>

            {/* IMAGE */}
            {post.imageUrl && (
                <img
                    src={post.imageUrl}
                    alt="Post"
                    className="rounded-lg mb-4 w-full object-cover"
                />
            )}

            {/* ACTIONS WITH COUNTS */}
            <div className="flex items-center gap-6 pt-3 border-t border-zinc-800">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 text-sm transition ${post.likedByMe
                            ? "text-red-500"
                            : "text-zinc-400 hover:text-red-500"
                        }`}
                >
                    <Heart
                        size={20}
                        fill={post.likedByMe ? "currentColor" : "none"}
                        className="transition"
                    />
                    <span className="font-medium">{post.likeCount}</span>
                </button>

                <button
                    onClick={toggleComments}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-blue-500 transition"
                >
                    <MessageCircle size={20} />
                    <span className="font-medium">{post.commentCount}</span>
                </button>
            </div>

            {/* COMMENTS */}
            {showComments && (
                <div className="mt-4 pt-4 border-t border-zinc-800 space-y-4">
                    <form onSubmit={handleCommentSubmit} className="space-y-2">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            rows={2}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-600 transition resize-none"
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg text-xs font-medium text-white transition"
                            >
                                Comment
                            </button>
                        </div>
                    </form>

                    {loadingComments ? (
                        <p className="text-sm text-zinc-500">Loading comments…</p>
                    ) : comments.length ? (
                        <div className="space-y-3">
                            {comments.map(c => (
                                <div key={c._id} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                                        {(c.userId?.name || "U").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 bg-zinc-800 rounded-lg px-3 py-2">
                                        <p className="text-sm text-zinc-200">
                                            <span className="font-semibold text-white">
                                                {c.userId?.name}
                                            </span>
                                            <span className="text-zinc-400 text-xs ml-2">
                                                @{c.userId?.username}
                                            </span>
                                        </p>
                                        <p className="text-sm text-zinc-300 mt-1">
                                            {c.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-500 text-center py-4">No comments yet</p>
                    )}
                </div>
            )}
        </article>
    );
}

export default React.memo(Post);