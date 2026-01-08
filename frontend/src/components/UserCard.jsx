export default function UserCard({ user, currentUser, onFollow }) {
    //const isFollowing = user.followers.includes(currentUser.id);
    const followersCount = user.followers?.length || 0;


    return (
        <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition duration-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <a href={`/profile/${user.username}`} className="shrink-0">
                        <div className={`w-14 h-14 rounded-full bg-linear-to-br ${user.avatarColor} flex items-center justify-center text-lg font-semibold hover:scale-105 transition`}>
                            {user.name.charAt(0)}
                        </div>
                    </a>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <a href={`/profile/${user.username}`} className="block hover:underline">
                            <h3 className="font-semibold text-white">{user.name}</h3>
                        </a>
                        <p className="text-zinc-400 text-sm">@{user.username}</p>
                        <p className="text-zinc-500 text-xs mt-1 line-clamp-2">
                            {user.bio}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-zinc-400">
                                <span className="font-semibold text-white">{user.posts}</span> Posts
                            </span>
                            <span className="text-xs text-zinc-400">
                                <span className="font-semibold text-white">{followersCount}</span> Followers
                            </span>
                            <span className="text-xs text-zinc-400">
                                <span className="font-semibold text-white">{user.following}</span> Following
                            </span>
                        </div>
                    </div>
                </div>

                {/* Follow Button */}
                {user.id !== currentUser.id && (
                    <button
                        onClick={() => onFollow(user.id)}
                        className={`font-medium px-6 py-2 rounded-lg transition text-sm shrink-0 ${isFollowing
                                ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                )}
            </div>
        </article>
    );
}