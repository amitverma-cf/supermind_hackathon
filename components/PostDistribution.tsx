"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

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
import { SocialData } from "@/lib/types"

const chartConfig = {
    Static: {
        label: "Static",
        color: "hsl(var(--chart-1))",
    },
    Video: {
        label: "Video",
        color: "hsl(var(--chart-2))",
    },
    Carousel: {
        label: "Carousel",
        color: "hsl(var(--chart-3))",
    },
    Story: {
        label: "Story",
        color: "hsl(var(--chart-4))",
    },
    Reel: {
        label: "Reel",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

export function PostDistribution({ data }: { data: SocialData[] }) {

    const chartData = React.useMemo(() => {
        const postCounts = data.reduce((acc, post) => {
            acc[post.post_type] = (acc[post.post_type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(postCounts).map(([type, count]) => ({
            type,
            count,
            label: chartConfig[type as keyof typeof chartConfig].label,
            fill: chartConfig[type as keyof typeof chartConfig].color
        }));
    }, [data]);

    const totalPosts = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.count, 0);
    }, [chartData]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-0">
                <CardTitle>Post Distribution</CardTitle>
                <CardDescription>Post Distribution by post type</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="type"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalPosts}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total Posts
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Distribution of {totalPosts} posts
                </div>
                <div className="leading-none text-muted-foreground">
                    {chartData.map(({ count, label }) =>
                        `${label}: ${((count / totalPosts) * 100).toFixed(1)}%`
                    ).join(' | ')}
                </div>
            </CardFooter>
        </Card>
    )
}
