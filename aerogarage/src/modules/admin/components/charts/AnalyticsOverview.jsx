import { useQuery } from "@tanstack/react-query";
import { fetchAdminAnalytics } from "../../../../services/api/adminApi";
import { useAuth } from "../../../../app/auth/authContext";
import { Card, Title, TextBlock, Button } from "../../../../components/ui";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import * as Papa from "papaparse";
import { Download } from "lucide-react";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function AnalyticsOverview() {
  const { withAuthRequest } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      const res = await withAuthRequest((token) => fetchAdminAnalytics(token));
      return res?.data;
    },
    refetchInterval: 300000, // 5 min
  });

  const handleExportCSV = () => {
    if (!data) return;

    // Combine some key data for export
    const { breakdown = [], slas = 0 } = data;
    
    // Example CSV format: exporting breakdown as a primary report
    const csvData = breakdown.map(b => ({
      Category: b.name,
      Count: b.value,
      AverageSLA_Days: (slas / (1000 * 60 * 60 * 24)).toFixed(2)
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `aerogarage_analytics_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card>
        <TextBlock>Loading analytics data...</TextBlock>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <TextBlock className="text-red-500">Failed to load analytics.</TextBlock>
      </Card>
    );
  }

  const { trends = [], breakdown = [], training = [], slas = 0 } = data || {};
  const slaDays = (slas / (1000 * 60 * 60 * 24)).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Title as="h2" className="text-2xl">Business Intelligence</Title>
        <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
          <Download size={16} /> Export CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex flex-col justify-center items-center text-center p-6 bg-[var(--amc-bg-surface)]">
          <TextBlock className="text-[var(--amc-text-muted)] uppercase text-xs font-bold font-mono tracking-wider">Avg Approval SLA</TextBlock>
          <Title as="h3" className="text-4xl mt-2 text-[var(--amc-accent-500)]">{slaDays} d</Title>
        </Card>
        <Card className="flex flex-col justify-center items-center text-center p-6 bg-[var(--amc-bg-surface)]">
          <TextBlock className="text-[var(--amc-text-muted)] uppercase text-xs font-bold font-mono tracking-wider">Total Requests (Breakdown)</TextBlock>
          <Title as="h3" className="text-4xl mt-2 text-[var(--amc-accent-500)]">{breakdown.reduce((acc, b) => acc + b.value, 0)}</Title>
        </Card>
        <Card className="flex flex-col justify-center items-center text-center p-6 bg-[var(--amc-bg-surface)]">
          <TextBlock className="text-[var(--amc-text-muted)] uppercase text-xs font-bold font-mono tracking-wider">Training Enrolled</TextBlock>
          <Title as="h3" className="text-4xl mt-2 text-[var(--amc-accent-500)]">{training.reduce((acc, t) => acc + t.count, 0)}</Title>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends Chart */}
        <Card className="flex flex-col h-[400px]">
          <Title as="h4" className="text-lg mb-4">Request Volume Trends</Title>
          <div className="flex-1 min-h-0">
            {trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--amc-border)" />
                  <XAxis dataKey="month" stroke="var(--amc-text-muted)" />
                  <YAxis stroke="var(--amc-text-muted)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--amc-bg-main)", borderColor: "var(--amc-border)", color: "var(--amc-text-strong)" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 8 }} name="Requests" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--amc-text-muted)]">No trend data available</div>
            )}
          </div>
        </Card>

        {/* Breakdown Chart */}
        <Card className="flex flex-col h-[400px]">
          <Title as="h4" className="text-lg mb-4">Service Category Breakdown</Title>
          <div className="flex-1 min-h-0">
            {breakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {breakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "var(--amc-bg-main)", borderColor: "var(--amc-border)", color: "var(--amc-text-strong)" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--amc-text-muted)]">No breakdown data available</div>
            )}
          </div>
        </Card>

        {/* Training Funnel Chart */}
        <Card className="flex flex-col h-[400px] lg:col-span-2">
          <Title as="h4" className="text-lg mb-4">Training Completion Funnel</Title>
          <div className="flex-1 min-h-0">
            {training.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={training} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--amc-border)" />
                  <XAxis type="number" stroke="var(--amc-text-muted)" />
                  <YAxis type="category" dataKey="status" stroke="var(--amc-text-muted)" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--amc-bg-main)", borderColor: "var(--amc-border)", color: "var(--amc-text-strong)" }} />
                  <Legend />
                  <Bar dataKey="count" fill="#10b981" name="Employees" radius={[0, 4, 4, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--amc-text-muted)]">No training data available</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
