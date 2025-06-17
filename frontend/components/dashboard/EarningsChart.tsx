"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EarningsData {
  month: string
  primary: number
  royalties: number
}

interface EarningsChartProps {
  data: EarningsData[]
  totalEarnings: string
  monthlyChange: number
}

export function EarningsChart({ data, totalEarnings, monthlyChange }: EarningsChartProps) {
  const maxValue = Math.max(...data.map((d) => d.primary + d.royalties))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Earnings Overview</CardTitle>
            <CardDescription>Primary sales and royalty earnings</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-400">{totalEarnings} ETH</div>
            <Badge variant={monthlyChange >= 0 ? "default" : "destructive"}>
              {monthlyChange >= 0 ? "+" : ""}
              {monthlyChange}% this month
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{item.month}</span>
                <span className="font-medium">{(item.primary + item.royalties).toFixed(2)} ETH</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                <div
                  className="bg-purple-500 transition-all duration-300"
                  style={{ width: `${(item.primary / maxValue) * 100}%` }}
                />
                <div
                  className="bg-cyan-500 transition-all duration-300"
                  style={{ width: `${(item.royalties / maxValue) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Primary: {item.primary.toFixed(2)} ETH</span>
                <span>Royalties: {item.royalties.toFixed(2)} ETH</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm">Primary Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
            <span className="text-sm">Royalties</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
