import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data, options }) => {
  if (!data) return;
  return (
    <div className="mt-2 w-[350px] h-72">
      <Bar options={options} data={data} />
    </div>
  );
};

BarChart.defaultProps = {
  // options: {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: {
  //       position: "top",
  //     },
  //     title: {
  //       display: false,
  //       text: "Chart.js Bar Chart",
  //     },
  //   },
  //   scales: {
  //     x: {
  //       gridLines: {
  //         display: false,
  //       },
  //     },
  //     y: {
  //       gridLines: {
  //         display: false,
  //       },
  //     },
  //   },
  // },
};

export default BarChart;
