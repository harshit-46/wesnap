/*

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        try {
            setIsLoading(true);

            await fetch("http://localhost:3000/api/reset/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            setIsSuccess(true);
        } catch (err) {
            setError("Something went wrong. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
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

                    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <CheckCircle className="w-14 h-14 text-green-500" />
                        </div>

                        <h2 className="text-2xl font-serif mb-2">
                            Check your email
                        </h2>

                        <p className="text-gray-600 mb-4">
                            We’ve sent a password reset link to
                        </p>

                        <p className="font-medium text-gray-900 mb-6">{email}</p>

                        <p className="text-gray-500 text-sm mb-8">
                            If you don’t see the email, check your spam folder.
                        </p>

                        <Link
                            to="/"
                            className="block w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
                    <h2 className="text-4xl font-serif mb-3">
                        Forgot Password
                    </h2>
                    <p className="text-gray-600">
                        We’ll send you a link to reset your password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 text-sm flex items-center gap-2">
                                {error}
                            </p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg font-medium cursor-pointer transition
                        ${isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-black text-white hover:bg-gray-800"
                            }`}
                    >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <Link
                        to="/"
                        className="text-gray-900 font-semibold hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

*/









import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        try {
            setIsLoading(true);

            await fetch("http://localhost:3000/api/reset/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            setIsSuccess(true);
        } catch (err) {
            setError("Something went wrong. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
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

                    <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center shadow-sm">
                        <div className="flex justify-center mb-6">
                            <CheckCircle className="w-16 h-16 text-emerald-500" />
                        </div>

                        <h2 className="text-3xl font-medium text-neutral-900 mb-3">
                            Check your email
                        </h2>

                        <p className="text-neutral-600 mb-3">
                            We’ve sent a password reset link to
                        </p>

                        <p className="font-medium text-neutral-900 mb-6 break-all">
                            {email}
                        </p>

                        <p className="text-neutral-500 text-sm mb-8">
                            If you don’t see the email, check your spam or promotions folder.
                        </p>

                        <Link
                            to="/"
                            className="block w-full py-3.5 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 active:bg-neutral-950 transition-all shadow-sm"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
                    <h2 className="text-4xl font-medium text-neutral-900 mb-3">
                        Forgot password?
                    </h2>
                    <p className="text-neutral-600 text-[15.5px]">
                        We'll send you a link to reset your password
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
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                            Email address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-neutral-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200 transition-shadow shadow-sm"
                                required
                            />
                        </div>
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
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-10 text-center text-sm text-neutral-600">
                    <Link
                        to="/"
                        className="text-neutral-900 font-medium hover:text-neutral-950 transition-colors"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}