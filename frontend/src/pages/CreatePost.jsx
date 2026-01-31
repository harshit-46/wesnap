import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import useCreatePost from '../hooks/useCreatePost';

export default function CreatePost() {
    const {createPost} = useCreatePost();
    const {user} = useAuth();
    const [content, setContent] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        allowComments: true,
        showLikes: true
    });

    const currentUser = user || {};

    const charLimit = 5000;
    const maxFileSize = 50 * 1024 * 1024;

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > maxFileSize) {
            alert('File size must be less than 50MB');
            return;
        }

        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            alert('Only images and videos are allowed');
            return;
        }

        setMediaFile(file);
        setMediaType(file.type.startsWith('image/') ? 'image' : 'video');

        const reader = new FileReader();
        reader.onload = (e) => {
            setMediaPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveMedia = () => {
        setMediaFile(null);
        setMediaPreview(null);
        setMediaType(null);
        document.getElementById('mediaInput').value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            alert('Please write something before posting');
            return;
        }

        setIsLoading(true);
        try {
            await createPost({
                content,
                media: mediaFile,
            });
        } catch (err) {
            console.error(err);
            alert("Failed to create post");
        } finally {
            setIsLoading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex">
            <main className="flex-1 lg:ml-64 px-4 py-10">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-lg font-semibold text-white shadow-sm">
                            {currentUser.name?.charAt(0) || '?'}
                        </div>
                        <div>
                            <h3 className="font-medium text-base text-neutral-900 dark:text-neutral-100">
                                @{currentUser.username || 'user'}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Posting as {currentUser.name || 'you'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="content" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            What's on your mind?
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="10"
                            placeholder="Share your thoughts..."
                            className="
                                w-full bg-white dark:bg-neutral-900
                                border border-neutral-200 dark:border-neutral-700
                                rounded-xl px-5 py-4 text-neutral-900 dark:text-neutral-100
                                placeholder-neutral-400 dark:placeholder-neutral-500
                                focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500
                                focus:ring-1 focus:ring-neutral-200 dark:focus:ring-neutral-700
                                shadow-sm transition resize-none
                            "
                        />
                        <p className={`text-xs text-right ${content.length > charLimit ? 'text-red-600 dark:text-red-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                            {content.length} / {charLimit} characters
                        </p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Add Media (Optional)
                        </label>

                        {!mediaPreview ? (
                            <div className="
                                border-2 border-dashed border-neutral-200 dark:border-neutral-700
                                rounded-xl p-10 text-center
                                hover:border-neutral-300 dark:hover:border-neutral-600
                                transition cursor-pointer
                                bg-white dark:bg-neutral-900/50
                                shadow-sm
                            ">
                                <input
                                    type="file"
                                    id="mediaInput"
                                    accept="image/*,video/*"
                                    onChange={handleMediaChange}
                                    className="hidden"
                                />
                                <label htmlFor="mediaInput" className="cursor-pointer">
                                    <svg className="w-14 h-14 mx-auto mb-4 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-neutral-600 dark:text-neutral-300 font-medium mb-1">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                                        Images or Videos • Max 50MB
                                    </p>
                                </label>
                            </div>
                        ) : (
                            <div className="
                                relative bg-white dark:bg-neutral-900
                                border border-neutral-200 dark:border-neutral-700
                                rounded-xl overflow-hidden shadow-sm
                            ">
                                {mediaType === 'image' ? (
                                    <img src={mediaPreview} className="w-full h-auto object-contain" alt="Preview" />
                                ) : (
                                    <video src={mediaPreview} className="w-full h-auto" controls />
                                )}

                                <button
                                    onClick={handleRemoveMedia}
                                    className="
                                        absolute top-4 right-4
                                        w-9 h-9 bg-neutral-900/80 hover:bg-red-600
                                        rounded-full flex items-center justify-center
                                        transition group shadow-md
                                    "
                                >
                                    <svg className="w-5 h-5 text-white group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/80 border-t border-neutral-200 dark:border-neutral-700">
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                                        {mediaFile?.name}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {formatFileSize(mediaFile?.size || 0)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 pt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !content.trim()}
                            className={`
                                flex-1 py-3.5 px-6 rounded-xl font-medium text-base transition-all shadow-sm
                                ${isLoading || !content.trim()
                                    ? "bg-neutral-300 text-neutral-500 cursor-not-allowed dark:bg-neutral-700 dark:text-neutral-400"
                                    : "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950"
                                }
                                flex items-center justify-center gap-2.5
                            `}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Posting...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    <span>Post</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}