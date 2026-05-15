"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ChartPoint = { name: string; total: number };

export function CoordenadorCharts({
  roomDemand,
  hourDemand,
  idleRooms,
}: {
  roomDemand: ChartPoint[];
  hourDemand: ChartPoint[];
  idleRooms: ChartPoint[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ChartCard title="Salas com maior demanda" data={roomDemand} />
      <ChartCard title="Horários de maior demanda" data={hourDemand} />
      <ChartCard
        title="Salas mais ociosas (menos reservas)"
        data={idleRooms}
        className="md:col-span-2"
      />
    </div>
  );
}

function ChartCard({
  title,
  data,
  className,
}: {
  title: string;
  data: ChartPoint[];
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {data.length === 0 ? (
          <p className="flex h-full items-center justify-center text-muted-foreground">
            Sem dados suficientes ainda.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#047857" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
