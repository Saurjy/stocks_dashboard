import {
  Card, CardContent,
  CardHeader, CardTitle,
  CardFooter, CardDescription
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"
import { LineChart, Line, Tooltip } from "recharts"

type GraphCardProps = {
  title: string
  value: string
  change?: string
  high: string
  low: string
  synopsis?: string
  data: number[]
}

export function MiniSparkline({ data }: { data: number[] }) {
  const chartData = data.map((v) => ({ value: v }))

  return (
    <LineChart width={120} height={40} data={chartData}>
      <Tooltip
        content={({ active, payload }) => {
          if (active && payload && payload.length) {
            return (
              <div className="bg-background border px-2 py-1 text-[10px] rounded shadow-sm">
                {payload[0].value}
              </div>
            );
          }
          return null;
        }}
      />
      <Line
        type="monotone"
        dataKey="value"
        stroke="currentColor"
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  )
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

export function GraphCard({
  title,
  value,
  change,
  high,
  low,
  synopsis,
  data,
}: GraphCardProps) {
  const trend = getTrendMeta(change)

  return (
    <Card className="bg-secondary pb-3 border shadow-md dark:shadow-white/15 dark:border-white gap-1">
      {/* Header */}
      <CardHeader className="gap-0">
        <CardTitle className="text-foreground text-[20px] font-bold">
          <div className="flex items-center justify-between">
            {title}
            {change && (
              <div className="flex items-center gap-1">
                {trend.icon}
                <span className={cn("text-sm font-medium", trend.text)}>
                  {change}
                </span>
              </div>
            )}
          </div>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground text-[13px]">{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {/* Value */}
          <div className="text-lg font-bold text-primary">{value}</div>

          {/* Mini Graph */}
          <div className={cn("h-12", trend.graph)}>
            <MiniSparkline data={data} />
          </div>
        </div>
        {synopsis && (
          <p className={cn("text-sm", trend.text)}>{synopsis}</p>
        )}
      </CardContent>
      {/* Bottom Row */}
      <CardFooter className="justify-between">
        <h1>Low:
          <span className="text-[13px] text-muted-foreground pl-1">{low}
          </span>
        </h1>
        <h1>High:
          <span className="text-[13px] text-muted-foreground pl-1">{high}
          </span>
        </h1>
      </CardFooter>
    </Card >
  )
}
