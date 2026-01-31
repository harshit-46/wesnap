import { useParams } from "react-router-dom";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";

function ChatPage() {
    const { conversationId } = useParams();

    return (
        <div className="flex h-dvh overflow-hidden">
            {/* Main chat area – takes full remaining width */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                {/* Left column: ChatList – visible on desktop, full on mobile when no chat open */}
                <div className="
                    w-full md:w-96 pt-6
                    border-r border-zinc-800 
                    flex flex-col 
                    md:bg-zinc-950/95
                    h-full overflow-hidden
                ">
                    <ChatList />
                </div>

                {/* Right column: Chat content or placeholder */}
                <div className="hidden md:flex flex-1 flex-col">
                    {conversationId ? (
                        <ChatWindow conversationId={conversationId} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-zinc-500">
                            Select a chat to start messaging
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile: full-screen chat when conversation is selected */}
            {conversationId && (
                <div className="md:hidden fixed inset-0 z-50 bg-zinc-950 flex flex-col">
                    {/* Optional: simple back header */}
                    <div className="h-14 border-b border-zinc-800 flex items-center px-4">
                        <button
                            onClick={() => window.history.back()}
                            className="text-blue-400 mr-3 text-xl font-semibold"
                        >
                            ← Back
                        </button>
                        <span className="font-medium">Chat</span>
                    </div>
                    <div className="flex-1">
                        <ChatWindow conversationId={conversationId} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatPage;