import { createContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("/api/auth/me");
                setUser(res.data?.user ?? null);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (!user?.theme) return;
    
        document.documentElement.classList.toggle(
            "dark",
            user.theme === "dark"
        );
    }, [user?.theme]);    

    const login = async (data) => {
        const res = await axios.post("/api/auth/login", data);
        setUser(res.data.user);
        navigate("/feed", { replace: true });
    };

    const signup = async (data) => {
        const res = await axios.post("/api/auth/register", data);
        setUser(res.data.user);
        navigate("/feed", { replace: true });
    };

    const logout = async () => {
        await axios.post("/api/auth/logout");
        setUser(null);
        navigate("/", { replace: true });
    };

    const updateTheme = async (theme) => {
        try {
            const res = await axios.put("/api/users/theme", { theme });
    
            setUser((prev) => ({
                ...(prev || {}),
                theme: res.data.theme,
            }));
        } catch (err) {
            console.error("Theme update failed", err);
        }
    };    

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout , updateTheme }}>
            {children}
        </AuthContext.Provider>
    );
};