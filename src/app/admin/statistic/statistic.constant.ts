export const REVENUE_DATA = [
  { storeName: "Bảo", revenue: 20000000 },
  { storeName: "Đức", revenue: 15000000 },
  { storeName: "Huyền", revenue: 10000000 },
  { storeName: "Trí", revenue: 5000000 },
  { storeName: "Linh", revenue: 5000000 },
];

export const DASHBOARD_DATA = {
  revenue: 1500000,
  numOfProducts: 123,
  numOfStores: 5,
  numOfOrders: 5,
  numOfUsers: 5,
  lastUpdated: "2025-02-08T14:00:00Z",
};

export const MAIN_CHART_DATA = [
  { date: "2025-02-01", orderCount: 10, revenue: 100 },
  { date: "2025-02-02", orderCount: 15, revenue: 150 },
  { date: "2025-02-03", orderCount: 20, revenue: 200 },
  { date: "2025-02-04", orderCount: 18, revenue: 180 },
  { date: "2025-02-05", orderCount: 22, revenue: 220 },
  { date: "2025-02-06", orderCount: 19, revenue: 190 },
  { date: "2025-02-07", orderCount: 25, revenue: 250 },
];

export const lineOptions = {
  plugins: {
    datalabels: {
      display: false,
    },
  },
  elements: {
    point: {
      radius: 2,
      backgroundColor: "currentColor",
      hoverRadius: 4,
      hitRadius: 6,
    },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      grid: {
        drawOnChartArea: false,
      },
    },
  },
  responsive: true,
};

export const CHART_COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];
