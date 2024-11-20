import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SalesData } from '../types';

interface SalesChartProps {
  data: SalesData;
  isDark: boolean;
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, isDark }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; content: string } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
      .domain(data.labels)
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data.monthly.revenue) || 0])
      .range([height, 0]);

    // Add grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat(() => ""));

    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .attr("class", isDark ? "text-gray-600" : "text-gray-600")
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    g.append("g")
      .call(d3.axisLeft(y))
      .attr("class", isDark ? "text-gray-600" : "text-gray-600");

    // Add lines
    const line = d3.line<number>()
      .x((_, i) => x(data.labels[i]) || 0)
      .y(d => y(d))
      .curve(d3.curveMonotoneX);

    const colors = {
      revenue: "#60a5fa",
      sales: "#34d399",
      profit: "#f87171"
    };

    // Add interactive overlay
    const focus = g.append("g")
      .style("display", "none");

    focus.append("line")
      .attr("class", "x")
      .style("stroke", isDark ? "#374151" : "#E5E7EB")
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.5)
      .attr("y1", 0)
      .attr("y2", height);

    focus.append("line")
      .attr("class", "y")
      .style("stroke", isDark ? "#374151" : "#E5E7EB")
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.5)
      .attr("x1", 0)
      .attr("x2", width);

    const overlay = g.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all");

    // Add lines with animation
    Object.entries(data.monthly).forEach(([key, values]) => {
      const path = g.append("path")
        .datum(values)
        .attr("fill", "none")
        .attr("stroke", colors[key as keyof typeof colors])
        .attr("stroke-width", 2)
        .attr("d", line);

      const totalLength = path.node()?.getTotalLength() || 0;
      
      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0);
    });

    // Add dots with enhanced interactivity
    const addDots = (values: number[], type: 'revenue' | 'sales' | 'profit') => {
      g.selectAll(`.dot-${type}`)
        .data(values)
        .enter()
        .append("circle")
        .attr("class", `dot-${type}`)
        .attr("cx", (_, i) => x(data.labels[i]) || 0)
        .attr("cy", d => y(d))
        .attr("r", 4)
        .attr("fill", colors[type])
        .style("fill", isDark ? "#E5E7EB" : "#374151")
        .style("filter", "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))")
        .on("mouseover", function(event, d) {
          const [cx, cy] = d3.pointer(event);
          
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 8);

          focus.style("display", null);
          
          const xPos = x(data.labels[values.indexOf(d)]) || 0;
          focus.select(".x")
            .attr("transform", `translate(${xPos},0)`);
          focus.select(".y")
            .attr("transform", `translate(0,${y(d)})`);

          setTooltipData({
            x: event.pageX,
            y: event.pageY,
            content: `${type.charAt(0).toUpperCase() + type.slice(1)}: ${type === 'sales' ? d.toLocaleString() + ' units' : '$' + d.toLocaleString()}`
          });
        })
        .on("mouseout", function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 4);
          
          focus.style("display", "none");
          setTooltipData(null);
        });
    };

    addDots(data.monthly.revenue, 'revenue');
    addDots(data.monthly.sales, 'sales');
    addDots(data.monthly.profit, 'profit');

    // Add legend to the right side of the chart
    const legend = g.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width + 60}, 0)`); // Adjusted position to the right

    const legendItems = [
      { type: 'revenue', label: 'Revenue' },
      { type: 'sales', label: 'Sales' },
      { type: 'profit', label: 'Profit' }
    ];

    legendItems.forEach((item, i) => {
      const legendItem = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendItem.append("circle")
        .attr("r", 4)
        .attr("fill", colors[item.type as keyof typeof colors]);

      legendItem.append("text")
        .attr("x", 10)
        .attr("y", 4)
        .style("fill", isDark ? "#E5E7EB" : "#374151")
        .style("font-size", "14px")
        .text(item.label);
    });

  }, [data, isDark]);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width="100"
        height="45"
        className="w-full h-auto"
      />
      {tooltipData && (
        <div
          className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700"
          style={{
            left: tooltipData.x + 10,
            top: tooltipData.y - 10,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {tooltipData.content}
        </div>
      )}
    </div>
  );
};