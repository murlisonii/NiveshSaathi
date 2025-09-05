
"use client";

import {
  BookOpen,
  Bot,
  CandlestickChart,
  LayoutDashboard,
  Languages,
  Menu,
  ShieldCheck,
} from "lucide-react";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/trade", label: "Trade", icon: CandlestickChart },
  { href: "/risk-profile", label: "Risk Profile", icon: ShieldCheck },
  { href: "/summarizer", label: "Summarizer", icon: Languages },
  { href: "/chatbot", label: "Chatbot", icon: Bot },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
           <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-sidebar-foreground"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Nivesh Saathi
          </span>
          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <SidebarTrigger>
              <Menu />
            </SidebarTrigger>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior={false} passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <>
                    <item.icon />
                    <span>{item.label}</span>
                  </>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
