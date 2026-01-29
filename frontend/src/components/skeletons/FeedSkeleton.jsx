import React from "react";
import Navbar from "../Navbar";
import FeedAside from "../FeedAside";
import PostSkeleton from "./PostSkeleton";

function FeedSkeleton() {
    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex">
            <div className="fixed left-0 top-0 h-screen w-64 bg-[#F9FAFB] dark:bg-neutral-950 hidden lg:block">
                <Navbar />
            </div>

            <main className="flex-1 lg:ml-64 lg:mr-90 px-3 sm:px-4 lg:px-5 py-8 space-y-6">
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
            </main>

            <div className="fixed right-0 top-0 h-screen w-90 dark:border-zinc-800 bg-white dark:bg-zinc-950 hidden lg:block">
                <FeedAside />
            </div>
        </div>
    );
}

export default FeedSkeleton;