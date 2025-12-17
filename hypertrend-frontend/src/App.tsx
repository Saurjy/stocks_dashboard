import './App.css'
import Dashboard from "@/pages/Dashboard"
import { useState } from "react";
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar";


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen gradient-bg dark:gradient-bg-dark">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <Dashboard />
      </div>
    </>
  )
}

export default App
