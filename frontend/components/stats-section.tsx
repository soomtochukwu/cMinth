"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  { label: "Total NFTs Minted", value: "12,847", icon: "🎨" },
  { label: "Active Creators", value: "3,421", icon: "👨‍🎨" },
  { label: "Total Volume", value: "2,847 ETH", icon: "💎" },
  { label: "Royalties Paid", value: "1,234 ETH", icon: "💰" },
]

export function StatsSection() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
