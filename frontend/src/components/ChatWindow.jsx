/*

// actual

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, MoreVertical, Smile } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { Theme } from 'emoji-picker-react';
import { EmojiStyle } from 'emoji-picker-react';
import { useSocket } from "../context/SocketContext";

function ChatWindow() {
    const socket = useSocket();
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversation, setConversation] = useState(null);

    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    const emojiPickerRef = useRef(null);
    const messagesEndRef = useRef(null);

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

    useEffect(() => {
        if (!socket || !socket.connected || !conversationId) return;

        socket.emit("joinConversation", conversationId);

        return () => {
            socket.emit("leaveConversation", conversationId);
        };
    }, [socket, conversationId]);

    useEffect(() => {
        if (!socket) return;

        const handleReceive = (message) => {
            if (message.conversationId !== conversationId) return;
            setMessages((prev) => [...prev, message]);
        };

        socket.on("receiveMessage", handleReceive);

        return () => socket.off("receiveMessage", handleReceive);
    }, [socket, conversationId]);

    const handleSendMessage = () => {
        if (!messageText.trim() || !socket?.connected) return;

        socket.emit("sendMessage", {
            conversationId,
            content: messageText,
        });

        socket.emit("stopTyping", { conversationId });

        setMessageText("");
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatTime = (timestamp) =>
        new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

    const otherUser = conversation?.participants?.find(
        (p) => p._id !== user?._id
    );

    if (!conversationId) return null;

    useEffect(() => {
        if (!socket) return;

        socket.on("userTyping", () => {
            setIsTyping(true);
        });

        socket.on("userStopTyping", () => {
            setIsTyping(false);
        });

        return () => {
            socket.off("userTyping");
            socket.off("userStopTyping");
        };
    }, [socket]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);


    const handleEmojiClick = (emojiData) => {
        setMessageText((prev) => prev + emojiData.emoji);
    };


    const isEmojiOnly = (text) => {
        if (!text) return false;

        const trimmed = text.trim();

        return /^[\p{Emoji}\u200d\s]+$/u.test(trimmed);
    };

    const handleTyping = (e) => {
        setMessageText(e.target.value);

        if (!socket?.connected || showEmojiPicker) return;

        socket.emit("typing", { conversationId });

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", { conversationId });
        }, 800);
    };

    return (
        <div className="flex-1 flex flex-col bg-zinc-900">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
                    if (otherUser?.username) {
                        navigate(`/u/${otherUser.username}`);
                    }
                }}
                >
                    <button
                        onClick={() => navigate("/chat")}
                        className="md:hidden p-2 hover:bg-zinc-800 rounded-full"
                    >
                        <ArrowLeft size={20} className="text-zinc-400" />
                    </button>

                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {(otherUser?.name || "U").charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h3 className="font-semibold text-white text-sm">
                            {otherUser?.name || "User"}
                        </h3>
                        <p className="text-xs text-zinc-400">{otherUser?.username || "loading"}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <MoreVertical size={20} className="text-zinc-400" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <p className="text-zinc-500 text-center">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="text-zinc-500 text-center">
                        No messages yet. Start the conversation!
                    </p>
                ) : (
                    messages.map((msg) => {
                        const isOwn =
                            msg.senderId === user?._id ||
                            msg.senderId?._id === user?._id;

                        const emojiOnly = isEmojiOnly(msg.content);

                        return (
                            <div
                                key={msg._id}
                                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                            >

                                <div
                                    className={`max-w-xs lg:max-w-md rounded-2xl ${emojiOnly
                                        ? "bg-transparent px-2 py-1"
                                        : isOwn
                                            ? "bg-blue-600 text-white px-4 py-2"
                                            : "bg-zinc-800 text-zinc-200 px-4 py-2"
                                        }`}
                                >
                                    <p
                                        className={`${emojiOnly
                                            ? "text-4xl leading-none"
                                            : "text-sm wrap-break-word"
                                            }`}
                                    >
                                        {msg.content}
                                    </p>

                                    {!emojiOnly && (
                                        <span className="text-xs block mt-1 opacity-70">
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

            {isTyping && (
                <p className="text-xs text-zinc-400 px-4 mb-1">
                    {otherUser?.username || "user"} is typing…
                </p>
            )}

            <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-zinc-800 flex gap-2"
            >
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker((p) => !p)}
                        className="text-xl"
                    >
                        <Smile className="text-white" />
                    </button>

                    {showEmojiPicker && (
                        <div ref={emojiPickerRef} className="absolute bottom-12 left-0 z-50 mb-4 -ml-16">
                            <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.DARK} emojiStyle={EmojiStyle.FACEBOOK} searchDisabled={true}
                                previewConfig={{
                                    showPreview: false,
                                }} height={300} width={350} lazyLoadEmojis={true}
                            />
                        </div>
                    )}
                </div>

                <textarea
                    value={messageText}
                    onChange={handleTyping}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                    placeholder="Type a message..."
                    rows={1}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-200 resize-none"
                />

                <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 px-4 py-2 rounded-lg"
                >
                    <Send size={18} className="text-white" />
                </button>
            </form>
        </div>
    );
}

export default ChatWindow;


*/


