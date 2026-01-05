import React, { useState } from 'react';

export default function Post({ post, currentUser, onLike, onComment, onDelete }) {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [showMenu, setShowMenu] = useState(false);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(post._id, commentText);
            setCommentText('');
        }
    };

    //const isLiked = post.likes.includes(currentUser.id);

    return (
        <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition duration-200">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <a href={`/profile/${post.userId.username}`} className="shrink-0">
                        <div className="w-11 h-11 rounded-full bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-sm font-semibold hover:scale-105 transition">
                            {post.userId.name}
                        </div>
                    </a>
                    <div>
                        <a href={`/profile/${post.userId.username}`} className="hover:underline">
                            <h4 className="font-semibold text-sm text-white">{post.userId.name}</h4>
                        </a>
                        <div className="flex items-center gap-2">
                            <a href={`/profile/${post.userId.username}`} className="text-zinc-400 text-xs hover:underline">
                                @{post.userId.username}
                            </a>
                            <span className="text-zinc-600">•</span>
                            <small className="text-zinc-500 text-xs">{post.date}</small>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <button onClick={() => setShowMenu(!showMenu)} className="text-zinc-500 hover:text-zinc-300 transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg py-2 z-10">
                            {currentUser._id === post.userId ? (
                                <>
                                    <button className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition">
                                        Edit Post
                                    </button>
                                    <button onClick={() => onDelete(post.id)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-700 transition">
                                        Delete Post
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition">
                                        Report Post
                                    </button>
                                    <button className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition">
                                        Hide Post
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
                <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Post Image */}
            {post.imageUrl && (
                <div className="rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 mb-4">
                    <img src={post.imageUrl} className="w-full h-auto" alt="Post" />
                </div>
            )}

            {/* Post Stats */}
            <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3 pb-3 border-b border-zinc-800">
                <span className="hover:underline cursor-pointer">222 likes</span>
                <span className="hover:underline cursor-pointer">111 comments</span>
            </div>

            {/* Post Actions 
            <div className="flex items-center gap-6 pb-3 border-b border-zinc-800">
                <button onClick={() => onLike(post.id)} className={`flex items-center gap-2 transition text-sm group ${isLiked ? 'text-red-500' : 'text-zinc-500 hover:text-red-500'}`}>
                    <svg className={`w-5 h-5 ${isLiked ? 'fill-red-500' : 'group-hover:fill-red-500'}`} fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                </button>

                <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition text-sm group">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Comment</span>
                </button>

                <button className="flex items-center gap-2 text-zinc-500 hover:text-green-500 transition text-sm group ml-auto">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>Share</span>
                </button>
            </div>
            */}
            {/* Comments Section */}
            {showComments && (
                <div className="mt-4">
                    {/* Add Comment */}
                    <div onSubmit={handleCommentSubmit} className="mb-4">
                        <div className="flex gap-3">
                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-zinc-700 to-zinc-600 flex items-center justify-center text-xs font-semibold shrink-0">
                                {currentUser.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    rows="2"
                                    placeholder="Write a comment..."
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none transition"
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button onClick={() => setShowComments(false)} type="button" className="text-zinc-400 hover:text-white text-xs px-3 py-1.5 rounded transition">
                                        Cancel
                                    </button>
                                    <button onClick={handleCommentSubmit} type="button" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition">
                                        Comment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {post.comments.length > 0 ? (
                            post.comments.map(comment => (
                                <div key={comment.id} className="flex gap-3">
                                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-zinc-700 to-zinc-600 flex items-center justify-center text-xs font-semibold shrink-0">
                                        {comment.user.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-zinc-800 rounded-lg px-3 py-2">
                                            <a href={`/profile/${comment.user.username}`} className="font-semibold text-sm hover:underline">
                                                {comment.user.name}
                                            </a>
                                            <p className="text-zinc-200 text-sm mt-1">{comment.content}</p>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 ml-3">
                                            <small className="text-zinc-500 text-xs">{comment.date}</small>
                                            <button className="text-zinc-500 hover:text-zinc-300 text-xs transition">Like</button>
                                            <button className="text-zinc-500 hover:text-zinc-300 text-xs transition">Reply</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-zinc-500 text-sm py-4">No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                </div>
            )}
        </article>
    );
}