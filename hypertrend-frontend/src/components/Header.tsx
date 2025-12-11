// src/components/Header.tsx

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import DarkModeToggle from "@/components/ui/darkmode"
export default function Header() {
  return (
    // Outer Wrapper: Responsible for sticky position and full-width background
    <header className="sticky top-0 z-50 w-full bg-background border-b shadow-sm">
      
      {/* NEW: Container to center and constrain the header content */}
      {/* We use 'px-4' here to match the 'p-4' (which implies px-4) in your App.tsx container */}
      <div className="container mx-auto"> 
        
        {/* Inner Flex: The main layout of the header elements */}
        <div className="flex items-center py-3 gap-6 px-10"> 

          {/* Left: App name + tagline (mr-auto removed to allow flex-1 search below) */}
          <div className="flex flex-col mr-8 leading-tight">
            <span className="text-2xl text-transparent font-bold bg-clip-text bg-linear-to-r/oklab from-indigo-300 to-teal-700">HyperTrend</span>
            <span className="text-xs text-gray-500 -mt-0.5 text-muted-foreground">
              Insightful stock analysis always
            </span>
          </div>

          {/* Tab Navigation */}
          <Tabs defaultValue="overview" className="hidden md:block">
            {/* ... TabsList and Triggers remain the same ... */}
            <TabsList className="bg-transparent p-0 space-x-6">
              <TabsTrigger
                value="overview"
                className="
                  tab-hover-gradient
                  data-[state=active]:border-b-2
                  border-blue-600
                  rounded-none pb-2 
                ">
                  Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="
                  tab-hover-gradient
                  data-[state=active]:border-b-2
                  border-blue-600
                  rounded-none pb-2 
                ">
                  Analytics
              </TabsTrigger>
              <TabsTrigger value="watchlist" className="
                  tab-hover-gradient
                  data-[state=active]:border-b-2
                  border-blue-600
                  rounded-none pb-2 
                ">
                  Watchlist
              </TabsTrigger>
              <TabsTrigger value="market" className="
                  tab-hover-gradient
                  data-[state=active]:border-b-2
                  border-blue-600
                  rounded-none pb-2 
                ">
                  Market
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Right side (Search, Bell, Avatar) */}
          {/* We now use 'ml-auto' on this group to push it to the far right of the container */}
          <div className="ml-auto flex items-center gap-4">

            {/* Search */}
            <Input
              placeholder="Search..."
              className="w-48 md:w-64"
            />

            {/* Bell Icon */}
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} className="text-gray-700" />
            </button>
            <DarkModeToggle />
            {/* User Avatar */}
            <Avatar className="cursor-pointer">
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}