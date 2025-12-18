import React from "react";
import StudentNavbar from "../components/StudentNavbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function StudentLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <StudentNavbar />
      <main className="flex-grow">
          {children ? children : <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
