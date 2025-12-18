import "@/App.css";
import { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";

import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import Market from "@/pages/Market";
import Watchlist from "@/pages/Watchlist";
import Profile from "@/pages/Profile";

type AppLayoutProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function AppLayout({ sidebarOpen, setSidebarOpen }: AppLayoutProps) {
  return (
    <div className="min-h-screen gradient-bg dark:gradient-bg-dark">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="pt-5">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Routes>
      <Route
        element={
          <AppLayout
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        }
      >
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/market" element={<Market />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
