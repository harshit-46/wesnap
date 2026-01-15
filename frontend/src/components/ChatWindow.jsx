import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, MoreVertical, Phone, Video } from "lucide-react";
import { useAuth } from "../context/useAuth";

function ChatWindow({ selectedChat, onBack }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages();
        }
    }, [selectedChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        if (!selectedChat) return;
        
        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:3000/api/messages/${selectedChat._id}`,
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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedChat) return;

        const tempMessage = {
            _id: Date.now().toString(),
            content: messageText,
            senderId: user._id,
            createdAt: new Date().toISOString(),
            temp: true,
        };

        setMessages((prev) => [...prev, tempMessage]);
        setMessageText("");

        try {
            const res = await fetch("http://localhost:3000/api/messages", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatId: selectedChat._id,
                    content: messageText,
                }),
            });

            const data = await res.json();

            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === tempMessage._id ? data.message : msg
                )
            );
        } catch (err) {
            console.error("Failed to send message", err);
            setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const formatMessageTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    if (!selectedChat) {
        return (
            <div className="flex-1 flex items-center justify-center bg-zinc-950/95">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                        <Send size={32} className="text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        Your Messages
                    </h3>
                    <p className="text-zinc-400 text-sm">
                        Select a chat to start messaging
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-zinc-900">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="md:hidden p-2 hover:bg-zinc-800 rounded-full transition"
                        >
                            <ArrowLeft size={20} className="text-zinc-400" />
                        </button>
                    )}

                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {(selectedChat.user?.name || selectedChat.user?.username || "U")
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <h3 className="font-semibold text-white text-sm">
                            {selectedChat.user?.name || "Unknown"}
                        </h3>
                        <p className="text-xs text-zinc-400">
                            {selectedChat.user?.isOnline ? "Active now" : "Offline"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-zinc-800 rounded-full transition">
                        <Phone size={20} className="text-zinc-400" />
                    </button>
                    <button className="p-2 hover:bg-zinc-800 rounded-full transition">
                        <Video size={20} className="text-zinc-400" />
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-zinc-800 rounded-full transition"
                        >
                            <MoreVertical size={20} className="text-zinc-400" />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg py-1 z-10">
                                <button className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition">
                                    View Profile
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition">
                                    Mute Notifications
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-700 transition">
                                    Delete Chat
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-zinc-500 text-sm">Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-zinc-500 text-sm">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isOwn = message.senderId === user?._id;
                        const showDate =
                            index === 0 ||
                            new Date(messages[index - 1].createdAt).toDateString() !==
                                new Date(message.createdAt).toDateString();

                        return (
                            <React.Fragment key={message._id}>
                                {showDate && (
                                    <div className="flex justify-center my-4">
                                        <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">
                                            {new Date(message.createdAt).toLocaleDateString(
                                                "en-US",
                                                {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>
                                )}

                                <div
                                    className={`flex ${
                                        isOwn ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                            isOwn
                                                ? "bg-blue-600 text-white"
                                                : "bg-zinc-800 text-zinc-200"
                                        } ${message.temp ? "opacity-60" : ""}`}
                                    >
                                        <p className="text-sm wrap-break-word">
                                            {message.content}
                                        </p>
                                        <span
                                            className={`text-xs mt-1 block ${
                                                isOwn
                                                    ? "text-blue-200"
                                                    : "text-zinc-500"
                                            }`}
                                        >
                                            {formatMessageTime(message.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-600 transition resize-none max-h-32"
                    />
                    <button
                        type="submit"
                        disabled={!messageText.trim()}
                        className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg transition"
                    >
                        <Send size={20} className="text-white" />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatWindow;