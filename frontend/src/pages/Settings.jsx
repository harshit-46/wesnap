import React, { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function Settings() {
    const { user } = useAuth();

    const [name, setName] = useState(user?.name || "");
    const [username, setUsername] = useState(user?.username || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [email] = useState(user?.email || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ name, username, bio });
    };

    return (
        <div className="w-full">
            <main className="mx-auto max-w-3xl px-5 sm:px-8 py-14 space-y-6">
                {/* Header */}
                <header className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                        Settings
                    </h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Manage your account preferences and personal information.
                    </p>
                </header>

                {/* Profile */}
                <section className="rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900">
                    <div className="px-6 py-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
                        <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                            Profile
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            {/* Name */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Full name
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700
                                    bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100
                                    focus:outline-none focus:ring-2 focus:ring-neutral-300/40 dark:focus:ring-neutral-700/40"
                                />
                            </div>

                            {/* Username */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Username
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
                                        @
                                    </span>
                                    <input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700
                                        bg-white dark:bg-neutral-800 pl-8 pr-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100
                                        focus:outline-none focus:ring-2 focus:ring-neutral-300/40 dark:focus:ring-neutral-700/40"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Bio
                            </label>
                            <textarea
                                rows={3}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="A short description about yourself"
                                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700
                                bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100
                                resize-none focus:outline-none focus:ring-2 focus:ring-neutral-300/40 dark:focus:ring-neutral-700/40"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white
                                hover:bg-neutral-800 transition dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                            >
                                Save changes
                            </button>
                        </div>
                    </form>
                </section>

                {/* Security */}
                <section className="rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900">
                    <div className="px-6 py-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
                        <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                            Security
                        </h2>
                    </div>

                    <div className="px-6 py-6 space-y-6">
                        {/* Email */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Email
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    value={email}
                                    readOnly
                                    className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-700
                                    bg-neutral-100 dark:bg-neutral-800 px-4 py-2.5 text-sm
                                    text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                                />
                                <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                                    Change
                                </button>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Password
                            </label>
                            <button
                                type="button"
                                className="rounded-lg border border-neutral-300 dark:border-neutral-700
                                bg-white dark:bg-neutral-800 px-4 py-2 text-sm font-medium
                                text-neutral-700 dark:text-neutral-300
                                hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
                            >
                                Update password
                            </button>
                        </div>
                    </div>
                </section>

                {/* Danger zone */}
                <section className="rounded-xl border border-red-200/60 dark:border-red-900/40
                            bg-red-50/40 dark:bg-red-950/20">
                    <div className="px-6 py-4 border-b border-red-200/60 dark:border-red-900/40">
                        <h2 className="text-lg font-medium text-red-700 dark:text-red-300">
                            Danger zone
                        </h2>
                    </div>

                    <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="text-sm text-neutral-700 dark:text-neutral-400 max-w-md">
                            Permanently delete your account and all associated data. This action
                            cannot be undone.
                        </p>

                        <button
                            type="button"
                            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white
                            hover:bg-red-700 transition"
                        >
                            Delete account
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}