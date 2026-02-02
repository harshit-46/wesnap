import React, { useState, useEffect, useCallback } from 'react';
import toast from "react-hot-toast";
import Post from '../components/Post';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { username } = useParams();

    const [profileUser, setProfileUser] = useState(null);
    const [followInfo, setFollowInfo] = useState({
        isFollowing: false,
        followersCount: 0,
        followingCount: 0
    });
    const [posts, setPosts] = useState([]);

    const [activeTab, setActiveTab] = useState('posts');

    const { user } = useAuth();
    const loggedInUser = user?.username ?? null;

    const loading = !profileUser;

    useEffect(() => {
        if (!username) return;

        let ignore = false;

        const fetchUserAndPosts = async () => {
            try {
                const userResponse = await fetch(
                    `http://localhost:3000/api/users/u/${username}`,
                    { credentials: 'include' }
                );
                const userData = await userResponse.json();
                if (ignore) return;

                setProfileUser(userData.user);

                const postResponse = await fetch(
                    `http://localhost:3000/api/posts/user/${userData.user._id}`,
                    { credentials: 'include' }
                );
                const postData = await postResponse.json();
                if (ignore) return;

                setPosts(postData.posts || []);
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        fetchUserAndPosts();

        return () => {
            ignore = true;
        };
    }, [username]);

    useEffect(() => {
        if (!profileUser) return;

        const fetchFollowInfo = async () => {
            try {
                const res = await fetch(
                    `http://localhost:3000/api/follow/status/${username}`,
                    { credentials: 'include' }
                );

                if (!res.ok) {
                    throw new Error(`Status ${res.status}`);
                }
                const data = await res.json();
                setFollowInfo(data);
            } catch (err) {
                console.error("Failed to fetch follow info:", err);
                setFollowInfo({
                    isFollowing: false,
                    followersCount: 0,
                    followingCount: 0
                });
            }
        };

        fetchFollowInfo();
    }, [profileUser, username]);

    const { isFollowing, followersCount, followingCount } = followInfo;

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

    const handleFollow = useCallback(async (userId) => {
        setFollowInfo(prev => ({
            ...prev,
            isFollowing: true,
            followersCount: prev.followersCount + 1,
        }));

        try {
            await fetch("http://localhost:3000/api/follow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ userId }),
            });
        } catch (err) {
            console.error("Follow failed:", err);
            setFollowInfo(prev => ({
                ...prev,
                isFollowing: false,
                followersCount: prev.followersCount - 1,
            }));
        }
    }, []);

    const handleUnfollow = useCallback(async (userId) => {
        setFollowInfo(prev => ({
            ...prev,
            isFollowing: false,
            followersCount: Math.max(0, prev.followersCount - 1),
        }));

        try {
            await fetch(`http://localhost:3000/api/follow/${userId}`, {
                method: "DELETE",
                credentials: "include",
            });
        } catch (err) {
            console.error("Unfollow failed:", err);

            setFollowInfo(prev => ({
                ...prev,
                isFollowing: true,
                followersCount: prev.followersCount + 1,
            }));
        }
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

    const handleMessage = async () => {
        if (!profileUser?._id) return;

        try {
            const res = await fetch(
                `http://localhost:3000/api/conversations`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        receiverId: profileUser._id,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to open chat");
            }

            const conversationId = data.conversation._id;

            navigate(`/chat/t/${conversationId}`);
        } catch (error) {
            console.error("Open chat error:", error);
        }
    };

    const isOwnProfile =
        loggedInUser && profileUser?.username
            ? loggedInUser === profileUser.username
            : false;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex items-center justify-center">
                Loading profile...
            </div>
        );
    }

    if (!loading && !profileUser) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex items-center justify-center">
                User not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex">
            <main className="flex-1 px-4 py-10">
                <div className="max-w-3xl mx-auto">
                    <section className="
                        bg-white dark:bg-neutral-900 
                        border border-neutral-200 dark:border-neutral-800 
                        rounded-xl overflow-hidden mb-8 shadow-sm
                    ">
                        <div className="h-48 bg-neutral-100 dark:bg-neutral-800" />

                        <div className="px-6 pb-6 relative">
                            <div className="flex justify-between items-start -mt-16 mb-5">
                                <div className="
                                    w-32 h-32 rounded-full border-4 border-white dark:border-neutral-900 
                                    bg-neutral-900 flex items-center justify-center 
                                    text-4xl font-bold text-white shadow-md
                                ">
                                    {profileUser ? (
                                        <img
                                            src={profileUser.avatar}
                                            alt={profileUser.name || "User avatar"}
                                            className="h-full w-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <span className="text-sm font-semibold text-neutral-800 dark:text-white">
                                            {(profileUser.user.name|| profileUser.user.username || "U")
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                {isOwnProfile ? (
                                    <button onClick={() => navigate('/accounts')}
                                        className="
                                        mt-5 bg-neutral-100 dark:bg-neutral-800 
                                        hover:bg-neutral-200 dark:hover:bg-neutral-700 
                                        px-6 py-2.5 rounded-xl text-sm font-medium 
                                        text-neutral-800 dark:text-neutral-200 transition shadow-sm
                                    ">
                                        Edit Profile
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            isFollowing
                                                ? handleUnfollow(profileUser._id)
                                                : handleFollow(profileUser._id)
                                        }
                                        className={`
                                            mt-5 px-7 py-2.5 rounded-xl text-sm font-medium transition shadow-sm
                                            ${isFollowing
                                                ? 'bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                                                : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                                            }
                                        `}
                                    >
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </button>
                                )}
                            </div>

                            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                                {profileUser.name}
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                                @{profileUser.username}
                            </p>

                            {!isOwnProfile && (
                                <button
                                    onClick={handleMessage}
                                    className="
                                        mb-5 bg-neutral-100 dark:bg-neutral-800 
                                        hover:bg-neutral-200 dark:hover:bg-neutral-700 
                                        px-5 py-2 rounded-xl text-sm font-medium 
                                        text-neutral-800 dark:text-neutral-200 transition shadow-sm
                                    "
                                >
                                    Message
                                </button>
                            )}

                            <div className="flex gap-8 border-t border-neutral-200 dark:border-neutral-800 pt-5 text-sm">
                                <div>
                                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{posts.length}</p>
                                    <p className="text-neutral-500 dark:text-neutral-400">Posts</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{followersCount}</p>
                                    <p className="text-neutral-500 dark:text-neutral-400">Followers</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{followingCount}</p>
                                    <p className="text-neutral-500 dark:text-neutral-400">Following</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="border-b border-neutral-200 dark:border-neutral-800 mb-6 flex gap-10">
                        {['posts', 'media', 'likes'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-medium transition ${activeTab === tab
                                        ? 'text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100'
                                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'posts' && (
                        <div className='space-y-5'>
                            {posts.length ? posts.map(post => (
                                <Post
                                    key={post._id}
                                    post={post}
                                    loggedInUser={loggedInUser}
                                    onLike={handleLike}
                                    onDelete={handleDelete}
                                    onCommentAdded={handleCommentAdded}
                                />
                            )) : (
                                <p className="text-center text-neutral-500 dark:text-neutral-400 py-16 text-sm">
                                    No posts yet
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}