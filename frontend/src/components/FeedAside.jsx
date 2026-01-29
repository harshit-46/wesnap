import { Users, Sparkles, Activity } from "lucide-react";

export default function FeedAside() {
    return (
        <aside className="w-[320px] sticky top-8 space-y-5">

            {/* Daily Vibe Orb */}
            <div className="bg-white/60 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-lg">
                <p className="text-sm text-gray-500 mb-2">Today's Global Vibe</p>

                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-pink-500 to-purple-600 blur-[2px] shadow-xl animate-pulse" />
                    <div>
                        <h3 className="font-semibold">Chill & Creative 😌</h3>
                        <p className="text-xs text-gray-400">Set your vibe</p>
                    </div>
                </div>
            </div>

            {/* Trending Pulse */}
            <div className="bg-white/60 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Activity size={18} /> Trending Pulse
                </h3>

                {[
                    { label: "AI Talks", percent: 82 },
                    { label: "Music", percent: 64 },
                    { label: "Gaming", percent: 48 },
                ].map((item) => (
                    <div key={item.label} className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                            <span>{item.label}</span>
                            <span>{item.percent}%</span>
                        </div>
                        <div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-zinc-600 rounded-full transition-all"
                                style={{ width: `${item.percent}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Vibe Matches */}
            <div className="bg-white/60 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users size={18} /> People Matching Your Vibe
                </h3>

                <div className="space-y-3">
                    {["Aarav", "Meera", "Rohit"].map((name) => (
                        <div key={name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-pink-500" />
                                <p className="text-sm font-medium">{name}</p>
                            </div>
                            <button className="text-xs px-3 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black hover:scale-105 transition">
                                Connect
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily Challenge */}
            <div className="bg-white/10  text-black dark:text-white rounded-2xl p-5 shadow-xl">
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <Sparkles size={18} /> Daily Challenge
                </h3>
                <p className="text-sm opacity-90">
                    Post something that feels peaceful 🌿
                </p>

                <button className="mt-3 text-xs px-3 py-1 bg-black/20 rounded-full hover:bg-black/20 transition">
                    Accept Challenge
                </button>
            </div>

        </aside>
    );
}
