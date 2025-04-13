import { useMemo } from "react";
import { CHART_COLORS, REVENUE_DATA } from "../statistic.constant";

const useDonutChartData = () => {
  return useMemo(() => {
    return {
      labels: REVENUE_DATA.map((data) => data.storeName),
      datasets: [
        {
          label: "Doanh thu",
          data: REVENUE_DATA.map((data) => data.revenue),
          backgroundColor: CHART_COLORS,
          hoverOffset: 4,
        },
      ],
    };
  }, []);
};

export { useDonutChartData };
