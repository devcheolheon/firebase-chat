import React, { useEffect, useRef } from "react";
const GraphChart = ({ graphFunc, data }) => {
  const divRef = useRef();
  const updateRef = useRef();

  useEffect(() => {
    updateRef.current = graphFunc(divRef.current, data);
  }, []);

  useEffect(() => {
    if (updateRef.current) updateRef.current(data);
  }, [data]);

  return <div ref={divRef}></div>;
};

export default GraphChart;
