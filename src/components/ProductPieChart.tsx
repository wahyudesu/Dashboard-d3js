import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ProductData } from '../types';

interface ProductPieChartProps {
  data: ProductData;
  isDark: boolean;
}

export const ProductPieChart: React.FC<ProductPieChartProps> = ({ data, isDark }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; content: string } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.labels)
      .range(d3.schemeSet2);

    const pie = d3.pie<number>()
      .sort(null)
      .value(d => d);

    const path = d3.arc<d3.PieArcDatum<number>>()
      .outerRadius(radius - 10)
      .innerRadius(radius * 0.5);

    const labelArc = d3.arc<d3.PieArcDatum<number>>()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    const arcs = g.selectAll(".arc")
      .data(pie(data.sales))
      .enter()
      .append("g")
      .attr("class", "arc");

    // Add slices with animation and interactivity
    arcs.append("path")
      .attr("d", path)
      .attr("fill", (_, i) => color(data.labels[i]) as string)
      .style("filter", "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))")
      .style("cursor", "pointer")
      .transition()
      .duration(1000)
      .attrTween("d", function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return path(interpolate(t))!;
        };
      })
      .on("end", function() {
        d3.select(this)
          .on("mouseover", function(event, d: d3.PieArcDatum<number>) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("transform", function() {
                const [x, y] = path.centroid(d);
                return `translate(${x * 0.1},${y * 0.1})`;
              });

            const percentage = ((d.value || 0) / d3.sum(data.sales) * 100).toFixed(1);
            const label = data.labels[d.index];
            const value = data.sales[d.index];

            setTooltipData({
              x: event.pageX,
              y: event.pageY,
              content: `${label}: ${value} units (${percentage}%)`
            });
          })
          .on("mouseout", function() {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("transform", "translate(0,0)");
            
            setTooltipData(null);
          });
      });

    // Add labels with animation
    arcs.append("text")
      .attr("transform", d => `translate(${labelArc.centroid(d)})`)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font-size", "13px")
      .style("fill", isDark ? "#E5E7EB" : "#374151")
      .style("font-weight", "bold") // Make the text bold
      .style("opacity", 0)
      .text((_, i) => data.labels[i])
      .transition()
      .delay(1000)
      .duration(500)
      .style("opacity", 1);

  }, [data, isDark]);

  return (
    <div className="relative font">
      <svg
        ref={svgRef}
        width="100"
        height="100"
        className="w-full h-auto"
      />
      {tooltipData && (
        <div
          className="absolute z-10 px-3 py-2 text-xl font-extrabold text-white bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700"
          style={{
            left: tooltipData.x,
            top: tooltipData.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {tooltipData.content}
        </div>
      )}
    </div>
  );
};