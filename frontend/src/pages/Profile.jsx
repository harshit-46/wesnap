import React, { useState, useEffect, useCallback } from 'react';
import Post from '../components/Post';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
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
    }, [profileUser, loggedInUser]);

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

    const handleDelete = useCallback(() => { }, []);

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
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                Loading profile...
            </div>
        );
    }

    if (!loading && !profileUser) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                User not found
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 py-8">

                <section className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-6">
                    <div className="h-48 bg-linear-to-br from-zinc-800 via-zinc-700 to-zinc-800 relative" />

                    <div className="px-6 pb-6 relative">
                        <div className="flex justify-between items-start -mt-16 mb-4">
                            <div className="w-32 h-32 rounded-full border-4 border-zinc-900 bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-4xl font-bold shadow-xl">
                                {(profileUser?.name ||
                                    profileUser?.username ||
                                    'U'
                                ).charAt(0)}
                            </div>

                            {isOwnProfile ? (
                                <button className="mt-4 bg-zinc-800 hover:bg-zinc-700 px-6 py-2 rounded-lg text-sm">
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    onClick={() => isFollowing ? handleUnfollow(profileUser._id) : handleFollow(profileUser._id)}
                                    className={`mt-4 px-6 py-2 rounded-lg text-sm font-medium ${isFollowing
                                        ? 'bg-zinc-800 hover:bg-zinc-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold">
                            {profileUser?.name || 'Unknown User'}
                        </h2>
                        <p className="text-zinc-400 text-sm mb-4">
                            @{profileUser?.username || 'unknown'}
                        </p>


                        {isOwnProfile ? (<p></p>) : (<button className='text-white bg-zinc-600 p-2 border border-black rounded-md cursor-pointer'
                            onClick={handleMessage}
                        >
                            Message
                        </button>)}

                        <div className="flex gap-6 border-t border-zinc-800 pt-4">
                            <div>
                                <p className="text-xl font-bold">{posts.length}</p>
                                <p className="text-zinc-400 text-xs">Posts</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold">{followersCount}</p>
                                <p className="text-zinc-400 text-xs">Followers</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold">{followingCount}</p>
                                <p className="text-zinc-400 text-xs">Following</p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-zinc-400 text-xs">Joined</p>
                                <p className="text-sm font-medium">
                                    {profileUser?.createdAt
                                        ? new Date(profileUser.createdAt).toLocaleDateString(
                                            'en-US',
                                            { month: 'short', day: 'numeric', year: 'numeric' }
                                        )
                                        : '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="border-b border-zinc-800 mb-6 flex gap-8">
                    {['posts', 'media', 'likes'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-medium ${activeTab === tab ? 'text-white' : 'text-zinc-400'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {activeTab === 'posts' && (
                    <div className="space-y-4">
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <Post
                                    key={post._id}
                                    post={post}
                                    loggedInUser={loggedInUser}
                                    onLike={handleLike}
                                    onDelete={handleDelete}
                                    onCommentAdded={handleCommentAdded}
                                />
                            ))
                        ) : (
                            <p className="text-center text-zinc-500 py-12">
                                No posts yet
                            </p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}