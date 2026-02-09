import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./useAuth";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!user) return;

        const s = io(import.meta.env.VITE_API_URL, {
            withCredentials: true,
            transports : ["websocket"],
            autoConnect: false
        });

        s.connect();

        s.on("connect", () => {
            console.log("✅ Socket connected");
        });

        s.on("connect_error", (err) => {
            console.error("❌ Socket error:", err.message);
        });

        setSocket(s);

        return () => {
            s.disconnect();
            setSocket(null);
            console.log("🔌 Socket disconnected");
        };
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);