import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type StatCardProps = {
  title: string
  value: string
  change?: string
  icon: React.ReactNode
  accentClass?: string
  synopsis?: string
}

const getChangeColorClass = (value?: string) => {
  if (!value) return "text-primary"; // Default color if no value

  if (value.startsWith('+')) {
    return "text-green-600 dark:text-green-400";
  } else if (value.startsWith('-')) {
    return "text-red-600 dark:text-red-400";
  } else {
    return "text-primary"; // Neutral/Normal color
  }
}

export function StatCard({
  title,
  value,
  change,
  icon,
  accentClass,
  synopsis
}: StatCardProps) {

  const changeColorClass = getChangeColorClass(change);
  const synopsisColorClass = getChangeColorClass(synopsis);

  return (
    <Card className="bg-secondary border shadow-md dark:shadow-white/15 py-0 dark:border-white">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div
            className={cn(
              "p-2 rounded-lg",
              accentClass ?? "bg-muted text-muted-foreground"
            )}
          >
            {icon}
          </div>

          {change && (
            <span className={cn("text-sm font-medium", changeColorClass)}>
              {change}
            </span>
          )}
        </div>

        {/* Title */}
        <p className="text-sm text-muted-foreground mb-1">
          {title}
        </p>

        {/* Value */}
        <span className="text-base text-primary font-bold">
          {value}
        </span>


        {/* Synopsis */}
        {synopsis && (
          <p className={cn("text-sm pt-1", synopsisColorClass)}>
            {synopsis}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
