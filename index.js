const svg = d3.select("#chart svg");
const width = svg.node().clientWidth;
const height = svg.node().clientHeight;
const radius = Math.min(width, height) / 2;

const g = svg
  .append("g")
  .attr("transform", `translate(${width / 2}, -${height / 2})`);

const color = d3
  .scaleSequential()
  .domain([1, 10])
  .interpolator(d3.interpolateRainbow);

const data = [20, 80];
const pie = d3
  .pie()
  .value((d) => {
    return d;
  })
  .sort((a, b) => b - a);

// sort((a,b) => a - b): 시계 방향
// sort((a,b) => b - a): 반 시계 방향

const arc = d3
  .arc()
  .innerRadius(radius - 30)
  .outerRadius(radius);

const arcs = g
  .selectAll("arc")
  .data(pie(data))
  .enter()
  .append("g")
  .attr("class", "arc");

arcs
  .append("path")
  .attr("fill", (_, i) => color(i))
  .transition()
  .delay((_, i) => i * 600)
  .duration(600)
  .attrTween("d", (d) => {
    const interpolate = d3.interpolate(d.endAngle, d.startAngle);
    // const interpolate = d3.interpolate(d.startAngle + 0.1, d.endAngle); // 시계 방향 애니메이션
    return (t) => {
      d.startAngle = interpolate(t);
      // d.endAngle = interpolate(t); // 시계 방향 애니메이션
      return arc(d);
    };
  });
