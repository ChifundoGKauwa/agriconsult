import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

type ChartBar = {
  label: string;
  value: number;
  max?: number;
};

type SimpleBarChartProps = {
  title: string;
  data: ChartBar[];
};

export function SimpleBarChart({ title, data }: SimpleBarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <Card className="border-secondary/20">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 h-40">
          {data.length === 0 ? (
            <p className="text-xs text-secondary">No data yet</p>
          ) : (
            data.map((bar) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-primary">
                  {bar.value}
                </span>
                <div
                  className="w-full rounded-t bg-accent transition-all"
                  style={{
                    height: `${Math.max((bar.value / maxVal) * 100, 4)}%`,
                  }}
                />
                <span className="text-[10px] text-secondary">{bar.label}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
