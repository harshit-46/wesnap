import { useParams } from "react-router-dom";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import Navbar from "../components/Navbar";

function ChatPage() {
    const { conversationId } = useParams();

    return (
        <div className="min-h-screen bg-zinc-950/95">
            <Navbar currentPage="chat" />

            <div className="flex h-[calc(100vh-64px)]">
                <div className="w-full md:w-96 border-r border-zinc-800 flex flex-col">
                    <ChatList />
                </div>

                <div className="hidden md:flex flex-1">
                    {conversationId ? (
                        <ChatWindow conversationId={conversationId} />
                    ) : (
                        <div className="flex flex-1 items-center justify-center text-zinc-500">
                            Select a chat to start messaging
                        </div>
                    )}
                </div>
            </div>

            {conversationId && (
                <div className="md:hidden fixed inset-0 z-50 bg-zinc-950">
                    <ChatWindow conversationId={conversationId} />
                </div>
            )}
        </div>
    );
}

export default ChatPage;




/*

//updated
import { useParams } from "react-router-dom";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import Navbar from "../components/Navbar";

function ChatPage() {
    const { conversationId } = useParams();

    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
            <Navbar currentPage="chat" />

            <div className="flex min-h-screen">
                <div className="
                    w-full md:w-80 lg:w-96 
                    border-r border-neutral-200 dark:border-neutral-800 
                    flex flex-col 
                    bg-white dark:bg-neutral-900 
                    shadow-sm
                ">
                    <ChatList />
                </div>

                <div className="hidden md:flex flex-1 bg-neutral-50/50 dark:bg-neutral-950/50">
                    {conversationId ? (
                        <ChatWindow conversationId={conversationId} />
                    ) : (
                        <div className="
                            flex flex-1 items-center justify-center 
                            text-neutral-500 dark:text-neutral-400 
                            text-center px-6
                        ">
                            <div>
                                <svg 
                                    className="w-16 h-16 mx-auto mb-5 text-neutral-300 dark:text-neutral-600" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                    No conversation selected
                                </h3>
                                <p className="text-sm max-w-md">
                                    Choose a chat from the list to start messaging
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {conversationId && (
                <div className="
                    md:hidden fixed inset-0 z-50 
                    bg-white dark:bg-neutral-950 
                    flex flex-col
                ">
                    <ChatWindow conversationId={conversationId} />
                </div>
            )}
        </div>
    );
}

export default ChatPage;

*/