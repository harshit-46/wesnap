import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth";

export default function Settings() {
    const { user } = useAuth();

    const [name, setName] = useState(user?.name || "");
    const [username, setUsername] = useState(user?.username || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [email] = useState(user?.email || "");
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            setUploadingAvatar(true);

            const res = await fetch(
                "http://localhost:3000/api/posts/update-profile",
                {
                    method: "PUT",
                    credentials: "include",
                    body: formData
                }
            );

            if (!res.ok) throw new Error("Avatar upload failed");

            const data = await res.json();

        } catch (err) {
            console.error(err);
            alert("Failed to upload avatar");
            setAvatarPreview(user?.avatar || null);
        } finally {
            setUploadingAvatar(false);
        }
    };


    const handleRemoveAvatar = () => {
        setAvatarPreview(null);
        setAvatarFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:3000/api/users/updateInfo", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    username,
                    bio
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update profile");
            }

            const data = await res.json();
            toast.success("Profile updated");

        } catch (err) {
            console.error(err);
        }
    };

    const getInitials = () => {
        if (name) {
            return name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        return user?.email?.[0]?.toUpperCase() || "U";
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

                {/* Avatar Upload Section */}
                <section className="rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900">
                    <div className="px-6 py-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
                        <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                            Profile Photo
                        </h2>
                    </div>

                    <div className="px-6 py-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            {/* Avatar Preview */}
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full overflow-hidden bg-linear-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center border-2 border-neutral-200 dark:border-neutral-700">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-semibold text-neutral-500 dark:text-neutral-400">
                                            {getInitials()}
                                        </span>
                                    )}
                                </div>
                                {avatarPreview && (
                                    <button
                                        onClick={handleRemoveAvatar}
                                        type="button"
                                        className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition cursor-pointer"
                                        aria-label="Remove avatar"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Upload Controls */}
                            <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-center gap-3">
                                    <label
                                        htmlFor="avatar-upload"
                                        className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium
                                                ${uploadingAvatar
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-neutral-50 dark:hover:bg-neutral-700"}
                                            `}
                                    >
                                        {uploadingAvatar ? "Uploading..." : "Upload photo"}
                                    </label>

                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        disabled={uploadingAvatar}
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                    {avatarPreview && (
                                        <button
                                            onClick={handleRemoveAvatar}
                                            type="button"
                                            className="rounded-lg px-4 py-2 text-sm cursor-pointer font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    JPG, PNG, or WEBP. Max file size 5MB. Recommended size 400x400px.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Profile */}
                <section className="rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900">
                    <div className="px-6 py-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
                        <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                            Profile Information
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
                                <button className="text-sm font-medium text-blue-600 cursor-pointer hover:underline dark:text-blue-400">
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