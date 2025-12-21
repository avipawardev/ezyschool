import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { BarChart, BookOpen, LogOut, Users, LifeBuoy, Coins, Menu } from "lucide-react";
import { AuthContext } from "@/context/auth-context";
import NotificationManager from "../common/notification-manager";
import { useContext, useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "../ui/sheet";

import { ModeToggle } from "@/components/mode-toggle";

function AdminLayout() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);
  const [openSidebar, setOpenSidebar] = useState(false);

  const handleLogout = () => {
    resetCredentials();
    sessionStorage.clear();
    navigate("/auth");
  };

  const menuItems = [
      { label: "Dashboard", icon: <BarChart className="h-4 w-4" />, path: "/admin/dashboard" },
      { label: "Courses", icon: <BookOpen className="h-4 w-4" />, path: "/admin/courses" },
      { label: "Users", icon: <Users className="h-4 w-4" />, path: "/admin/users" },
      { label: "Support", icon: <LifeBuoy className="h-4 w-4" />, path: "/admin/support" },
      { label: "Referrals", icon: <Coins className="h-4 w-4" />, path: "/admin/referrals" },
  ];

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar - Desktop */}
      <div className="hidden border-r bg-gray-100/40 md:block w-64 dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <span className="flex items-center gap-2 font-semibold">
              EzySchool Admin
            </span>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    onClick={() => navigate(item.path)}
                    className="justify-start gap-2 w-full mb-1"
                  >
                    {item.icon}
                    {item.label}
                  </Button>
              ))}
              <Button
                variant="ghost"
                 onClick={handleLogout}
                className="justify-start gap-2 w-full text-red-500 hover:text-red-600 hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1">
          <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-4 dark:bg-gray-800/40 lg:h-[60px] lg:px-6 justify-between">
               {/* Mobile Sidebar Trigger */}
               <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
                  <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="md:hidden">
                          <Menu className="h-5 w-5" />
                          <span className="sr-only">Toggle navigation menu</span>
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                      <SheetHeader>
                          <SheetTitle>EzySchool Admin</SheetTitle>
                      </SheetHeader>
                      <nav className="grid gap-2 py-6">
                           {menuItems.map((item) => (
                              <Button
                                key={item.label}
                                variant="ghost"
                                onClick={() => {
                                    navigate(item.path);
                                    setOpenSidebar(false);
                                }}
                                className="justify-start gap-2 w-full mb-1"
                              >
                                {item.icon}
                                {item.label}
                              </Button>
                          ))}
                          <Button
                              variant="ghost"
                              onClick={() => {
                                  handleLogout();
                                  setOpenSidebar(false);
                              }}
                              className="justify-start gap-2 w-full text-red-500 hover:text-red-600 hover:bg-red-100"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </Button>
                      </nav>
                  </SheetContent>
               </Sheet>

               <div className="flex items-center gap-4 ml-auto">
                    <ModeToggle />
                    <NotificationManager userId={useContext(AuthContext).auth?.user?._id} role="admin" />
               </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-hidden">
            <Outlet />
          </main>
      </div>
    </div>
  );
}

export default AdminLayout;
