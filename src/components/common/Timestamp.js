import { ScreenLockLandscapeRounded } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

function dateToTimestring(date) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;

  let target = new Date(date * 1000);
  let now = new Date();
  let diff = now - target;

  if (diff <= 100 * second) {
    return `${Math.floor(diff / second)} 초전`;
  }

  if (diff <= 1 * hour) {
    return `${Math.floor(diff / minute)} 분전`;
  }

  return `${now.getFullYear()}.${now.getMonth()}.${now.getDay()} ${now.getHours()}:${now.getMinutes()}`;
}

export const Timestamp = ({ date }) => {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    setTimeString(dateToTimestring(date));

    const clear = setInterval(() => {
      setTimeString(dateToTimestring(date));
    }, 5000);

    return () => clearInterval(clear);
  }, [date]);

  return <span>{timeString}</span>;
};
