const pieData = [
  {
    name: "Running",
    value: 40,
    color: "#18FFFF",
  },
  {
    name: "Paused",
    value: 26,
    color: "#0288D1",
  },
  {
    name: "Stopped",
    value: 7,
    color: "#BF360C",
  },
  {
    name: "Failed",
    value: 13,
    color: "#F4511E",
  },
  {
    name: "Unknown",
    value: 19,
    color: "#F9A825",
  },
];

bakeDonut(pieData);

function bakeDonut(d) {
  const svg = d3.select("#container svg");
  const data = d.sort((a, b) => b["value"] - a["value"]);
  const color = d3.scaleOrdinal(data.map((k) => k.color));
  const size = {
    width: svg.node().clientWidth,
    height: svg.node().clientHeight,
    thickness: 40,
    get radius() {
      return Math.min(this.width, this.height) / 2;
    },
  };
  const max = d3.max(data, (maxData) => maxData.value);
  let activeSegment = null;

  svg
    .attr("width", `${size.width}`)
    .attr("height", `${size.height}`)
    .attr(
      "viewBox",
      `0 0 ${size.width + size.thickness} ${size.height + size.thickness}`
    );

  const g = svg
    .append("g")
    .attr(
      "transform",
      `translate(${size.radius / 2 + 80}, ${
        size.height / 2 + size.thickness / 2
      })`
    );

  const arc = d3
    .arc()
    .innerRadius(size.radius / 2 - size.thickness)
    .outerRadius(size.radius / 2);

  const arcHover = d3
    .arc()
    .innerRadius(size.radius / 2 - size.thickness - 8)
    .outerRadius(size.radius / 2 + 8);

  const pie = d3
    .pie()
    .value((pieData) => {
      return pieData.value;
    })
    .sort(null);

  const path = g
    .selectAll("path")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "data-group")
    .each((d, i, groups) => {
      const group = d3.select(groups[i]);

      group
        .append("text")
        .text(`${d.data.value}`)
        .attr("class", "data-text data-text__value")
        .attr("text-anchor", "middle")
        .attr("dy", "1rem");

      group
        .append("text")
        .text(`${d.data.name}`)
        .attr("class", "data-text data-text__name")
        .attr("text-anchor", "middle")
        .attr("dy", "3.5rem");

      if (d.data.value === max) {
        const textVal = group
          .select(".data-text__value")
          .classed("data-text--show", true);

        const textName = group
          .select(".data-text__name")
          .classed("data-text--show", true);
      }
    })
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d))
    .attr("class", "data-path")
    .on("mouseover", (e) => {
      const path = e.currentTarget;
      const group = path.parentNode;

      if (path !== activeSegment) {
        activeSegment = path;

        const texts = d3
          .selectAll(".data-text")
          .classed("data-text--show", false);

        const paths = d3
          .selectAll(".data-path")
          .transition()
          .duration(250)
          .attr("d", arc);

        d3.select(path).transition().duration(250).attr("d", arcHover);

        const text = d3
          .select(group)
          .select(".data-text__value")
          .classed("data-text--show", true);

        const name = d3
          .select(group)
          .select(".data-text__name")
          .classed("data-text--show", true);
      }
    })
    .each((d, i, paths) => {
      const path = paths[i];
      if (d.data.value === max) {
        const maxArc = d3.select(path).attr("d", arcHover);
        activeSegment = path;
      }
    });

  const legendRectSize = 15;
  const legendSpacing = 10;

  const legend = svg
    .selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (legendData, i) => {
      const height = legendRectSize + legendSpacing;
      const offset = legendRectSize * color.domain().length;
      const x = size.height + size.thickness - 160;
      const y = i * height + (size.height - offset) / 2;
      return `translate(${x}, ${y})`;
    });

  legend
    .append("circle")
    .attr("r", legendRectSize / 2)
    .style("fill", color);

  legend
    .append("text")
    .attr("x", legendSpacing)
    .attr("y", legendRectSize - legendSpacing)
    .text((d) => d.data.name);
}
