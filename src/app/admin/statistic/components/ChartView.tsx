"use client";

import { useDonutChartData } from "../hooks/useDonutChartData";
import { useLineChartData } from "../hooks/useLineChartData";
import { DASHBOARD_DATA, lineOptions } from "../statistic.constant";
import { DonutChart } from "./DonutChart";
import { LineChart } from "./LineChart";
import { TotalField } from "./TotalField";

const ChartView = () => {
  const lineData = useLineChartData();
  const donutData = useDonutChartData();

  return (
    <section>
      <div className="p-5">
        <TotalField data={DASHBOARD_DATA} />
      </div>
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-3">
        <div className="col-span-1 rounded-xl bg-[#fff] shadow-md sm:col-span-2">
          <LineChart chartData={lineData} options={lineOptions} />
        </div>

        <div className="col-span-1 flex flex-col rounded-xl bg-[#fff] sm:col-span-1">
          <div className="h-full flex-1">
            <DonutChart chartData={donutData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export { ChartView };
