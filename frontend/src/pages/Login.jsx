import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { Link, Navigate } from "react-router-dom";

export default function Login() {
    const { user, loading, login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (loading) return null;

    if (user) {
        return <Navigate to="/feed" replace />;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.identifier || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setIsLoading(true);
            setError("");
            await login(formData);
        } catch (err) {
            if (!err.response) {
                setError("Server not reachable. Please try again.");
            } else {
                setError(err.response?.data?.message || "Invalid credentials");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-8"
            style={{ backgroundColor: "#F9FAFB" }} // very light warm gray
        >
            <div className="w-full max-w-md">
                <div className="flex items-center gap-2.5 mb-12">
                    <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center">
                        <div className="w-5.5 h-5.5 border-2 border-white rounded-full" />
                    </div>
                    <span className="text-2xl font-semibold tracking-tight text-neutral-900">Wesnap</span>
                </div>

                <div className="mb-10">
                    <h2 className="text-4xl font-medium text-neutral-900 mb-3">Welcome back</h2>
                    <p className="text-neutral-600 text-[15.5px]">
                        Sign in to continue to your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50/70 border border-red-200 rounded-xl p-4">
                            <p className="text-red-800 text-sm flex items-center gap-2.5">
                                <svg
                                    className="w-5 h-5 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="identifier" className="block text-sm font-medium text-neutral-700 mb-2">
                            Username or Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-neutral-400" />
                            </div>
                            <input
                                id="identifier"
                                type="text"
                                name="identifier"
                                value={formData.identifier}
                                onChange={handleChange}
                                placeholder="username or email"
                                autoComplete="username"
                                className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200 transition-shadow shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-neutral-400" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                className="w-full pl-11 pr-14 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200 transition-shadow shadow-sm"
                                required
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end text-sm">
                        <Link
                            to="/resetpassword"
                            className="text-neutral-800 hover:text-neutral-950 font-medium transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3.5 rounded-xl font-medium text-base transition-all shadow-sm
        ${isLoading
                                ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                                : "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950"
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-2.5 h-5 w-5 inline"
                                    viewBox="0 0 80 80"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <line x1="40" y1="10" x2="40" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="1" />
                                    <line x1="40" y1="10" x2="40" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.9" transform="rotate(30 40 40)" />
                                    <line x1="40" y1="10" x2="40" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.8" transform="rotate(60 40 40)" />
                                    <line x1="40" y1="10" x2="40" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.7" transform="rotate(90 40 40)" />
                                    <line x1="40" y1="10" x2="40" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.6" transform="rotate(120 40 40)" />
                                    <line x1="40" y1="10" x2="40" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.5" transform="rotate(150 40 40)" />
                                    <line x1="40" y1="10" x2="40" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.4" transform="rotate(180 40 40)" />
                                    <line x1="40" y1="10" x2="40" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.3" transform="rotate(210 40 40)" />
                                    <line x1="40" y1="10" x2="40" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.25" transform="rotate(240 40 40)" />
                                    <line x1="40" y1="10" x2="40" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.2" transform="rotate(270 40 40)" />
                                    <line x1="40" y1="10" x2="40" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.15" transform="rotate(300 40 40)" />
                                    <line x1="40" y1="10" x2="40" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.1" transform="rotate(330 40 40)" />
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <button
                    disabled={isLoading}
                    onClick={() => {
                        window.location.href = "http://localhost:3000/api/auth/google";
                    }}
                    className={`mt-6 w-full py-3.5 px-4 bg-white border border-neutral-200 rounded-xl font-medium text-neutral-800 transition-all flex items-center justify-center gap-3 shadow-sm
                        ${isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-neutral-50 hover:border-neutral-300 active:bg-neutral-100"}`}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Sign in with Google
                </button>

                <div className="mt-10 text-center text-sm text-neutral-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-neutral-900 font-medium hover:text-neutral-950 transition-colors">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}