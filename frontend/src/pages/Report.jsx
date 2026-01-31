import React, { useState } from 'react';

export default function ReportProblem() {
    const [formData, setFormData] = useState({
        category: '',
        subject: '',
        description: '',
        priority: 'medium',
        email: '',
        attachments: []
    });

    const [submitted, setSubmitted] = useState(false);

    const categories = [
        { value: 'bug', label: 'Bug Report', icon: '🐛' },
        { value: 'feature', label: 'Feature Request', icon: '✨' },
        { value: 'account', label: 'Account Issue', icon: '👤' },
        { value: 'payment', label: 'Payment Problem', icon: '💳' },
        { value: 'security', label: 'Security Concern', icon: '🔒' },
        { value: 'other', label: 'Other', icon: '📝' }
    ];

    const priorities = [
        { value: 'low', label: 'Low', color: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900' },
        { value: 'medium', label: 'Medium', color: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900' },
        { value: 'high', label: 'High', color: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...files]
        }));
    };

    const removeAttachment = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: API call to submit the report
        console.log('Submitting report:', formData);
        setSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
            setSubmitted(false);
            setFormData({
                category: '',
                subject: '',
                description: '',
                priority: 'medium',
                email: '',
                attachments: []
            });
        }, 3000);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] dark:bg-neutral-950 flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200 dark:border-zinc-800 p-8 shadow-2xl">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                            Report Submitted
                        </h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Thank you for your report. Our team will review it and get back to you within 24-48 hours.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-neutral-950">
            <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Header */}
                <header className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-red-500 to-orange-500 rounded-2xl mb-4 shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                        Report a Problem
                    </h1>
                    <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        We're here to help. Please provide as much detail as possible so we can resolve your issue quickly.
                    </p>
                </header>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                    <div className="p-8 space-y-8">
                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                                What type of issue are you experiencing?
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                            formData.category === cat.value
                                                ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-zinc-800 shadow-md'
                                                : 'border-neutral-200 dark:border-zinc-700 hover:border-neutral-300 dark:hover:border-zinc-600 hover:bg-neutral-50 dark:hover:bg-zinc-800/50'
                                        }`}
                                    >
                                        <div className="text-2xl mb-2">{cat.icon}</div>
                                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                            {cat.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Priority Level */}
                        <div>
                            <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                                Priority Level
                            </label>
                            <div className="flex gap-3">
                                {priorities.map((priority) => (
                                    <button
                                        key={priority.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                                        className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                                            formData.priority === priority.value
                                                ? priority.color
                                                : 'border-neutral-200 dark:border-zinc-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-zinc-800/50'
                                        }`}
                                    >
                                        {priority.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                                Subject
                            </label>
                            <input
                                id="subject"
                                name="subject"
                                type="text"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Brief description of the issue"
                                className="block w-full rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:border-neutral-900 dark:focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-neutral-400/10 focus:outline-none transition"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                                Detailed Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows={6}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Please describe the problem in detail. Include steps to reproduce, error messages, and any other relevant information..."
                                className="block w-full rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:border-neutral-900 dark:focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-neutral-400/10 focus:outline-none transition resize-none"
                            />
                        </div>

                        {/* Contact Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                                Contact Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                className="block w-full rounded-lg border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:border-neutral-900 dark:focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-neutral-400/10 focus:outline-none transition"
                            />
                        </div>

                        {/* File Attachments */}
                        <div>
                            <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                                Attachments (Optional)
                            </label>
                            <div className="space-y-3">
                                <label className="block">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*,.pdf,.doc,.docx"
                                    />
                                    <div className="border-2 border-dashed border-neutral-300 dark:border-zinc-700 rounded-lg p-6 text-center hover:border-neutral-400 dark:hover:border-zinc-600 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                                        <svg className="w-8 h-8 text-neutral-400 dark:text-neutral-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                                            PNG, JPG, PDF up to 10MB
                                        </p>
                                    </div>
                                </label>

                                {/* Attachment List */}
                                {formData.attachments.length > 0 && (
                                    <div className="space-y-2">
                                        {formData.attachments.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-zinc-800 rounded-lg border border-neutral-200 dark:border-zinc-700"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <svg className="w-5 h-5 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                    </svg>
                                                    <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
                                                        {file.name}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(index)}
                                                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className="bg-neutral-50 dark:bg-zinc-800/50 px-8 py-6 border-t border-neutral-200 dark:border-zinc-800">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                We typically respond within 24-48 hours
                            </p>
                            <button
                                type="submit"
                                disabled={!formData.category || !formData.subject || !formData.description || !formData.email}
                                className="w-full sm:w-auto px-8 py-3 bg-linear-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 text-white dark:text-neutral-900 text-sm font-semibold rounded-lg hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
                            >
                                Submit Report
                            </button>
                        </div>
                    </div>
                </form>

                {/* Help Text */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Need immediate assistance?{' '}
                        <a href="#" className="text-neutral-900 dark:text-neutral-100 font-medium hover:underline">
                            Contact our support team
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
}