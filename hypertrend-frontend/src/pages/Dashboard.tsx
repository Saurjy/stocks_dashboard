import { ChartAreaGradient } from "@/components/charts/Gradient-Chart"
import { ChartRadarLinesOnly } from "@/components/charts/Radar-Chart"
import { StatCard } from "@/components/cards/Stat-Card"
import { Table } from "@/components/tables/Holding-Tables"
import {
  TrendingUp, Wallet,
  ArrowUpDown, LineChart,
  TrendingDown, ChartColumnIncreasing,
  ClockFading, Spotlight,
  WavesArrowDown, Equal
} from "lucide-react"

type TrendVisuals = {
  icon: React.ReactNode;
  accentClass: string;
}

const getCardVisuals = (changeValue: string): TrendVisuals => {

  const isPositive = changeValue.startsWith('+');
  const isNegative = changeValue.startsWith('-');

  if (isPositive) {
    return {
      icon: <TrendingUp className="h-5 w-5" />,
      accentClass: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    };
  }

  if (isNegative) {
    return {
      icon: <TrendingDown className="h-5 w-5" />,
      accentClass: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400", // Red colors
    };
  }

  return {
    icon: <Equal className="h-5 w-5" />, // Or a neutral icon
    accentClass: "bg-slate-300 text-foreground dark:bg-muted-foreground/20",
  };
}

const pnlChange = "+0.73%"; // This would come from your state/data
const pnlVisuals = getCardVisuals(pnlChange);

export default function Dasboard() {

  return (

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-background rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="mb-6">
            <h1 className="text-foreground mb-2 text-[32px]">
              Portfolio Overview
            </h1>
            <p className="text-muted-foreground">
              Track your Indian stock market investments and performance
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Portfolio Value"
              value="₹5,87,500"
              change="+8.2%"
              icon={<LineChart className="h-5 w-5" />}
              accentClass="bg-indigo-200 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
            />

            <StatCard
              title="Today's P&L"
              value="+₹4,250"
              change={pnlChange}
              icon={pnlVisuals.icon}
              accentClass={pnlVisuals.accentClass}
            />

            <StatCard
              title="Total Invested"
              value="₹5,25,000"
              change="Base"
              icon={<Wallet className="h-5 w-5" />}
              accentClass="bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
            />

            <StatCard
              title="Total Returns"
              value="+₹62,500"
              change="+11.9%"
              icon={<ArrowUpDown className="h-5 w-5" />}
              accentClass="bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
            />

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartAreaGradient />
            <ChartRadarLinesOnly />
          </div>

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <StatCard
            title="Best Performer"
            value="TCS"
            icon={<Spotlight className="h-5 w-5" />}
            accentClass="bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
            synopsis="+18.5% returns"
          />
          <StatCard
            title="Worst Performer"
            value="HDFC Bank"
            icon={<WavesArrowDown className="h-5 w-5" />}
            accentClass="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
            synopsis="-3.2% returns"
          />
          <StatCard
            title="Active Holdings"
            value="12"
            icon={<ChartColumnIncreasing className="h-5 w-5" />}
            accentClass="bg-indigo-200 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
            synopsis="Across 6 sectors"
          />
          <StatCard
            title="Avg Holding Period"
            value="12 Months"
            icon={<ClockFading className="h-5 w-5" />}
            accentClass="bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
            synopsis="Long-term focused"
          />
        </div>
        <Table />
      </div>
  );
}