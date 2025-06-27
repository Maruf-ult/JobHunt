import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from "chart.js";

// ✅ Register required components for Bar Chart
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

function BarChart({ data, labels }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const chartData = Array.isArray(data) ? data : [0, 0, 0];


    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Job Postings Per Category",
            data: chartData,
            backgroundColor: ["#4CAF50", "#FFC107", "#E91E63", "#03A9F4", "#8E44AD"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: "Job Postings Per Category",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labels]);

  return <canvas ref={chartRef} className="w-full h-64" />;
}

BarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default BarChart;