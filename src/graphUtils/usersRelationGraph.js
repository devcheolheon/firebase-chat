import * as d3 from "d3";

const height = 200;
const width = 300;

const color = (() => {
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return (d) => scale(d.group);
})();

const drag = (simulation) => {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

let svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

let link = svg
  .append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll("line");

let node = svg
  .append("g")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5)
  .selectAll("circle");

let text = svg
  .attr("font-size", "11px")
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .selectAll("text");

let ticked = () => {
  console.log(link, node, text);
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

  text.attr("x", (d) => d.x).attr("y", (d) => d.y + 20);
};

const simulation = d3
  .forceSimulation()
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force(
    "link",
    d3.forceLink().id((d) => d.id)
  )
  .force("x", d3.forceX())
  .force("y", d3.forceY())
  .on("tick", ticked);

export const usersRelationGraph = (target, data) => {
  const update = (data) => {
    if (data.nodes.length == 0 && data.links.length == 0) return;
    const old = new Map(node.data().map((d) => [d.id, d]));
    let nodes = data.nodes.map((d) => Object.assign(old.get(d.id) || {}, d));
    let links = data.links.map((d) => Object.create(d));

    node = node
      .data(nodes, (d) => d.id)
      .join((enter) => enter.append("circle").attr("r", 3).attr("fill", color))
      .call(drag(simulation));

    link = link
      .data(links, (d) => d.source + d.target)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    text = text
      .data(nodes, (d) => d.id)
      .join("text")
      .attr("x", (d) => d.x) // Flipped X
      .attr("y", (d) => d.y + 20) // Flipped Y
      .text((d) => d.name);

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart().tick();
    ticked();
  };

  if (target.innerHTML) return update;
  // invalidation.then(() => simulation.stop());

  target.appendChild(svg.node());
  return update;
};
