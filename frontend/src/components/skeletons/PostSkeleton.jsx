import React from "react";

function PostSkeleton() {
    return (
        <article className="
            bg-white dark:bg-neutral-900 
            border border-neutral-200 dark:border-neutral-800 
            rounded-xl p-6 
            shadow-sm
            animate-pulse
        ">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0" />

                    <div className="space-y-2">
                        <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-800 rounded" />
                        <div className="h-3 w-36 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    </div>
                </div>

                <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-800 rounded" />
            </div>

            <div className="space-y-2 mb-4">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-4/6" />
            </div>

            <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl mb-4" />

            <div className="flex items-center gap-6 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="h-4 w-6 bg-neutral-200 dark:bg-neutral-800 rounded" />
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="h-4 w-6 bg-neutral-200 dark:bg-neutral-800 rounded" />
                </div>
            </div>
        </article>
    );
}

export default PostSkeleton;