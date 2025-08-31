// add these imports at top
import { useFamily } from "@/context/FamilyContext";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function DataUsageChart() {
  const { users } = useFamily();

  // Calculate total bytes robustly and return shape { value: MB, percentage }
  const totalSize = React.useMemo(() => {
    if (!users || users.length === 0) return { value: 0, percentage: 0 };

    let totalBytes = 0;
    users.forEach(user => {
      if (!user || !user.documents) return;
      Object.values(user.documents).forEach(category => {
        if (!Array.isArray(category)) return;
        category.forEach(item => {
          if (!item || !Array.isArray(item.files)) return;
          item.files.forEach((f: any) => {
            totalBytes += Number(f.size) || 0;
          });
        });
      });
    });

    // Convert to MB
    const valueInMB = totalBytes / (1024 * 1024);
    // 5 GB = 5120 MB
    const percentage = (valueInMB / (5 * 1024)) * 100;

    return {
      value: valueInMB,
      percentage: Math.min(Math.max(percentage, 0), 100), // clamp 0..100
    };
  }, [users]);

  // build a reliable pie dataset: used + remaining (sum = 100)
  const usedPct = totalSize?.percentage ?? 0;

  // If you want a zero state instead of null, handle it here
  if (!totalSize) return null;

  return (
    <Card className="flex flex-col gap-3 w-full max-w-64 bg-background">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-center">Family Storage Tracker</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
      <div className=" flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gradient-yellow">{totalSize.value >= 1000 ? `${(totalSize.value/1024).toFixed(2)} GB` : `${totalSize.value.toFixed(1)} MB`}</div>
              <div className="text-sm text-muted-foreground">{usedPct.toFixed(2)}% of 5 GB</div>
            </div>
          </div>
      </CardContent>
    </Card>
  );
}
