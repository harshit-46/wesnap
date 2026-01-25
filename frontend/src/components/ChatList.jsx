import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function ChatList() {
    const navigate = useNavigate();
    const { conversationId } = useParams();

    const [chats, setChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/chats", {
                credentials: "include",
            });
            const data = await res.json();
            setChats(data.chats || []);
        } catch (err) {
            console.error("Failed to fetch chats", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChat = (chatId) => {
        navigate(`/chat/t/${chatId}`);
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950/95">
            <div className="p-4 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Messages</h2>
                    <button className="p-2 hover:bg-zinc-800 rounded-full transition">
                        <Plus size={20} className="text-zinc-400" />
                    </button>
                </div>

                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                    />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <p className="text-zinc-500 text-sm">Loading chats...</p>
                    </div>
                ) : (
                    chats.map((chat) => {
                        const isActive = conversationId === chat._id;

                        return (
                            <button
                                key={chat._id}
                                onClick={() => handleChat(chat._id)}
                                className={`w-full flex items-center gap-3 p-4 border-b border-zinc-800 transition
                                ${isActive ? "bg-zinc-800" : "hover:bg-zinc-700"}`}
                            >
                                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                    {(chat.user?.name || chat.user?.username || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="flex-1 text-left">
                                    <p className="text-sm font-semibold text-white">
                                        {chat.user?.name || "Unknown"}
                                    </p>
                                    <p className="text-xs text-zinc-400 truncate">
                                        {chat.lastMessage?.content || "No messages yet"}
                                    </p>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default ChatList;


/*

//updated

import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function ChatList() {
    const navigate = useNavigate();
    const { conversationId } = useParams();

    const [chats, setChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/chats", {
                credentials: "include",
            });
            const data = await res.json();
            setChats(data.chats || []);
        } catch (err) {
            console.error("Failed to fetch chats", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChat = (chatId) => {
        navigate(`/chat/t/${chatId}`);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border border-pink-600">

            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                        Messages
                    </h2>
                    <button className="
                        p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 
                        rounded-full transition text-neutral-600 dark:text-neutral-400
                        hover:text-neutral-900 dark:hover:text-neutral-200
                    ">
                        <Plus size={20} />
                    </button>
                </div>

                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
                    />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="
                            w-full bg-white dark:bg-neutral-900
                            border border-neutral-200 dark:border-neutral-700
                            rounded-xl pl-11 pr-4 py-3 text-sm
                            text-neutral-900 dark:text-neutral-100
                            placeholder-neutral-400 dark:placeholder-neutral-500
                            focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500
                            focus:ring-1 focus:ring-neutral-200 dark:focus:ring-neutral-700
                            shadow-sm transition
                        "
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto border border-amber-600">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-neutral-200 dark:border-neutral-700 border-t-neutral-600 dark:border-t-neutral-300 rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Loading chats...
                            </p>
                        </div>
                    </div>
                ) : chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                        <svg 
                            className="w-14 h-14 mb-5 text-neutral-300 dark:text-neutral-600" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                            No conversations yet
                        </p>
                    </div>
                ) : (
                    chats.map((chat) => {
                        const isActive = conversationId === chat._id;

                        return (
                            <button
                                key={chat._id}
                                onClick={() => handleChat(chat._id)}
                                className={`
                                    w-full flex items-center gap-4 p-4 border-b border-neutral-200 dark:border-neutral-800
                                    transition hover:bg-neutral-50 dark:hover:bg-neutral-800/60
                                    ${isActive 
                                        ? "bg-neutral-100 dark:bg-neutral-800/80 border-l-4 border-l-neutral-900 dark:border-l-neutral-100" 
                                        : ""
                                    }
                                `}
                            >
                                <div className="
                                    w-12 h-12 rounded-full 
                                    bg-neutral-900 flex items-center justify-center 
                                    text-white font-semibold text-lg shadow-sm
                                ">
                                    {(chat.user?.name || chat.user?.username || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                                        {chat.user?.name || "Unknown"}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                                        {chat.lastMessage?.content || "No messages yet"}
                                    </p>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default ChatList;

*/