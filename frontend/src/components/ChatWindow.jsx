import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, MoreVertical, Smile } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import EmojiPicker, { Theme, EmojiStyle } from "emoji-picker-react";
import { useSocket } from "../context/SocketContext";

function ChatWindow() {
    const socket = useSocket();
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const typingTimeoutRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Fetch conversation
    useEffect(() => {
        if (!conversationId) return;

        const fetchConversation = async () => {
            try {
                const res = await fetch(`https://wesnap-server.onrender.com/api/conversations/${conversationId}`, {
                    credentials: "include",
                });
                const data = await res.json();
                setConversation(data.conversation);
            } catch (err) {
                console.error("Failed to fetch conversation", err);
            }
        };

        fetchConversation();
    }, [conversationId]);

    // Fetch messages
    useEffect(() => {
        if (!conversationId) return;

        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://wesnap-server.onrender.com/api/messages/${conversationId}`, {
                    credentials: "include",
                });
                const data = await res.json();
                setMessages(data.messages || []);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [conversationId]);

    // Socket join/leave
    useEffect(() => {
        if (!socket?.connected || !conversationId) return;

        socket.emit("joinConversation", conversationId);
        return () => socket.emit("leaveConversation", conversationId);
    }, [socket, conversationId]);

    // Receive message
    useEffect(() => {
        if (!socket) return;

        const handleReceive = (message) => {
            if (message.conversationId !== conversationId) return;

            setMessages((prev) => {
                if (prev.some((m) => m._id === message._id)) return prev;
                return [...prev, message];
            });
        };

        socket.on("receiveMessage", handleReceive);
        return () => socket.off("receiveMessage", handleReceive);
    }, [socket, conversationId]);

    // Typing indicator
    useEffect(() => {
        if (!socket) return;

        socket.on("userTyping", () => setIsTyping(true));
        socket.on("userStopTyping", () => setIsTyping(false));

        return () => {
            socket.off("userTyping");
            socket.off("userStopTyping");
        };
    }, [socket]);

    // Cleanup typing timeout
    useEffect(() => {
        return () => clearTimeout(typingTimeoutRef.current);
    }, []);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Close emoji picker on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showEmojiPicker]);

    const handleSendMessage = (e) => {
        e?.preventDefault();
        if (!messageText.trim() || !socket?.connected) return;

        socket.emit("sendMessage", {
            conversationId,
            content: messageText,
        });

        console.log("message sent:", messageText);

        socket.emit("stopTyping", { conversationId });
        setMessageText("");
    };

    const handleTyping = (e) => {
        const value = e.target.value;
        setMessageText(value);

        if (!socket?.connected || !value.trim()) return;

        socket.emit("typing", { conversationId });

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", { conversationId });
        }, 800);
    };

    const handleEmojiClick = (emojiData) => {
        setMessageText((prev) => prev + emojiData.emoji);
    };

    const isEmojiOnly = (text) => /^[\p{Emoji}\u200d\s]+$/u.test(text?.trim());

    const formatTime = (time) =>
        new Date(time).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

    const otherUser = conversation?.participants?.find((p) => p._id !== user?._id);

    if (!conversationId) return null;

    return (
        <div className="flex flex-col h-full bg-[#F9FAFB] dark:bg-zinc-950 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => otherUser?.username && navigate(`/u/${otherUser.username}`)}
                >
                    <button
                        onClick={() => navigate("/chat")}
                        className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-full"
                    >
                        <ArrowLeft size={20} className="text-neutral-700 dark:text-zinc-300" />
                    </button>

                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                        {otherUser?.avatar ?
                            (
                                <img src={otherUser.avatar}
                                    alt={otherUser.name}
                                    className="w-full h-full object-cover rounded-full" />
                            ) :
                            (
                                <span>{(otherUser?.name || "U")[0]}</span>
                            )
                        }
                    </div>

                    <div>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                            {otherUser?.name || "User"}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-zinc-400">
                            @{otherUser?.username || "loading"}
                        </p>
                    </div>
                </div>

                <MoreVertical className="text-neutral-500 dark:text-zinc-400" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-[#F9FAFB] dark:bg-zinc-950">
                {loading ? (
                    <p className="text-center text-neutral-500 dark:text-zinc-500">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <div className="text-center text-neutral-500 dark:text-zinc-500 mt-20">
                        <p className="text-lg font-medium text-neutral-700 dark:text-zinc-300">No messages yet</p>
                        <p className="text-sm">Say something ✨</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const senderId = msg.senderId?._id || msg.senderId;
                        const isOwn = senderId === user?._id;
                        const emojiOnly = isEmojiOnly(msg.content);

                        return (
                            <div key={msg._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm
                    ${emojiOnly
                                            ? "bg-transparent text-5xl shadow-none"
                                            : isOwn
                                                ? "bg-blue-600 text-white rounded-br-none"
                                                : "bg-white dark:bg-zinc-800 text-neutral-900 dark:text-white rounded-bl-none"
                                        }`}
                                >
                                    <p>{msg.content}</p>
                                    {!emojiOnly && (
                                        <span
                                            className={`text-[10px] opacity-70 block text-right mt-1
                        ${isOwn ? "text-blue-100" : "text-neutral-500 dark:text-zinc-400"}`}
                                        >
                                            {formatTime(msg.createdAt)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Typing indicator */}
            {isTyping && (
                <p className="text-xs text-neutral-500 dark:text-zinc-500 px-5 py-1 italic">
                    {otherUser?.username} is typing…
                </p>
            )}

            {/* Input area */}
            <div className="p-4 border-t border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker((p) => !p)}
                            className="p-2.5 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        >
                            <Smile className="text-neutral-600 dark:text-zinc-400" />
                        </button>

                        {showEmojiPicker && (
                            <div ref={emojiPickerRef} className="absolute bottom-14 left-0 z-50">
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    theme={Theme.AUTO} // will follow system / tailwind dark class
                                    emojiStyle={EmojiStyle.APPLE}
                                    previewConfig={{ showPreview: false }}
                                />
                            </div>
                        )}
                    </div>

                    <textarea
                        value={messageText}
                        onChange={handleTyping}
                        onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        rows={1}
                        placeholder="Type a message..."
                        className="flex-1 resize-none bg-neutral-100 dark:bg-zinc-800 
                       text-neutral-900 dark:text-zinc-100 
                       placeholder-neutral-500 dark:placeholder-zinc-500
                       rounded-xl px-4 py-3 max-h-32 border border-neutral-200 dark:border-zinc-700
                       focus:outline-none focus:border-blue-400 dark:focus:border-blue-500/60
                       transition-colors"
                    />

                    <button
                        type="submit"
                        disabled={!messageText.trim()}
                        className="p-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 
                       text-white rounded-xl disabled:opacity-50 disabled:hover:bg-blue-600 
                       transition-colors flex items-center justify-center"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatWindow;