"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const ForecastChart = () => {
  const data = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Actual",
        data: [4000, 3000, 2000, 2780, 1890, 2390, 3490, 2490, 3490, 4000, 3500, 4500],
        borderColor: "#2196F3",
        backgroundColor: "rgba(33, 150, 243, 0.2)",
        tension: 0.4,
      },
      {
        label: "Forecast",
        data: [4400, 3200, 2400, 2900, 2100, 2500, 3200, 2800, 3700, 4200, 3800, 4700],
        borderColor: "#FF9800",
        backgroundColor: "rgba(255, 152, 0, 0.2)",
        tension: 0.4,
        borderDash: [5, 5],
      },
    ],
  };
  
  const options = {
    plugins: {
      legend: {
        position: "bottom" as const, // Moves legend below the chart
      },
    },
  };
  return <Line data={data} options={options} />;
};

export default ForecastChart;
