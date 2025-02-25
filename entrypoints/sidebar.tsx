import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoIosSettings } from "react-icons/io";
import { RiDashboardFill } from "react-icons/ri";
import {
  Loader2,
  LogOut,
  PanelRightClose,
  PanelRightOpen,
  User2,
} from "lucide-react";
export enum SidebarType {
  "home" = "home",
  "settings" = "settings",
}

const Sidebar = ({
  sideNav,
  closeContent,
  showContent,
}: {
  sideNav: (sidebarType: SidebarType) => void;
  closeContent?: () => void;
  showContent: boolean;
}) => {
  const [sidebarType, setSidebarType] = useState<SidebarType>(SidebarType.home);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <aside className="fixed inset-y-0 right-0 flex w-14 flex-col bg-[#2E5077]">
      {closeContent && (
        <a
          className="hover:cursor-pointer flex h-12 w-12 my-2 items-center justify-center text-white transition-colors hover:text-gray-200 hover:bg-[#223b58] ml-auto mr-auto rounded-full"
          onClick={() => {
            closeContent();
            localStorage.setItem("isOpenSidebar", JSON.stringify(!showContent));
          }}
        >
          {showContent ? (
            <PanelRightClose className="h-5 w-5 transition-all group-hover:scale-110" />
          ) : (
            <PanelRightOpen className="h-5 w-5 transition-all group-hover:scale-110" />
          )}
          <span className="sr-only">close sidebar</span>
        </a>
      )}
      <>
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  className={`hover:cursor-pointer flex h-9 w-9 items-center justify-center text-white hover:text-gray-200 hover:bg-[#223b58] transition-colors ${
                    sidebarType == SidebarType.home
                      ? "rounded-full bg-primary text-lg font-semibold text-primary-foreground"
                      : ""
                  }`}
                  onClick={() => {
                    setSidebarType(SidebarType.home);
                    sideNav(SidebarType.home);
                  }}
                >
                  <RiDashboardFill
                    className={`h-4 w-4 transition-all group-hover:scale-110`}
                  />
                  <span className="sr-only">home</span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right">home</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  className={`hover:cursor-pointer flex h-9 w-9 items-center justify-center text-white transition-colors hover:text-gray-200 hover:bg-[#223b58] ${
                    sidebarType == SidebarType.settings
                      ? "rounded-full bg-primary text-lg font-semibold text-primary-foreground"
                      : ""
                  } `}
                  onClick={() => {
                    setSidebarType(SidebarType.settings);
                    sideNav(SidebarType.settings);
                  }}
                >
                  <IoIosSettings className={`h-5 w-5`} />
                  <span className="sr-only">Settings</span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </>
    </aside>
  );
};

export default Sidebar;
