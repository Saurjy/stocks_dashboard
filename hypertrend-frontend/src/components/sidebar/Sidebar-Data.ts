// sidebar-data.ts
import { BarChart3, Eye, LineChart, TrendingUp } from "lucide-react";

export const sidebarItems = [
  { label: "Overview", path: "/overview", icon: Eye },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Watchlist", path: "/watchlist", icon: LineChart },
  { label: "Market", path: "/market", icon: TrendingUp },
];
