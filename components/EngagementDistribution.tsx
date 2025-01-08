"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartDataPoint, SocialData } from "@/lib/types"

const chartConfig = {
    like: {
        label: "Likes",
        color: "hsl(var(--chart-1))",
    },
    comment: {
        label: "Comments",
        color: "hsl(var(--chart-2))",
    },
    share: {
        label: "Shares",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

export function EngagementDistribution({ data }: { data: SocialData[] }) {

    const transformData = (): ChartDataPoint[] => {
        // Sort data by date
        const sortedData = [...data].sort((a, b) =>
            new Date(a.date_posted).getTime() - new Date(b.date_posted).getTime()
        );

        // Transform each data point
        return sortedData.map(item => ({
            month: new Date(item.date_posted).toLocaleDateString('default', {
                month: 'long',
                day: 'numeric'
            }),
            like: item.likes,
            comment: item.comments,
            share: item.shares
        }));
    };

    const chartData = transformData();

    // Calculate trend
    const getTrend = () => {
        if (chartData.length < 2) return 0;

        const latest = chartData.slice(-Math.min(7, chartData.length));
        const current = latest.reduce((sum, item) =>
            sum + item.like + item.comment + item.share, 0) / latest.length;

        const previous = chartData
            .slice(-Math.min(14, chartData.length), -Math.min(7, chartData.length))
            .reduce((sum, item) => sum + item.like + item.comment + item.share, 0) /
            Math.min(7, chartData.length - Math.min(7, chartData.length));

        return ((current - previous) / previous) * 100;
    };

    const trend = getTrend();


    return (
        <Card>
            <CardHeader>
                <CardTitle>Engagement Distribution</CardTitle>
                <CardDescription>
                    Daily engagement metrics
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                            dataKey="share"
                            type="natural"
                            fill="var(--color-share)"
                            fillOpacity={0.4}
                            stroke="var(--color-share)"
                            stackId="a"
                        />
                        <Area
                            dataKey="comment"
                            type="natural"
                            fill="var(--color-comment)"
                            fillOpacity={0.4}
                            stroke="var(--color-comment)"
                            stackId="a"
                        />
                        <Area
                            dataKey="like"
                            type="natural"
                            fill="var(--color-like)"
                            fillOpacity={0.4}
                            stroke="var(--color-like)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            {trend > 0 ? 'Trending up' : 'Trending down'} by {Math.abs(trend).toFixed(1)}% this month
                            {trend > 0 ? (<TrendingUp className="h-4 w-4" />) : (<TrendingDown className="h-4 w-4" />)}
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            {chartData[0]?.month} - {chartData[chartData.length - 1]?.month} {new Date().getFullYear()}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
