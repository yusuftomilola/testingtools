"use client";
import type React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/top-bar";

function LayoutWithConditionalSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Pages where sidebar should be hidden
  const noSidebarPages = [
    "/",
    "/about",
    "/privacy-policy",
    "/terms",
    "/contact",
    "/login",
  ];

  const login = ["/login"];

  const showSidebar = !noSidebarPages.includes(pathname);
  const dontShowTopBar = login.includes(pathname);

  return (
    <>
      <div className="flex min-h-screen flex-col">
        {showSidebar ? (
          <div className="flex flex-1">
            <AppSidebar />
            <main className="flex-1 pl-10">{children}</main>
          </div>
        ) : (
          <main className="flex-1 flex justify-center">
            {dontShowTopBar ? (
              <>
                <div className="w-full max-w-7xl">{children}</div>
              </>
            ) : (
              <>
                <TopBar />
                <div className="w-full max-w-7xl mt-20">{children}</div>
              </>
            )}
          </main>
        )}
      </div>
    </>
  );
}

export default LayoutWithConditionalSidebar;
