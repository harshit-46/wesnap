/*

import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../context/useAuth";

export default function Signup() {
    const { user, loading, signup } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    if (loading) return null;

    if (user) {
        return <Navigate to="/feed" replace />;
    }

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
        setServerError("");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = "Only letters, numbers & underscores allowed";
        }

        if (!formData.email.trim()) newErrors.email = "Email is required";

        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            setServerError("");

            await signup({
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
        } catch (err) {
            setServerError(
                err?.response?.data?.message || "Signup failed. Try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-8"
            style={{ backgroundColor: "#FFF8F0" }}
        >
            <div className="w-full max-w-md">
                <div className="flex items-center gap-2 mb-12">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white rounded-full" />
                    </div>
                    <span className="text-xl font-semibold">Vibely</span>
                </div>

                <div className="mb-8">
                    <h2 className="text-4xl font-serif mb-3">Create Account</h2>
                    <p className="text-gray-600">Join Vibely and start connecting</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-2">
                    {serverError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 text-sm">{serverError}</p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        {errors.username && (
                            <p className="text-red-600 text-xs mt-1">{errors.username}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`mt-2 w-full py-3 rounded-lg font-medium cursor-pointer transition
                        ${isSubmitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-black text-white hover:bg-gray-800"
                            }`}
                    >
                        {isSubmitting ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link to="/" className="text-gray-900 font-semibold">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}



*/














import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../context/useAuth";

export default function Signup() {
    const { user, loading, signup } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    if (loading) return null;

    if (user) {
        return <Navigate to="/feed" replace />;
    }

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
        setServerError("");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = "Only letters, numbers & underscores allowed";
        }

        if (!formData.email.trim()) newErrors.email = "Email is required";

        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            setServerError("");

            await signup({
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
        } catch (err) {
            setServerError(
                err?.response?.data?.message || "Signup failed. Try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6 sm:p-8"
            style={{ backgroundColor: "#F9FAFB" }}
        >
            <div className="w-full max-w-md">
                <div className="flex items-center gap-2.5 mb-12">
                    <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center">
                        <div className="w-5.5 h-5.5 border-2 border-white rounded-full" />
                    </div>
                    <span className="text-2xl font-semibold tracking-tight text-neutral-900">Vibely</span>
                </div>

                <div className="mb-10">
                    <h2 className="text-4xl font-medium text-neutral-900 mb-3">Create account</h2>
                    <p className="text-neutral-600 text-[15.5px]">
                        Join Vibely and start connecting
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {serverError && (
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
                                {serverError}
                            </p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-neutral-400" />
                            </div>
                            <input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200 transition-shadow shadow-sm"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-red-700 text-xs mt-1.5">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-neutral-400" />
                            </div>
                            <input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200 transition-shadow shadow-sm"
                            />
                        </div>
                        {errors.username && (
                            <p className="text-red-700 text-xs mt-1.5">{errors.username}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-neutral-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200 transition-shadow shadow-sm"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-700 text-xs mt-1.5">{errors.email}</p>
                        )}
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
                                placeholder="Create a password"
                                className="w-full pl-11 pr-14 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200 transition-shadow shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-700 text-xs mt-1.5">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3.5 rounded-xl font-medium text-base transition-all shadow-sm
                            ${isSubmitting
                                ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                                : "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950"
                            }`}
                    >
                        {isSubmitting ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <div className="mt-10 text-center text-sm text-neutral-600">
                    Already have an account?{" "}
                    <Link
                        to="/"
                        className="text-neutral-900 font-medium hover:text-neutral-950 transition-colors"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}