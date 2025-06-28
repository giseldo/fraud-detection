"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 12,
  },
  {
    name: "Fev",
    total: 15,
  },
  {
    name: "Mar",
    total: 18,
  },
  {
    name: "Abr",
    total: 14,
  },
  {
    name: "Mai",
    total: 24,
  },
  {
    name: "Jun",
    total: 22,
  },
  {
    name: "Jul",
    total: 19,
  },
  {
    name: "Ago",
    total: 21,
  },
  {
    name: "Set",
    total: 26,
  },
  {
    name: "Out",
    total: 24,
  },
  {
    name: "Nov",
    total: 22,
  },
  {
    name: "Dez",
    total: 20,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
