import React, { useEffect, useState } from "react";

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [logoScale, setLogoScale] = useState(false);

    useEffect(() => {
        // Trigger logo scale animation
        const scaleTimer = setTimeout(() => {
            setLogoScale(true);
        }, 100);

        // Start fade out after 2.5 seconds
        const fadeTimer = setTimeout(() => {
            setIsVisible(false);
        }, 2500);

        return () => {
            clearTimeout(scaleTimer);
            clearTimeout(fadeTimer);
        };
    }, []);

    return (
        <div
            className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"
                }`}
            style={{ backgroundColor: "#F9FAFB" }}
        >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-neutral-50 via-transparent to-neutral-100 opacity-60" />

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Logo with refined animation */}
                <div className={`relative mb-8 transition-all duration-1000 ease-out ${logoScale ? "scale-100 opacity-100" : "scale-75 opacity-0"
                    }`}>
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 w-20 h-20 -m-2 rounded-full bg-neutral-900/5 blur-xl" />

                    {/* Logo container with shadow */}
                    <div className="relative w-20 h-20 rounded-full bg-neutral-900 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        <div className="w-12 h-12 border-[2.5px] border-white rounded-full" />
                    </div>

                    {/* Rotating ring accent */}
                    <div className="absolute inset-0 w-20 h-20">
                        <svg className="w-full h-full animate-spin" style={{ animationDuration: "3s" }}>
                            <circle
                                cx="40"
                                cy="40"
                                r="38"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                strokeDasharray="60 180"
                                className="text-neutral-300"
                                opacity="0.4"
                            />
                        </svg>
                    </div>
                </div>

                {/* Brand name with staggered animation */}
                <div className={`flex flex-col items-center gap-3 transition-all duration-1000 delay-300 ease-out ${logoScale ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}>
                    <h1 className="text-[2.75rem] font-semibold tracking-tight text-neutral-900">
                        Wesnap
                    </h1>
                    <div className="h-px w-16 bg-linear-to-r from-transparent via-neutral-300 to-transparent" />
                </div>

                {/* Elegant loading indicator */}
                <div className={`mt-12 transition-all duration-1000 delay-500 ease-out ${logoScale ? "opacity-100" : "opacity-0"
                    }`}>
                    <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-pulse"
                                style={{
                                    animationDelay: `${i * 0.2}s`,
                                    animationDuration: "1.4s",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom accent - optional tagline */}
            <div className={`absolute bottom-12 left-0 right-0 text-center transition-all duration-1000 delay-700 ease-out ${logoScale ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}>
                <p className="text-neutral-400 text-xs font-medium tracking-wider uppercase">
                    Capture • Share • Connect
                </p>
            </div>
        </div>
    );
}