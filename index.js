const data = [
  {
    name: "미국",
    value: 40,
  },
  {
    name: "한국",
    value: 20,
  },
  {
    name: "캐나다",
    value: 30,
  },
  {
    name: "일본",
    value: 10,
  },
];

const size = {
  width: 260,
  height: 260,
  thickness: 40,
  duration: 750,
  get radius() {
    return Math.min(this.width, this.height) / 2;
  },
};

const color = d3.scaleOrdinal(d3.schemeCategory10);

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("class", "pie")
  .attr("width", size.width)
  .attr("height", size.height);

const g = svg
  .append("g")
  .attr("transform", `translate(${size.width / 2} ${size.height / 2})`);

const arc = d3
  .arc()
  .innerRadius(size.radius - size.thickness)
  .outerRadius(size.radius);

const pie = d3.pie().value(function (d) {
  console.log("pie value:", d);
  return d.value;
});

const path = g
  .selectAll("path")
  .data(pie(data))
  .enter()
  .append("g")
  .on("mouseover", function (e, d) {
    const currentTarget = e.currentTarget;
    const g = d3
      .select(currentTarget)
      .style("cursor", "pointer")
      .style("opacity", 0.8)
      .append("g")
      .attr("class", "text-group");

    console.log(d);
    const name = g
      .append("text")
      .attr("class", "name-text")
      .text(`${d.data.name}`)
      .attr("text-anchor", "middle")
      .attr("dy", "-16px");

    const percent = g
      .append("text")
      .attr("class", "value-text")
      .attr("text-anchor", "middle")
      .attr("dy", "16px")
      .style("font-size", "26px")
      .style("font-weight", "500")
      .transition()
      .ease(d3.easeLinear)
      .duration(250)
      .tween("text", function (d) {
        const that = this;
        const i = d3.interpolate(0, d.data.value);
        return (t) => {
          d3.select(that).text(i(t).toFixed(0));
        };
      });
  })
  .on("mouseout", function (e, d) {
    const currentTarget = e.currentTarget;
    d3.select(currentTarget)
      .style("cursor", "none")
      .style("opacity", 1)
      .select(".text-group")
      .remove();
  })
  .append("path")
  .attr("d", arc)
  .style("fill", (_, i) => color(i));

console.log(arc);
