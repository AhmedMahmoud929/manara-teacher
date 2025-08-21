"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeRangeSelector } from "@/components/home/time-range-selector";

interface SalesDataPoint {
  name: string;
  value: number;
}

interface LineChartCardProps {
  title: string;
  data: SalesDataPoint[];
  timeRange: string;
  timeRangesOption: { label: string; value: string }[];
  onTimeRangeChange: (value: string) => void;
}

export function LineChartCard({
  title,
  data,
  timeRange,
  timeRangesOption,
  onTimeRangeChange,
}: LineChartCardProps) {
  // Calculate a reasonable domain for Y axis
  const maxValue = Math.max(...data.map((item) => item.value));
  const minValue = Math.min(...data.map((item) => item.value));
  const yAxisDomain = [
    minValue > 0 ? 0 : minValue * 0.9, // Start from 0 or slightly below min if negative
    maxValue * 1.1, // Add 10% padding above max value
  ];

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center">
          <TimeRangeSelector
            options={timeRangesOption}
            value={timeRange}
            onChange={onTimeRangeChange}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 0, right: 0, left: 10, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={20}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={yAxisDomain}
                tickMargin={50}
                tickFormatter={(value) => `${Number(value).toFixed(2)}ج.م`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              التاريخ
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0].payload.name}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              المبيعات
                            </span>
                            <span className="font-bold">
                              {payload[0].value?.toLocaleString()}ج
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3EB489"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#3EB489",
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
