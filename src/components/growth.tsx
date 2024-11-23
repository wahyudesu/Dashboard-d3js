import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ProductData } from '../types';

interface GrowthChartProps {
  data: ProductData;
  isDark: boolean;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ data, isDark }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.labels)
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, Math.max(...data.growth) * 1.2])
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
      .attr("class", isDark ? "text-gray-300" : "text-gray-600")
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + "%"))
      .attr("class", isDark ? "text-gray-300" : "text-gray-600");

    // Add bars with animation
    g.selectAll(".bar")
      .data(data.growth)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (_, i) => x(data.labels[i]) || 0)
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", (d) => {
        if (d > 20) return "#10B981";
        if (d > 10) return "#3B82F6";
        return "#F59E0B";
      })
      .attr("rx", 4)
      .transition()
      .duration(1000)
      .attr("y", d => y(d))
      .attr("height", d => height - y(d));

    // Add value labels on top of bars
    g.selectAll(".label")
      .data(data.growth)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (_, i) => (x(data.labels[i]) || 0) + x.bandwidth() / 2)
      .attr("y", d => y(d) - 5)
      .attr("text-anchor", "middle")
      .style("fill", isDark ? "#E5E7EB" : "#374151")
      .style("font-size", "12px")
      .style("opacity", 0)
      .text(d => d + "%")
      .transition()
      .delay(1000)
      .duration(500)
      .style("opacity", 1);

  }, [data, isDark]);

  return (
    <svg
      ref={svgRef}
      width="600"
      height="320"
      className="w-full h-auto"
    />
  );
};