/*


//updated grok
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, MoreVertical, Smile } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { Theme } from 'emoji-picker-react';
import { EmojiStyle } from 'emoji-picker-react';
import { useSocket } from "../context/SocketContext";

function ChatWindow() {
    const socket = useSocket();
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversation, setConversation] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const messagesEndRef = useRef(null);

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

    useEffect(() => {
        if (!socket || !socket.connected || !conversationId) return;
        socket.emit("joinConversation", conversationId);
        return () => {
            socket.emit("leaveConversation", conversationId);
        };
    }, [socket, conversationId]);

    useEffect(() => {
        if (!socket) return;
        const handleReceive = (message) => {
            if (message.conversationId !== conversationId) return;
            setMessages((prev) => [...prev, message]);
        };
        socket.on("receiveMessage", handleReceive);
        return () => socket.off("receiveMessage", handleReceive);
    }, [socket, conversationId]);

    const handleSendMessage = () => {
        if (!messageText.trim() || !socket?.connected) return;
        socket.emit("sendMessage", {
            conversationId,
            content: messageText,
        });
        socket.emit("stopTyping", { conversationId });
        setMessageText("");
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatTime = (timestamp) =>
        new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

    const otherUser = conversation?.participants?.find(
        (p) => p._id !== user?._id
    );

    if (!conversationId) return null;

    useEffect(() => {
        if (!socket) return;
        socket.on("userTyping", () => {
            setIsTyping(true);
        });
        socket.on("userStopTyping", () => {
            setIsTyping(false);
        });
        return () => {
            socket.off("userTyping");
            socket.off("userStopTyping");
        };
    }, [socket]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };
        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);

    const handleEmojiClick = (emojiData) => {
        setMessageText((prev) => prev + emojiData.emoji);
    };

    const isEmojiOnly = (text) => {
        if (!text) return false;
        const trimmed = text.trim();
        return /^[\p{Emoji}\u200d\s]+$/u.test(trimmed);
    };

    const handleTyping = (e) => {
        setMessageText(e.target.value);
        if (!socket?.connected || showEmojiPicker) return;
        socket.emit("typing", { conversationId });
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", { conversationId });
        }, 800);
    };

    return (
        <div className="flex-1 flex flex-col bg-zinc-950 border border-green-600">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => {
                        if (otherUser?.username) {
                            navigate(`/u/${otherUser.username}`);
                        }
                    }}
                >
                    <button
                        onClick={() => navigate("/chat")}
                        className="md:hidden p-2 hover:bg-zinc-800/70 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-zinc-400 group-hover:text-zinc-200" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
                        {(otherUser?.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-base tracking-tight">
                            {otherUser?.name || "User"}
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium">
                            {otherUser?.username ? `@${otherUser.username}` : "loading..."}
                        </p>
                    </div>
                </div>
                <button className="p-2 hover:bg-zinc-800/70 rounded-full transition-colors">
                    <MoreVertical size={20} className="text-zinc-400 hover:text-zinc-200" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 bg-linear-to-b from-zinc-950 to-zinc-900">
                {loading ? (
                    <p className="text-zinc-500 text-center py-10">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                        <p className="text-lg font-medium">No messages yet</p>
                        <p className="text-sm mt-1.5">Say something nice ✨</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isOwn =
                            msg.senderId === user?._id ||
                            msg.senderId?._id === user?._id;
                        const emojiOnly = isEmojiOnly(msg.content);

                        return (
                            <div
                                key={msg._id}
                                className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-fade-in`}
                            >
                                <div
                                    className={`max-w-[75%] lg:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm
                                        ${emojiOnly
                                            ? "bg-transparent px-2 py-1 shadow-none"
                                            : isOwn
                                                ? "bg-blue-600/90 text-white rounded-br-none"
                                                : "bg-zinc-800/90 text-zinc-100 rounded-bl-none"
                                        }`}
                                >
                                    <p
                                        className={`${emojiOnly
                                            ? "text-5xl leading-tight"
                                            : "text-[15px] leading-relaxed wrap-break-word"
                                            }`}
                                    >
                                        {msg.content}
                                    </p>

                                    {!emojiOnly && (
                                        <span className="text-[11px] opacity-70 mt-1 block text-right">
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

            {isTyping && (
                <p className="text-xs text-zinc-500 px-5 py-1.5 italic">
                    {otherUser?.username || "user"} is typing…
                </p>
            )}

            <div className="p-4 border-t border-zinc-800/70 bg-zinc-950/80 backdrop-blur-sm">
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-end gap-2"
                >
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker((p) => !p)}
                            className="p-3 hover:bg-zinc-800/60 rounded-full transition-colors"
                        >
                            <Smile size={22} className="text-zinc-400 hover:text-amber-400" />
                        </button>

                        {showEmojiPicker && (
                            <div 
                                ref={emojiPickerRef} 
                                className="absolute bottom-16 left-0 z-50 mb-2 -ml-4 sm:-ml-8"
                            >
                                <EmojiPicker 
                                    onEmojiClick={handleEmojiClick} 
                                    theme={Theme.DARK} 
                                    emojiStyle={EmojiStyle.APPLE}
                                    searchDisabled={true}
                                    previewConfig={{ showPreview: false }}
                                    height={320} 
                                    width={360} 
                                    lazyLoadEmojis={true}
                                />
                            </div>
                        )}
                    </div>

                    <textarea
                        value={messageText}
                        onChange={handleTyping}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="flex-1 bg-zinc-800/70 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:border-blue-600/50 focus:bg-zinc-800/90 transition-all max-h-32 overflow-y-auto"
                    />

                    <button
                        type="submit"
                        disabled={!messageText.trim()}
                        className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800/50 disabled:text-zinc-600 rounded-xl transition-colors flex items-center justify-center min-w-13"
                    >
                        <Send size={20} className="text-white" />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatWindow;


*/


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
        <div className="flex-1 flex flex-col bg-zinc-950 border border-green-600">
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