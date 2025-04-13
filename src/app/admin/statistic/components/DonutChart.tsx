import { Doughnut } from "react-chartjs-2";
import Chart, { ChartData, CategoryScale } from "chart.js/auto";

Chart.register(CategoryScale);

interface DonutChartProps {
  chartData: ChartData<"doughnut">;
  options?: object;
}

const DonutChart = ({ chartData, options }: DonutChartProps) => {
  return (
    <section className="w-full p-5">
      <div className="mb-10">
        <p className="text-xl font-bold">Loại hũ tiết kiệm được tạo</p>
      </div>
      <Doughnut data={chartData} options={options} />
    </section>
  );
};

export { DonutChart };
