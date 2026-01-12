import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { timeAgo } from '../utils/timeAgo';

function Post({ post, profileUser, onLike, onComment, onDelete }) {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = useCallback(() => {
        setShowMenu(prev => !prev);
    }, []);

    const toggleComments = useCallback(() => {
        setShowComments(prev => !prev);
    }, []);

    const handleCommentSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (!commentText.trim()) return;

            onComment?.(post._id, commentText);
            setCommentText('');
        },
        [commentText, onComment, post._id]
    );

    const isOwnPost =
        profileUser?._id && post?.userId?._id
            ? profileUser._id === post.userId._id
            : false;

    return (
        <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition">
            {/* HEADER */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.userId.username}`} className="shrink-0">
                        <div className="w-11 h-11 rounded-full bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-sm font-semibold">
                            {(post.userId?.name || post.userId?.username || 'U')
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    </Link>

                    <div>
                        <Link to={`/profile/${post.userId.username}`} className="hover:underline">
                            <h4 className="font-semibold text-sm text-white">
                                {post.userId?.name || 'Unknown'}
                            </h4>
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <Link to={`/profile/${post.userId.username}`} className="hover:underline">
                                @{post.userId?.username || 'unknown'}
                            </Link>
                            <span>•</span>
                            <span>{timeAgo(post.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* MENU */}
                <div className="relative">
                    <button
                        onClick={toggleMenu}
                        className="text-zinc-500 hover:text-zinc-300"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8a2 2 0 100-4 2 2 0 000 4zm0 2a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg py-1 z-10">
                            {isOwnPost ? (
                                <>
                                    <button className="menu-btn">Edit Post</button>
                                    <button
                                        onClick={() => onDelete?.(post._id)}
                                        className="menu-btn text-red-400"
                                    >
                                        Delete Post
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="menu-btn">Report Post</button>
                                    <button className="menu-btn">Hide Post</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* CONTENT */}
            <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                {post.content}
            </p>

            {/* IMAGE */}
            {post.imageUrl && (
                <div className="rounded-lg overflow-hidden border border-zinc-700 mb-4">
                    <img src={post.imageUrl} alt="Post" className="w-full h-auto" />
                </div>
            )}

            {/* STATS */}
            <div className="flex gap-4 text-xs text-zinc-500 mb-3">
                <span>{post.likes?.length || 0} likes</span>
                <span>{post.comments?.length || 0} comments</span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-6 text-sm text-zinc-500">
                <button
                    onClick={() => onLike?.(post._id)}
                    className="hover:text-red-500 transition"
                >
                    Like
                </button>
                <button
                    onClick={toggleComments}
                    className="hover:text-blue-500 transition"
                >
                    Comment
                </button>
            </div>

            {/* COMMENTS */}
            {showComments && (
                <div className="mt-4 space-y-4">
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        rows={2}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={toggleComments}
                            className="text-xs text-zinc-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCommentSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-xs px-4 py-1.5 rounded-lg"
                        >
                            Comment
                        </button>
                    </div>

                    {post.comments?.length ? (
                        post.comments.map((c) => (
                            <div key={c._id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs">
                                    {(c.user?.name || 'U').charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm">
                                        <span className="font-semibold">{c.user?.name}</span>{' '}
                                        {c.content}
                                    </p>
                                </div>
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
