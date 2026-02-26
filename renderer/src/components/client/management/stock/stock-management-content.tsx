"use client";

import { StockList } from "./stock-list";
import { StockSummaryCharts } from "./stock-summary-charts";

export function StockManagementContent() {
    return (
        <div>
            <StockSummaryCharts />
            <StockList />
        </div>
    );
}