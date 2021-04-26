import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const Loading = () => {
  const classes = useStyles();
  return (
    <div class={classes.root}>
      <CircularProgress />
    </div>
  );
};

export default Loading;
