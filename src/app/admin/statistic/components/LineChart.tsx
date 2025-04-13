import Chart, { CategoryScale, ChartData } from "chart.js/auto";
import dayjs from "dayjs";
import { Line } from "react-chartjs-2";

Chart.register(CategoryScale);

interface LineChartProps {
  chartData: ChartData<"line"> | any;
  options?: object;
}

const LineChart = ({ chartData, options }: LineChartProps) => {
  const currentDate = dayjs();
  const startOfWeek =
    currentDate.day() === 0
      ? currentDate.day(-6).startOf("day")
      : currentDate.day(1).startOf("day"); // start week (Monday)
  const endOfWeek = startOfWeek.add(6, "days").endOf("day"); // end week (Sunday)

  return (
    <section className="w-full p-5">
      <div className="mb-10">
        <p className="text-xl font-bold">
          Đơn hàng và doanh thu từ ngày{" "}
          {`${startOfWeek.format("DD/MM/YYYY")} đến ${endOfWeek.format("DD/MM/YYYY")}`}
        </p>
      </div>
      <Line data={chartData} options={options} />
    </section>
  );
};

export { LineChart };
