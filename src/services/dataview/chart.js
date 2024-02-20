const QuickChart = require("quickchart-js");

module.exports = {
  generateBarChart(title, userIds, dataSets) {
    const chart = new QuickChart();
    chart.setConfig({
      type: "bar",
      options: {
        title: {
          display: true,
          text: title,
        },
      },
      data: {
        labels: userIds,
        datasets: Object.entries(dataSets).map(([label, data]) => ({
          label: label,
          data: userIds.map((userId) => data[userId]),
        })),
      },
    });
    return chart.getUrl();
  },
};
