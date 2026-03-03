import { useState, useEffect } from "react";
import { getAvatarByUserId } from "@/utils/avatar";

type TabType = "posts" | "albums";

interface TabConfig {
  id: TabType;
  label: string;
}

const TABS: TabConfig[] = [
  { id: "posts", label: "Posts" },
  { id: "albums", label: "Albums" },
];

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  id: number;
  profileName: string;
}

const ProfileTabs = ({ activeTab, onTabChange, id, profileName }: ProfileTabsProps) => {
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsStickyVisible(window.scrollY > 350);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-16 z-40 bg-white shadow-sm ring-1 ring-gray-100 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {isStickyVisible && (
            <div className="flex items-center gap-3 py-2 pl-4 sm:pl-8 animate-in fade-in slide-in-from-left-4 duration-300">
              <img
                src={getAvatarByUserId(id)}
                alt={profileName}
                className="h-10 w-10 rounded-full border border-gray-200 object-cover"
              />
              <span className="hidden text-lg font-bold text-gray-900 md:block pr-4 border-r border-gray-200">
                {profileName}
              </span>
            </div>
          )}

          <nav className={`flex space-x-1 ${!isStickyVisible ? "pl-4 sm:pl-8" : "ml-4"}`} aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  whitespace-nowrap border-b-4 py-4 px-4 text-[15px] font-bold outline-none transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-[#ec5b13] text-[#ec5b13]"
                      : "border-transparent text-gray-500 hover:bg-gray-50"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="hidden sm:block pr-4 sm:pr-8">
           <button className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors">
              <span className="font-bold px-2">...</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTabs;
