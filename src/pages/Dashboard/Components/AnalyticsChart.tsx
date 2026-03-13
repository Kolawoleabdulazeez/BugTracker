import * as React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ProjectAnalyticsBar() {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Project Analytics
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          Weekly activity overview
        </Typography>

        <Box sx={{ width: "100%" }}>
          <BarChart
            height={240}
            xAxis={[
              {
                data: days,
                scaleType: "band",
              },
            ]}
            series={[
              {
                label: "This week",
                data: [12, 19, 15, 25, 22, 8, 5],
                color: "#1e88e5", // dark blue
              },
              {
                label: "Last week",
                data: [24, 30, 28, 35, 31, 15, 12],
                color: "#90caf9", // light blue
              },
            ]}
            grid={{ horizontal: true }}
            margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
            borderRadius={6}
            sx={{
              // soften axis text
              "& .MuiChartsAxis-tickLabel": {
                fill: "rgba(0,0,0,0.55)",
                fontSize: 12,
              },
              "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
                stroke: "rgba(0,0,0,0.12)",
              },
              // make grid light and dotted-ish feel
              "& .MuiChartsGrid-line": {
                stroke: "rgba(0,0,0,0.08)",
                strokeDasharray: "3 3",
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}