import React from "react";
import { Link } from "react-router-dom";

export const Logo = ({ to = "/", className = "" }) => {
  return (
    <Link to={to} className={`flex items-center gap-2 transition-transform hover:scale-105 duration-200 ${className}`}>
      {/* Graduation Cap Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-10 w-10 text-orange-500"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
      
      {/* Text */}
      <div className="font-bold text-2xl tracking-wide">
        <span className="text-orange-500">Ezy</span>
        <span className="text-gray-900 dark:text-white">School</span>
      </div>
    </Link>
  );
};
