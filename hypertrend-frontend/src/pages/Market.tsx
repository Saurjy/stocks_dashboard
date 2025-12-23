import { StatCard } from "@/components/cards/Stat-Card"
import { GraphCard } from "@/components/cards/Graph-Card"
import {
  IndianRupee, Activity,
  TrendingUp, TrendingDown,
} from "lucide-react"

export default function Market() {

  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-background rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="mb-6">
          <h1 className="text-foreground mb-2 text-[32px]">
            Market
          </h1>
          <p className="text-muted-foreground">
            Explore and discover stocks for NSE & BSE
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Market Cap"
            value="₹352.8 Lakh Cr"
            change="+2.4%"
            icon={<IndianRupee className="h-5 w-5" />}
            accentClass="bg-indigo-200 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
          />
          <StatCard
            title="Total Traded Volume"
            value="₹4,234 Cr Shares"
            change="+15.3%"
            icon={<Activity className="h-5 w-5" />}
            accentClass="bg-indigo-200 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
          />
          <StatCard
            title="Advances"
            value="1,847"
            change="+234"
            icon={<TrendingUp className="h-5 w-5" />}
            accentClass="bg-indigo-200 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
          />
          <StatCard
            title="Declines"
            value="1,245"
            change="-189"
            icon={<TrendingDown className="h-5 w-5" />}
            accentClass="bg-indigo-200 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
          />
        </div>
      </div>
      <div className="bg-background rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-foreground mb-2 text-[24px]">
            Market Indices
          </h2>
          <p className="text-muted-foreground">
            Real-time performance of major indices
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <GraphCard
            title="BTC Price"
            value="$43,200"
            change="+2.4%"
            low="$41,900"
            high="$44,100"  
            synopsis="Strong upward momentum"
            data={[10, 12, 9, 14, 13, 15]}
          />
          <GraphCard
            title="BTC Price"
            value="$43,200"
            change="+2.4%"
            low="$41,900"
            high="$44,100"  
            synopsis="Strong upward momentum"
            data={[10, 12, 9, 14, 13, 15]}
          />
          <GraphCard
            title="BTC Price"
            value="$43,200"
            change="+2.4%"
            low="$41,900"
            high="$44,100"  
            synopsis="Strong upward momentum"
            data={[10, 12, 9, 14, 13, 15]}
          />
        </div>
      </div>
    </div>

  );
}