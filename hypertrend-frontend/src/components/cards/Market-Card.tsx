import {
  Card, CardContent,
  CardHeader, CardTitle,
  CardFooter, CardDescription
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

type MarketCardProps = {
  title: string
  description: string
  value: string
  change?: string
  daychange?: string
  vol: string
  cap: string
  sector: string
}

const getTrendMeta = (value?: string) => {
  if (!value) {
    return {
      text: "text-primary",
      graph: "text-muted-foreground",
      icon: null,
    }
  }

  if (value.startsWith("+")) {
    return {
      text: "text-green-600 dark:text-green-400",
      graph: "text-green-500",
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
    }
  }

  if (value.startsWith("-")) {
    return {
      text: "text-red-600 dark:text-red-400",
      graph: "text-red-500",
      icon: <TrendingDown className="h-4 w-4 text-red-500" />,
    }
  }

  return {
    text: "text-primary",
    graph: "text-muted-foreground",
    icon: null,
  }
}

export function MarketCard({
  title,
  description,
  value,
  change,
  daychange,
  vol,
  cap,
  sector,

}: MarketCardProps) {
  const trend = getTrendMeta(change)

  return (
    <Card className="bg-secondary pb-3 border shadow-md dark:shadow-white/15 dark:border-white gap-5 h-full w-full py-4">
      {/* Header */}
      <CardHeader className="gap-0">
        <CardTitle className="text-foreground md:text-[20px] text-[16px] font-bold">
          <div className="flex items-center justify-between">
            {title}

            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs bg-muted/50">
              {sector}
            </div>


          </div>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground md:text-[13px] text-[12px]">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {/* Value */}
          <div className="font-bold text-primary md:text-[16px] text-[14px]">{value}</div>

          {/* Change */}
          <div>
            {change && (
              <div className="flex items-center gap-1">
                {trend.icon}
                <span className={cn("font-medium text-[12px]", trend.text)}>
                  {change} ({daychange})
                </span>
              </div>
            )}
          </div>
        </div>

      </CardContent>
      {/* Bottom Row */}
      <CardFooter className="justify-between">
        <h1 className="md:text-[16px] text-[14px]">Volume:
          <span className="text-[10px] md:text-[13px] text-muted-foreground pl-1">{vol}
          </span>
        </h1>
        <h1 className="md:text-[16px] text-[14px]">Mkt Cap:
          <span className="text-[10px] md:text-[13px] text-muted-foreground pl-1">{cap}
          </span>
        </h1>
      </CardFooter>
    </Card >
  )
}
