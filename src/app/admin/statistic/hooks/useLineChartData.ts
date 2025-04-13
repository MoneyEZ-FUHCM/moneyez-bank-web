import { useMemo } from "react";
import dayjs from "dayjs";
import { MAIN_CHART_DATA } from "../statistic.constant";
import { useWeekDays } from "./useWeekDays";

const useLineChartData = () => {
  const { labels, dayNames } = useWeekDays();

  return useMemo(() => {
    return {
      labels: dayNames,
      datasets: [
        {
          label: "Đơn hàng",
          data: labels.map((date: string) => {
            return (
              MAIN_CHART_DATA.find(
                (data) => dayjs(data.date).format("DD/MM/YYYY") === date,
              )?.orderCount || 0
            );
          }),
          type: "bar",
          borderColor: "rgba(0, 143, 251, 0.85);",
          pointBorderWidth: 1,
          pointBackgroundColor: "#1b8bd6",
          pointBorderColor: "#36A2EB",
          backgroundColor: "rgba(0, 143, 251, 1)",
          yAxisID: "y",
          order: 2,
          barThickness: 30,
        },
        {
          label: "Doanh thu",
          data: labels.map((date: string) => {
            return (
              MAIN_CHART_DATA.find(
                (data) => dayjs(data.date).format("DD/MM/YYYY") === date,
              )?.revenue || 0
            );
          }),
          borderColor: "rgb(0, 227, 150)",
          pointBorderWidth: 1,
          pointBackgroundColor: "rgb(0, 227, 150)",
          pointBorderColor: "#FFFFFF",
          backgroundColor: "rgb(0, 227, 150)",
          yAxisID: "y1",
          order: 1,
        },
      ],
    };
  }, [labels, dayNames]);
};

export { useLineChartData };
