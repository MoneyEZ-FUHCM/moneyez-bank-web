import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
);

interface BarChartProps {
  title: string;
  chartData: ChartData<"line" | "bar", (number | [number, number] | null)[]>;
  options: any;
}

const BarChart = ({ title, chartData, options }: BarChartProps) => {
  return (
    <section className="w-full p-5">
      <div className="mb-10">
        <p className="text-xl font-bold">{title}</p>
      </div>
      <Chart type="bar" data={chartData} options={options} />
    </section>
  );
};

export { BarChart };
