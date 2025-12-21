import { GraduationCap, TvMinimalPlay, Menu, User, LifeBuoy, Share2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { ModeToggle } from "../mode-toggle";
import { Logo } from "../logo";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "../ui/sheet";
import NotificationManager from "../common/notification-manager";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials, auth } = useContext(AuthContext);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  function handleNavigate(path) {
      location.pathname.includes(path) ? null : navigate(path);
  }

  const MenuItems = ({ isMobile = false }) => {
    const navigateTo = (path) => {
        navigate(path);
        // If in mobile sheet, could add logic to close sheet here if needed, 
        // but keeping it simple for now as per original code structure.
    };

    const commonClass = isMobile 
        ? "group flex cursor-pointer items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-gray-100/50 transition-all duration-200 dark:hover:bg-gray-800/50 w-full"
        : "group flex flex-col cursor-pointer items-center justify-center gap-1 rounded-lg hover:bg-gray-100/50 transition-all duration-200 dark:hover:bg-gray-800/50 px-2 py-1";

    const textClass = isMobile
        ? "font-bold text-[15px] text-gray-800 group-hover:text-black transition-colors dark:text-gray-200 dark:group-hover:text-white"
        : "font-medium text-[11px] text-gray-700 group-hover:text-black transition-colors dark:text-gray-400 dark:group-hover:text-white";

    const iconClass = isMobile
        ? "w-6 h-6 text-gray-700 group-hover:text-orange-500 transition-colors dark:text-gray-300"
        : "w-5 h-5 text-gray-600 group-hover:text-primary transition-colors dark:text-gray-400 dark:group-hover:text-white mb-0.5";

    return (
      <div className={isMobile ? "flex flex-col gap-2 w-full" : "flex items-center gap-6"}>
        
        {/* Explore Courses Button - Kept prominent */}
        <div className={isMobile ? "w-full mb-2" : "mr-4"}>
           <Button
            variant="outline"
            onClick={() => handleNavigate("/courses")}
            className={isMobile 
                ? "w-full justify-start text-[15px] font-semibold"
                : "text-[14px] font-semibold border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300 rounded-full px-6 dark:border-gray-200 dark:hover:bg-gray-200 dark:hover:text-black dark:text-white"
            }
          >
           {isMobile && <TvMinimalPlay className="w-5 h-5 mr-3" />}
            Explore Courses
          </Button>
        </div>

        <div onClick={() => navigateTo("/student-courses")} className={commonClass}>
           {/* Mobile: Text Left, Icon Right (or flipped based on design preference, keeping consistent with request for clean UI) */}
           {/* Request said: "navbar icons should be at the top and the text below them" -> Desktop */}
           
           {!isMobile && <TvMinimalPlay className={iconClass} />}
           <span className={textClass}>My Courses</span>
           {isMobile && <TvMinimalPlay className={iconClass} />}
        </div>

        <div onClick={() => navigateTo("/profile")} className={commonClass}>
            {!isMobile && <User className={iconClass} />}
            <span className={textClass}>Profile</span>
            {isMobile && <User className={iconClass} />}
        </div>

        <div onClick={() => navigateTo("/support")} className={commonClass}>
            {!isMobile && <LifeBuoy className={iconClass} />}
            <span className={textClass}>Support</span>
            {isMobile && <LifeBuoy className={iconClass} />}
        </div>

        <div onClick={() => navigateTo("/refer-and-earn")} className={commonClass}>
            {!isMobile && <Share2 className={iconClass} />}
            <span className={textClass}>Refer & Earn</span>
            {isMobile && <Share2 className={iconClass} />}
        </div>

        {!isMobile && (
             <Button 
                onClick={handleLogout} 
                variant="ghost"
                className="font-medium text-[11px] flex flex-col items-center justify-center gap-1 h-auto py-1 px-2 text-gray-700 hover:text-red-500 hover:bg-transparent"
             >
                <div className="w-5 h-5 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                </div>
                <span>Sign Out</span>
             </Button>
        )}
        
         {isMobile && (
             <Button 
                onClick={handleLogout} 
                className="w-full mt-4 font-semibold bg-gray-900 text-white hover:bg-black transition-colors duration-300 shadow-md dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
                Sign Out
            </Button>
        )}

      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-lg transition-all duration-300 flex items-center justify-between px-4 md:px-6 py-3 dark:bg-slate-900/70 dark:border-slate-800">
      <div className="flex items-center space-x-4">
        <Logo to="/home" />
      </div>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex items-center gap-4">
            <NotificationManager userId={auth?.user?._id} role="student" />
            <MenuItems />
            <ModeToggle />
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-4">
        <NotificationManager userId={auth?.user?._id} role="student" />
        <ModeToggle />
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-6">
                    <MenuItems isMobile={true} />
                </div>
            </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
