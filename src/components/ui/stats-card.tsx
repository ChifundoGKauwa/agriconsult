import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

type StatsCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export function StatsCard({ title, value, subtitle }: StatsCardProps) {
  return (
    <Card className="border-secondary/20">
      <CardHeader>
        <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-3xl font-semibold text-primary">{value}</p>
        {subtitle && <p className="text-xs text-secondary">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
