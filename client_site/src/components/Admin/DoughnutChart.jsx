import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js elements once
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

function DoughnutChart({ data, labels }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Destroy existing chart before creating a new one
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const chartData = Array.isArray(data) ? data : [0, 0, 0];

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Job Status Overview",
            data: chartData,
            backgroundColor: [ "#FFC107","#4CAF50", "#E91E63"],
            borderColor: "#ffffff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
          tooltip: { enabled: true },
        },
      },
    });

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labels]);

  return (
    <div className="w-full h-64">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
}

DoughnutChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DoughnutChart;