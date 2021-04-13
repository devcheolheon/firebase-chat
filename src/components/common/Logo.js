import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.backgroundColor,
  },
}));

const Logo = () => (
  <Avatar
    className={`${classes.avatar} ${classes.large}`}
    src={logo}
    variant="square"
  />
);

exports Logo;
