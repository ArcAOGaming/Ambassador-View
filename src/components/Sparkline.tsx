import React, { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist-min";
import { type WeeklyPoint } from "../hooks/useCreditNotices";
import { formatAmountFromBaseUnits, formatDateShort } from "../utils/format";

interface Props {
  data: WeeklyPoint[];
  height?: number;
}

const Sparkline: React.FC<Props> = ({ data, height }) => {
  const plotRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(280);

  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth <= 480) {
        setChartHeight(200);
      } else if (window.innerWidth <= 768) {
        setChartHeight(240);
      } else {
        setChartHeight(280);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const plotElement = plotRef.current;
    if (!plotElement) return;

    const dates = data.map((p) => new Date(p.weekStartMs));
    const amounts = data.map((p) => Number(p.amountBaseUnits) / 1e12); // Convert to readable units

    const isMobile = window.innerWidth <= 768;

    const trace = {
      x: dates,
      y: amounts,
      type: "scatter" as const,
      mode: "lines" as const,
      fill: "tozeroy" as const,
      line: {
        color: "rgba(59, 130, 246, 1)",
        width: isMobile ? 2.5 : 3,
        shape: "spline" as const,
      },
      fillcolor: "rgba(59, 130, 246, 0.15)",
      hovertemplate: "<b>%{text}</b><br>%{customdata}<extra></extra>",
      text: dates.map((d) => formatDateShort(d.getTime())),
      customdata: data.map((p) =>
        formatAmountFromBaseUnits(p.amountBaseUnits.toString())
      ),
    };

    const layout = {
      margin: isMobile
        ? { t: 15, r: 15, b: 40, l: 50 }
        : { t: 20, r: 20, b: 50, l: 60 },
      height: height || chartHeight,
      plot_bgcolor: "rgba(0, 0, 0, 0)",
      paper_bgcolor: "rgba(0, 0, 0, 0)",
      font: {
        color: "rgba(255, 255, 255, 0.7)",
        family: "Inter, system-ui, sans-serif",
      },
      xaxis: {
        gridcolor: "rgba(255, 255, 255, 0.05)",
        showgrid: true,
        zeroline: false,
        showline: false,
        tickfont: { size: isMobile ? 9 : 11 },
      },
      yaxis: {
        gridcolor: "rgba(255, 255, 255, 0.05)",
        showgrid: true,
        zeroline: false,
        showline: false,
        tickfont: { size: isMobile ? 9 : 11 },
        title: {
          text: "Amount",
          font: { size: isMobile ? 10 : 12 },
        },
      },
      hovermode: "x unified" as const,
      hoverlabel: {
        bgcolor: "rgba(20, 20, 30, 0.95)",
        bordercolor: "rgba(59, 130, 246, 0.5)",
        font: {
          color: "rgba(255, 255, 255, 0.95)",
          family: "Inter, system-ui, sans-serif",
        },
      },
    };

    const config = {
      responsive: true,
      displayModeBar: false,
      displaylogo: false,
    };

    Plotly.newPlot(plotElement, [trace], layout, config);

    // Cleanup
    return () => {
      Plotly.purge(plotElement);
    };
  }, [data, height, chartHeight]);

  return (
    <div className="card sparkline-card">
      <div className="sparkline-title">📈 Weekly Income</div>
      <div className="sparkline-container">
        <div ref={plotRef} />
      </div>
    </div>
  );
};

export default Sparkline;
