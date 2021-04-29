import React, { useEffect, useRef } from "react";
const GraphChart = ({ graphFunc }) => {
  const divRef = useRef();

  useEffect(() => {
    graphFunc(divRef.current);
  }, []);

  return <div ref={divRef}></div>;
};

export default GraphChart;
