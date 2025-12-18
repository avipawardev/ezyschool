import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            {/* Links Block */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                <div className="flex flex-col gap-2">
                    <Link to="/courses" className="text-sm hover:underline">All Subjects</Link>
                    <Link to="/courses" className="text-sm hover:underline">Class 5-8</Link>
                    <Link to="/courses" className="text-sm hover:underline">Class 9-10</Link>
                    <Link to="/courses" className="text-sm hover:underline">Class 11-12</Link>
                    <Link to="/doubts" className="text-sm hover:underline">Doubt Solving</Link>
                </div>
                <div className="flex flex-col gap-2">
                    <Link to="/about" className="text-sm hover:underline">About Us</Link>
                    <Link to="/contact" className="text-sm hover:underline">Contact</Link>
                    <Link to="/careers" className="text-sm hover:underline">Careers</Link>
                    <Link to="/blog" className="text-sm hover:underline">Blog</Link>
                    <Link to="/parents" className="text-sm hover:underline">For Parents</Link>
                </div>
                 <div className="flex flex-col gap-2">
                    <Link to="/terms" className="text-sm hover:underline">Terms of Use</Link>
                    <Link to="/privacy" className="text-sm hover:underline">Privacy Policy</Link>
                    <Link to="/sitemap" className="text-sm hover:underline">Sitemap</Link>
                    <Link to="/accessibility" className="text-sm hover:underline">Accessibility</Link>
                </div>
            </div>

             {/* Language Selector (Mock) */}
             <div>
                <button className="flex items-center gap-2 border border-white px-4 py-2 text-sm hover:bg-gray-800 transition">
                    <span>🌐</span> English
                </button>
             </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-700">
             <div className="flex items-center gap-4 mb-4 md:mb-0">
                 <h2 className="text-xl font-bold tracking-tight">EzySchool</h2>
             </div>
             <p className="text-xs text-gray-400">© 2024 EzySchool, Inc.</p>
        </div>
      </div>
    </footer>
  );
}
