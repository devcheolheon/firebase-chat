import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../../logo.png";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.backgroundColor,
  },
}));

const Logo = () => {
  const classes = useStyles();

  return (
    <Avatar
      className={`${classes.avatar} ${classes.large}`}
      src={logo}
      variant="square"
    />
  );
};

export default Logo;
