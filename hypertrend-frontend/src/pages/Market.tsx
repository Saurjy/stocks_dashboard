import { StatCard } from "@/components/cards/Stat-Card"
import { GraphCard } from "@/components/cards/Graph-Card"
import { MarketCard } from "@/components/cards/Market-Card"
import { useState } from "react"
import { marketData } from "@/assets/static_data"

import {
  IndianRupee, Activity,
  TrendingUp, TrendingDown,
  Search
} from "lucide-react"
import { DropdownFilter } from "@/components/dropdown/Dropdown-Filter";
import { DropdownSort } from "@/components/dropdown/Dropdown-Sort";
import { InputPagination } from "@/components/pagination/Input-Pagination"

const ITEMS_PER_PAGE = 8

export default function Market() {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(marketData.length / ITEMS_PER_PAGE)

  const currentItems = marketData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-background rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="mb-6">
          <h1 className="text-foreground text-[32px]">
            Market Overview
          </h1>
          <p className="text-muted-foreground ">
            Your Daily Market Compass
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
          <h2 className="text-foreground text-[24px]">
            Market Indices
          </h2>
          <p className="text-muted-foreground text-[15px]">
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
      <div className="bg-background rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="mb-6">
          <h1 className="text-foreground text-[24px]">
            Market
          </h1>
          <p className="text-muted-foreground text-[15px]">
            Explore and discover stocks
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" className="flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 bg-card border-border" placeholder="Search by name or symbol..." value="">
            </input>
          </div>
          <div className=" relative grid grid-cols-2 gap-3">
            <DropdownFilter />
            <DropdownSort />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-6">
          {currentItems.map((item, index) => (
            <MarketCard
              key={index}
              title={item.title}
              description={item.description}
              sector={item.sector}
              value={item.value}
              change={item.change}
              daychange={item.daychange}
              vol={item.vol}
              cap={item.cap}
            />
          ))}
        </div>
        <InputPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>

  );
}