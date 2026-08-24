"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DynamicMetricCardSkeleton } from "./dynamic-metric-card-skeleton";

export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Premium Stats Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <DynamicMetricCardSkeleton key={idx} />
                ))}
            </div>

            {/* Charts Skeleton Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Revenue Chart Skeleton */}
                <Card className="lg:col-span-2 overflow-hidden border-none shadow-sm">
                    <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                            <Skeleton className="h-10 w-32 rounded-lg" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="relative h-[300px] w-full mt-4">
                            {/* Simulating lines with multiple skeletons */}
                            <div className="absolute inset-0 flex flex-col justify-between py-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-full h-px bg-muted/30" />
                                ))}
                            </div>
                            <Skeleton className="h-full w-full bg-gradient-to-t from-primary/5 to-transparent rounded-lg" />
                        </div>
                    </CardContent>
                </Card>

                {/* Sales Pie Skeleton */}
                <Card className="overflow-hidden border-none shadow-sm flex flex-col">
                    <CardHeader className="items-center pb-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-40" />
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center items-center py-6">
                        <div className="relative h-[220px] w-[220px]">
                            <div className="absolute inset-0 rounded-full border-[12px] border-muted/20" />
                            <div className="absolute inset-4 rounded-full border-[1px] border-dashed border-primary/20" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Skeleton className="h-10 w-20 rounded-lg" />
                                <Skeleton className="h-3 w-16 mt-2" />
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tables Skeleton Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {[1, 2].map((i) => (
                    <div key={i} className="space-y-4">
                        <div className="flex justify-between items-end px-2">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-60" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-md" />
                        </div>
                        <Card className="border-none shadow-sm overflow-hidden">
                            <div className="h-[350px] w-full p-4 space-y-4">
                                {[...Array(6)].map((_, j) => (
                                    <div key={j} className="flex gap-4 items-center">
                                        <Skeleton className="h-10 w-10 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-3 w-2/3" />
                                        </div>
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
