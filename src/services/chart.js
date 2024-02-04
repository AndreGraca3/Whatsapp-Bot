const QuickChart = require("quickchart-js");

module.exports = {
  generateBarChart(title, users, dataSets) {
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
        labels: users,
        datasets: Object.entries(dataSets).map(([label, data]) => ({
          label: label,
          data: users.reduce((result, user) => {
            const count = data[user];
            if (count) result.push(count);
            return result;
          }, []),
        })),
      },
    });
    return chart.getUrl();
  },
};
