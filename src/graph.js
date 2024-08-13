import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-crosshair";
import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  CategoryScale
);

function generateGraphData(
  numPoints = 100,
  startPrice = 63000,
  volatility = 1000,
  maxVolume = 2000
) {
  const prices = [];
  const volumes = [];
  let currentPrice = startPrice;

  for (let i = 0; i < numPoints; i++) {
    const randomChange = (Math.random() - 0.5) * volatility;
    currentPrice += randomChange;
    currentPrice = Math.max(0, currentPrice);
    prices.push(parseFloat(currentPrice.toFixed(2)));

    const randomVolume = Math.random() * maxVolume;
    volumes.push(Math.floor(randomVolume));
  }

  return { prices, volumes };
}

const PriceChart = () => {
  const [range, setRange] = useState("1W");
  const [graphData, setGraphData] = useState({ prices: [], volumes: [] });

  useEffect(() => {
    const data = generateGraphData();
    setGraphData(data);
  }, []);

  const data = {
    labels: Array.from({ length: 100 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        type: "line",
        label: "Price",
        data: graphData.prices,
        fill: true,
        pointRadius: 0,
        title: {
          display: false,
        },

        borderWidth: 1,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return "rgba(75, 64, 238, .7)";
          }

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "#E8E7FF");
          gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)");

          return gradient;
        },
        borderColor: "#4B40EE",
        tension: 0,
        yAxisID: "y",
      },
      {
        type: "bar",
        title: {
          display: false,
        },
        label: "Volume",
        data: [...graphData.volumes.map((el) => el / 1000), 30],
        backgroundColor: "#E2E4E7",
        borderColor: "#7c4dff",
        yAxisID: "y1",
        barThickness: 2,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
      y1: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div>
      <div className="flex justify-around my-4">
        {["1D", "3D", "1W", "1M", "6M", "1Y", "MAX"].map((r) => (
          <button
            key={r}
            className={`px-4 py-2 rounded ${
              range === r
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>
      <Line
        data={data}
        options={options}
        height={400}
        style={{
          border: 1,
          borderStyle: "solid",
          borderColor: "rgba(153, 153, 153, .2)",
          borderTop: "none",
          padding: 1,
        }}
        width={800}
      />
    </div>
  );
};

export default PriceChart;
