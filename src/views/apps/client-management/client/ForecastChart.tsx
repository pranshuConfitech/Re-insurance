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
                label: "Client Revenue",
                data: [4500, 3500, 2500, 3280, 2390, 2890, 3990, 2990, 3990, 4500, 4000, 5000],
                borderColor: "#2196F3",
                backgroundColor: "rgba(33, 150, 243, 0.2)",
                tension: 0.4,
            },
            {
                label: "Forecast",
                data: [4900, 3700, 2900, 3400, 2600, 3000, 3700, 3300, 4200, 4700, 4300, 5200],
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
                position: "bottom" as const,
            },
        },
    };
    return <Line data={data} options={options} />;
};

export default ForecastChart; 
