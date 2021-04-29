import React, { useEffect, useRef } from "react";
const GraphChart = ({ graphFunc, data }) => {
  const divRef = useRef();

  useEffect(() => {
    if (data) graphFunc(divRef.current, data);
    return () => {
      if (divRef.current) {
        divRef.current.innerHTML = "";
      }
    };
  }, [data]);

  console.log(data);
  return <div ref={divRef}></div>;
};

export default GraphChart;
