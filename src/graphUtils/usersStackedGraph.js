import { MarkunreadOutlined } from "@material-ui/icons";
import * as d3 from "d3";

const height = 300;
const width = 400;
const margin = { top: 0, right: 20, bottom: 10, left: 20 };

function bumps(m, index) {
  const values = [];

  // Initialize with uniform random values in [0.1, 0.2).
  for (let i = 0; i < m; ++i) {
    values[i] = 0.1 + 0.1 * Math.random();
  }

  // Add five random bumps.
  for (let j = 0; j < 5; ++j) {
    const x = 1 / (0.1 + Math.random());
    const y = 2 * Math.random() - 0.5;
    const z = 10 / (0.1 + Math.random());
    for (let i = 0; i < m; i++) {
      const w = (i / m - y) * z;
      values[i] += x * Math.exp(-w * w);
    }
  }

  // Ensure all values are positive.
  for (let i = 0; i < m; ++i) {
    values[i] = Math.max(0, values[i]);
  }

  return values.map((v, i) => ["id" + index, v]);
}

export function usersStackedGraph(target) {
  const n = 3;
  const m = 5;

  const xz = d3.range(m);
  const columns = ["A", "B", "C", "D", "E"];
  const yz = d3.range(n).map((_, i) => bumps(m, i));

  const y01z = d3
    .stack()
    .keys(d3.range(n))
    .value((obj, key) => {
      return obj[key][1];
    })(d3.transpose(yz)) // stacked yz
    .map((data) => data.map(([y0, y1]) => [y0, y1]));

  const y01c = d3
    .range(n)
    .map((v, i) => yz[i].map((v, j) => y01z[i][j].push(v[0])));

  const yMax = d3.max(yz, (y) => d3.max(y));
  const y1Max = d3.max(y01z, (y) => d3.max(y, (d) => d[1]));

  const x = d3
    .scaleBand()
    .domain(columns)
    .range([margin.left, width - margin.right])
    .padding(0.08);

  const y = d3
    .scaleLinear()
    .domain([0, y1Max])
    .range([height - margin.bottom - 30, margin.top]);

  const z = d3.scaleSequential(d3.interpolateBlues).domain([-0.5 * n, 1.5 * n]);

  const xAxis = (svg) =>
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom - 30})`)
      .call(d3.axisBottom(x));

  const chart = (() => {
    const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

    const bars = svg
      .selectAll("g.bars")
      .data(y01z)
      .join("g")
      .attr("class", "bars");
    const texts = svg
      .selectAll("g.captions")
      .data(y01z)
      .join("g")
      .attr("class", "captions");

    const rect = bars
      .attr("fill", (d, i) => z(i))
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("class", "data")
      .attr("x", (d, i) => x(columns[i]))
      .attr("y", height - margin.bottom)
      .attr("width", x.bandwidth())
      .attr("height", 0);

    const text = texts
      .selectAll("text")
      .data((d) => d)
      .join("text")
      .text((d) => d[2])
      .attr("font-family", "sans-serif")
      .attr("font-size", "5px")
      .attr("fill", "white")
      .attr("text-anchor", "middle");

    svg.append("g").call(xAxis);

    function makeIdFromD(d) {
      return d[2] + Math.floor(d[0] * 100) + Math.floor(d[1] * 100);
    }

    function textToOriginalState() {
      text
        .attr("font-size", "5px")
        .attr("fill", "black")
        .attr("x", function () {
          return d3.select(this).attr("ox");
        })
        .attr("y", function () {
          return d3.select(this).attr("oy");
        });
    }

    function hoverSelectedText(d) {
      svg
        .selectAll("." + makeIdFromD(d))
        .attr("font-size", "15px")
        .attr("fill", "yellow")
        .attr("x", function (d, i) {
          return +d3.select(this).attr("ox") + 30;
        })
        .attr("y", function (d, i) {
          if (+d3.select(this).attr("oy") - 2 <= margin.bottom + 20) {
            return +d3.select(this).attr("oy") + 20;
          }
          return +d3.select(this).attr("oy") - 2;
        });
    }

    svg.on("mouseleave", () => {
      textToOriginalState();
    });

    function transitionStacked() {
      y.domain([0, y1Max]);

      rect
        .transition()
        .duration(500)
        .delay((d, i) => i * 20)
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => y(d[0]) - y(d[1]))
        .transition()
        .attr("x", (d, i) => x(columns[i]))
        .attr("width", x.bandwidth());

      rect
        .data((d) => d)
        .on("mouseover", (event, d) => {
          textToOriginalState();
          hoverSelectedText(d);
        });

      text
        .attr("x", (d, i) => x(columns[i]) + 5)
        .attr("ox", (d, i) => x(columns[i]) + 5)
        .attr("y", y(0))
        .attr("class", (d) => makeIdFromD(d))
        .attr("width", x.bandwidth())
        .attr("font-family", "sans-serif")
        .attr("font-size", "5px")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .transition()
        .duration(500)
        .delay((d, i) => i * 20)
        .attr("y", (d) => y(d[0]) - y(d[1]) + y(d[1]) - 2)
        .attr("oy", (d) => y(d[0]) - y(d[1]) + y(d[1]) - 2)
        .transition();
    }

    function update(layout) {
      transitionStacked();
    }

    return Object.assign(svg.node(), { update });
  })();

  target.appendChild(chart);
  chart.update();
}
