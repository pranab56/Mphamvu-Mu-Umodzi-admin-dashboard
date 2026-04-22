"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

const dailyData = [
    { label: "MAY 01", value: 7 },
    { label: "", value: 10 },
    { label: "", value: 8 },
    { label: "", value: 12 },
    { label: "MAY 05", value: 14 },
    { label: "", value: 18 },
    { label: "", value: 16 },
    { label: "", value: 21 },
    { label: "", value: 23 },
    { label: "MAY 10", value: 20 },
    { label: "", value: 27 },
    { label: "", value: 24 },
    { label: "", value: 29 },
    { label: "", value: 31 },
    { label: "MAY 15", value: 31 },
];

const monthlyData = [
    { label: "JAN", value: 120 },
    { label: "FEB", value: 150 },
    { label: "MAR", value: 180 },
    { label: "APR", value: 220 },
    { label: "MAY", value: 280 },
    { label: "JUN", value: 250 },
    { label: "JUL", value: 310 },
    { label: "AUG", value: 390 },
    { label: "SEP", value: 360 },
    { label: "OCT", value: 410 },
    { label: "NOV", value: 450 },
    { label: "DEC", value: 490 },
];

export default function UserGrowthChart() {
    const [activeTab, setActiveTab] = useState<"daily" | "monthly">("daily");
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const displayData = activeTab === "daily" ? dailyData : monthlyData;

    return (
        <div className="bg-white border border-gray-200/60  rounded-2xl p-6 text-2xl md:p-8 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-[17px] font-bold text-gray-900">User Growth</h3>
                    <p className="text-[13px] text-gray-500 font-medium mt-1">
                        {activeTab === "daily"
                            ? "Daily acquisitions over the last 15 days"
                            : "Monthly acquisitions over the last year"}
                    </p>
                </div>

                {/* Animated Toggle */}
                <div className="flex items-center bg-gray-200/70 rounded-full p-1 relative shadow-inner">
                    {(["daily", "monthly"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative px-6 py-1.5 text-[13px] cursor-pointer font-bold transition-colors z-10 rounded-full ${activeTab === tab ? "text-[#A53200]" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="tab-bubble"
                                    className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="h-100 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={displayData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                        onMouseMove={(state) => {
                            if (state.isTooltipActive && typeof state.activeTooltipIndex === "number") {
                                setActiveIndex(state.activeTooltipIndex);
                            } else {
                                setActiveIndex(null);
                            }
                        }}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9CA3AF", fontSize: 10, fontWeight: "bold" }}
                            dy={15}
                        />
                        <Tooltip
                            cursor={{ fill: "transparent" }}
                            contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                                padding: "12px 16px",
                                fontWeight: "bold",
                                color: "#111827",
                                fontSize: "14px"
                            }}
                            labelStyle={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}
                            itemStyle={{ color: "#A53200" }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[4, 4, 4, 4]}
                            barSize={undefined /* Let Recharts handle size or use smaller values */}
                            animationDuration={1000}
                        >
                            {displayData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={activeIndex === index ? "#A53200" : "#B2D6E4"}
                                    className="transition-colors duration-300"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
