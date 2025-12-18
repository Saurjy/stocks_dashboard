import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Bell, Search, Menu, Plus } from "lucide-react"
import DarkModeToggle from "@/components/ui/darkmode"
import { Link, useLocation } from 'react-router-dom';
import { ProfileDropdown } from "@/components/header/Profile-Dropdown"
import { Button } from "@/components/ui/button"
import { AddHoldingModal } from "@/components/modals/Add-Stock-Holding"
import { useState } from "react"


const tabsData = ["overview", "analytics", "watchlist", "market"];

interface HeaderProps {
  onMenuClick: () => void;
}
export default function Header({ onMenuClick }: HeaderProps) {
  const [open, setOpen] = useState(false)

  const location = useLocation();
  const currentTab = location.pathname.slice(1) || 'overview';

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b shadow-sm dark:shadow-white/35">
      <div className="flex items-center justify-between px-4 py-3">

        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center py-3 gap-3 px-4 md:px-10">
            <div className="flex flex-col leading-tight w-full text-center md:w-auto md:text-left">
              <span className="text-2xl text-transparent font-bold bg-clip-text bg-linear-to-r/oklab from-indigo-300 to-teal-700">
                HyperTrend
              </span>
              <span className="text-xs text-gray-500 -mt-0.5 text-muted-foreground">
                Insightful stock analysis always
              </span>
            </div>

            <Tabs value={currentTab} className="hidden md:block ml-0 md:ml-10">

              <TabsList className="bg-transparent p-0 space-x-6">
                {tabsData.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    asChild
                    className="
                    tab-hover-gradient
                    data-[state=active]:border-b-2 data-[state=active]:border-blue-600
                    rounded-none pb-2 dark:shadow-white/35
                  "
                  >
                    <Link to={`/${tab}`}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="flex items-center  gap-3 md:gap-4 md:ml-auto w-full md:w-auto mt-3 md:mt-0 justify-around">
              {/* Mobile menu */}
              <button
                onClick={onMenuClick}
                className="md:hidden p-2 rounded-md hover:bg-muted">
                <Menu size={20} />
              </button>
              <button className="md:hidden p-2 rounded-full hover:bg-gray-100">
                <Search size={20} />
              </button>

              <Input
                placeholder="Search..."
                className="hidden md:block w-64"
              />
              <Button
                onClick={() => setOpen(true)}
                className="gap-2 p-2 rounded-full md:bg-slate-100 bg-transparent md:dark:bg-slate-800 md:border hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Plus className="resize-30 text-primary" />
                <p className="md:flex hidden text-primary">Add Stock</p>
              </Button>
              <AddHoldingModal
                open={open}
                onOpenChange={setOpen}
              />

              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <Bell size={20} className="text-gray-700 dark:text-gray-100" />
              </button>

              <DarkModeToggle />

              <ProfileDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}