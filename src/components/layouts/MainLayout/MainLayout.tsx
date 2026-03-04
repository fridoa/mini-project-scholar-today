import { useLocation } from "react-router";
import Navbar from "@/components/layouts/MainLayout/Navbar";
import Footer from "@/components/layouts/MainLayout/Footer";
import LeftSidebar from "@/components/layouts/MainLayout/LeftSidebar";
import MobileBottomNav from "@/components/layouts/MainLayout/MobileBottomNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();

  const hideSidebar = location.pathname.startsWith("/users/");

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f5] pb-16 md:pb-0">
      <Navbar />
      <main className="w-full flex-1">
        {hideSidebar ? (
          children
        ) : (
          <div className="flex w-full justify-center gap-6 pt-4">
            <div className="ml-4 hidden w-full max-w-80 shrink-0 self-start md:block">
              <div className="fixed top-25 w-[320px] max-w-80 h-[calc(100vh-100px)] overflow-y-auto pr-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <LeftSidebar />
              </div>
            </div>
            <div className="max-w-300 min-w-0 flex-1">{children}</div>
          </div>
        )}
      </main>
      <Footer />
      {!hideSidebar && <MobileBottomNav />}
    </div>
  );
};

export default MainLayout;
