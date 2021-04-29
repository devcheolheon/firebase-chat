import React, { useEffect, useRef } from "react";
const GraphChart = ({ graphFunc, data }) => {
  const divRef = useRef();

  useEffect(() => {
    if (data) graphFunc(divRef.current, data);
    return () => (divRef.current.innerHTML = "");
  }, [data]);

  return <div ref={divRef}></div>;
};

export default GraphChart;
