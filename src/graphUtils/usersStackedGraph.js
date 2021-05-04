import * as d3 from "d3";

const height = 300;
const width = 400;
const margin = { top: 0, right: 20, bottom: 10, left: 20 };

const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

function makeIdFromD(d, i) {
  return "id" + i + d[2] + Math.floor(d[0] * 100) + Math.floor(d[1] * 100);
}

function textToOriginalState(text) {
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

function hoverSelectedText(d, i) {
  svg
    .selectAll("." + makeIdFromD(d, i))
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

let update = () => {};
export function usersStackedGraph(target, data) {
  if (target.innerHTML) return update;
  // invalidation.then(() => simulation.stop());

  const n = data[0].length;
  const m = data.length;
  const columns = data.map((data) => data.name);

  const xz = d3.range(m);
  const yz = d3.transpose(data);
  const y01z = d3
    .stack()
    .keys(d3.range(n))
    .value((obj, key) => {
      return obj[key][0];
    })(data) // stacked yz
    .map((data) => data.map(([y0, y1]) => [y0, y1]));

  d3.range(m).forEach((i) => {
    d3.range(n).forEach((j) => {
      y01z[j][i].push(data[i][j][1]);
      y01z[j][i].id = data[i].id;
    });
  });

  let y1Max = d3.max(y01z, (y) => d3.max(y, (d) => d[1]));

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

  const xAxis = (g, x) =>
    g
      .attr("transform", `translate(0,${height - margin.bottom - 30})`)
      .call(d3.axisBottom(x))
      .call((g) =>
        (g.selection ? g.selection() : g).select(".domain").remove()
      );

  let bars = svg
    .selectAll("g.bars")
    .data(y01z, (d) => d.id)
    .join("g")
    .attr("class", "bars");

  let texts = svg
    .selectAll("g.captions")
    .data(y01z, (d) => d.id)
    .join("g")
    .attr("class", "captions");

  let rect = bars
    .attr("fill", (d, i) => z(i))
    .selectAll("rect")
    .data(
      (d) => d,
      (d) => d.id + d.toString()
    )
    .join("rect")
    .attr("class", "data")
    .attr("data-index", (d, i) => i)
    .attr("x", (d, i) => x(columns[i]))
    .attr("y", height - margin.bottom - 30)
    .attr("width", x.bandwidth())
    .attr("height", 0);

  let text = texts
    .selectAll("text")
    .data(
      (d) => d,
      (d) => d.id + d.toString()
    )
    .join("text")
    .text((d) => d[2])
    .attr("x", (d, i) => x(columns[i]) + 5)
    .attr("y", height - margin.bottom + 30)
    .attr("font-family", "sans-serif")
    .attr("font-size", "5px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");

  const gx = svg.append("g").call(xAxis, x);

  svg.on("mouseleave", () => {
    textToOriginalState(text);
  });

  update = (data) => {
    const n = data[0].length;
    const m = data.length;
    const columns = data.map((data) => data.name);

    const xz = d3.range(m);
    const yz = d3.transpose(data);
    const y01z = d3
      .stack()
      .keys(d3.range(n))
      .value((obj, key) => {
        return obj[key][0];
      })(data) // stacked yz
      .map((data) => data.map(([y0, y1]) => [y0, y1]));

    d3.range(m).forEach((i) => {
      d3.range(n).forEach((j) => {
        y01z[j][i].push(data[i][j][1]);
        y01z[j][i].id = data[i].id;
      });
    });

    const t = svg.transition().duration(750);

    gx.transition(t).call(xAxis, x.domain(columns));

    y1Max = d3.max(y01z, (y) => d3.max(y, (d) => d[1]));

    y.domain([0, y1Max]);

    bars = bars
      .data(y01z, (d) => d.id)
      .join(
        (enter) => enter.append("g").attr("class", "bars"),
        (update) => update,
        (exit) => exit.remove()
      );

    texts = texts
      .data(y01z, (d) => d.id)
      .join(
        (enter) => enter.append("g").attr("class", "captions"),
        (update) => update,
        (exit) => exit.remove()
      );

    rect = bars
      .attr("fill", (d, i) => z(i))
      .selectAll("rect")
      .data(
        (d) => d,
        (d) => d.id + d.toString()
      )
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("class", "data")
            .attr("data-index", (d, i) => i)
            .attr("x", (d, i) => x(columns[i]))
            .attr("y", height - margin.bottom - 30)
            .attr("width", x.bandwidth())
            .attr("height", 0),
        (update) => update,
        (exit) => exit.remove()
      );

    text = texts
      .selectAll("text")
      .data(
        (d) => d,
        (d) => d.id + d.toString()
      )
      .join(
        (enter) =>
          enter
            .append("text")
            .text((d) => d[2])
            .attr("x", (d, i) => x(columns[i]) + 5)
            .attr("y", height - margin.bottom + 30)
            .attr("font-family", "sans-serif")
            .attr("font-size", "5px")
            .attr("fill", "black")
            .attr("text-anchor", "middle"),
        (update) => update,
        (exit) => exit.remove()
      );

    rect
      .transition()
      .duration(500)
      .delay((d, i) => i * 20)
      .attr("data-index", (d, i) => i)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .transition()
      .attr("x", (d, i) => x(columns[i]))
      .attr("width", x.bandwidth());

    rect
      .data((d) => d)
      .on("mouseover", function (event, d) {
        const i = d3.select(this).attr("data-index");
        textToOriginalState(text);
        hoverSelectedText(d, i);
      });

    text
      .transition()
      .duration(500)
      .delay((d, i) => i * 20)
      .attr("y", (d) => y(d[0]) - y(d[1]) + y(d[1]) - 2)
      .attr("oy", (d) => y(d[0]) - y(d[1]) + y(d[1]) - 2)
      .transition()
      .attr("x", (d, i) => x(columns[i]) + 5)
      .attr("ox", (d, i) => x(columns[i]) + 5)
      .attr("width", x.bandwidth())
      .attr("class", (d, i) => makeIdFromD(d, i));
  };

  target.appendChild(svg.node());
  return update;
}
