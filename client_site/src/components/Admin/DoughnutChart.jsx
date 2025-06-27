import { useRef, useEffect } from "react";
import PropTypes from "prop-types"; // ✅ Import PropTypes
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

function DoughnutChart({ data, labels }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

   
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
            backgroundColor: ["#4CAF50", "#FFC107", "#E91E63"],
            borderColor: "#ffffff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            enabled: true,
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


DoughnutChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired, 
  labels: PropTypes.arrayOf(PropTypes.string).isRequired, 
};

export default DoughnutChart;