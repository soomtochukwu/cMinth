"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowUpRight, ArrowDownLeft, Palette, ShoppingCart } from "lucide-react"
import { Activity } from "@/store/nft-store"

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "mint":
        return <Palette className="h-4 w-4 text-blue-500" />
      case "purchase":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "sale":
        return <ArrowUpRight className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "mint":
        return "bg-blue-500"
      case "purchase":
        return "bg-green-500"
      case "sale":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  console.log(activities)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest transactions and interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <Badge className={`text-xs ${getActivityColor(activity.type)}`}>{activity.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                {activity.amount && <p className="text-sm font-semibold text-purple-400">{activity.amount}</p>}
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
