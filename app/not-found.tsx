import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-10 shadow-lg border border-gray-100 rotate-3 transition-transform hover:rotate-6">
                <span className="text-4xl font-black text-gray-900">404</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.9]">
                Page <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Not Found.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-lg font-medium leading-relaxed">
                The page you are looking for doesn't exist or has been moved to another dimension.
            </p>
            <Link
                href="/"
                className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
                <ArrowLeft className="w-5 h-5" /> Return Home
            </Link>
        </div>
    );
}
