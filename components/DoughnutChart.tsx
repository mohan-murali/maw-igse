import { Chart } from "primereact/chart";
import { useState } from "react";

interface DoughnutChartProps {
  labels: any;
  data: any;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  labels,
  data,
}) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const [lightOptions] = useState({
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
  });

  return (
    <div className="flex justify-content-center">
      <Chart type="doughnut" data={chartData} options={lightOptions} />
    </div>
  );
};
