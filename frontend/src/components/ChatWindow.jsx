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

    /* -------------------- Fetch conversation -------------------- */
    useEffect(() => {
        if (!conversationId) return;

        const fetchConversation = async () => {
            try {
                const res = await fetch(
                    `http://localhost:3000/api/conversations/${conversationId}`,
                    { credentials: "include" }
                );
                const data = await res.json();
                setConversation(data.conversation);
            } catch (err) {
                console.error("Failed to fetch conversation", err);
            }
        };

        fetchConversation();
    }, [conversationId]);

    /* -------------------- Fetch messages -------------------- */
    useEffect(() => {
        if (!conversationId) return;

        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `http://localhost:3000/api/messages/${conversationId}`,
                    { credentials: "include" }
                );
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

    /* -------------------- Socket join / leave -------------------- */
    useEffect(() => {
        if (!socket?.connected || !conversationId) return;

        socket.emit("joinConversation", conversationId);
        return () => socket.emit("leaveConversation", conversationId);
    }, [socket, conversationId]);

    /* -------------------- Receive message -------------------- */
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

    /* -------------------- Typing indicator -------------------- */
    useEffect(() => {
        if (!socket) return;

        socket.on("userTyping", () => setIsTyping(true));
        socket.on("userStopTyping", () => setIsTyping(false));

        return () => {
            socket.off("userTyping");
            socket.off("userStopTyping");
        };
    }, [socket]);

    /* -------------------- Cleanup typing timeout -------------------- */
    useEffect(() => {
        return () => clearTimeout(typingTimeoutRef.current);
    }, []);

    /* -------------------- Auto scroll -------------------- */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /* -------------------- Outside click (emoji picker) -------------------- */
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

    /* -------------------- Helpers -------------------- */
    const handleSendMessage = (e) => {
        e?.preventDefault();
        if (!messageText.trim() || !socket?.connected) return;

        socket.emit("sendMessage", {
            conversationId,
            content: messageText,
        });

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

    const isEmojiOnly = (text) =>
        /^[\p{Emoji}\u200d\s]+$/u.test(text?.trim());

    const formatTime = (time) =>
        new Date(time).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

    const otherUser = conversation?.participants?.find(
        (p) => p._id !== user?._id
    );

    if (!conversationId) return null;

    /* -------------------- UI -------------------- */
    return (
        <div className="flex flex-col bg-zinc-950 h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => otherUser?.username && navigate(`/u/${otherUser.username}`)}
                >
                    <button
                        onClick={() => navigate("/chat")}
                        className="md:hidden p-2 hover:bg-zinc-800 rounded-full"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {(otherUser?.name || "U")[0]}
                    </div>

                    <div>
                        <p className="font-semibold text-white">
                            {otherUser?.name || "User"}
                        </p>
                        <p className="text-xs text-zinc-400">
                            @{otherUser?.username || "loading"}
                        </p>
                    </div>
                </div>

                <MoreVertical className="text-zinc-400" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {loading ? (
                    <p className="text-center text-zinc-500">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <div className="text-center text-zinc-500 mt-20">
                        <p className="text-lg">No messages yet</p>
                        <p className="text-sm">Say something ✨</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const senderId = msg.senderId?._id || msg.senderId;
                        const isOwn = senderId === user?._id;
                        const emojiOnly = isEmojiOnly(msg.content);

                        return (
                            <div
                                key={msg._id}
                                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[70%] px-4 py-2 rounded-2xl
                                    ${emojiOnly ? "bg-transparent text-5xl" :
                                        isOwn
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-zinc-800 text-white rounded-bl-none"
                                    }`}
                                >
                                    <p>{msg.content}</p>
                                    {!emojiOnly && (
                                        <span className="text-[10px] opacity-70 block text-right mt-1">
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

            {/* Typing */}
            {isTyping && (
                <p className="text-xs text-zinc-500 px-5 italic">
                    {otherUser?.username} is typing…
                </p>
            )}

            {/* Input */}
            <div className="p-4 border-t border-zinc-800">
                <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker((p) => !p)}
                            className="p-2 hover:bg-zinc-800 rounded-full"
                        >
                            <Smile />
                        </button>

                        {showEmojiPicker && (
                            <div ref={emojiPickerRef} className="absolute bottom-14 z-50">
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    theme={Theme.DARK}
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
                        className="flex-1 resize-none bg-zinc-800 text-white rounded-xl px-4 py-3 max-h-32"
                    />

                    <button
                        type="submit"
                        disabled={!messageText.trim()}
                        className="p-3 bg-blue-600 rounded-xl disabled:opacity-40"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatWindow;