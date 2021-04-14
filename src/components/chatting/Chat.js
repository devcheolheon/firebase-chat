/*
  {
    id: "2",
    uid: "----",
    name: "라이츄",
    content: "bbbb",
    created: "1618378653151",
  }
*/

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "100%",
    paddingLeft: "20px",
    paddingRight: "20px",
  },

  avatar: {
    backgroundColor: blue[500],
    marginLeft: "10px",
  },

  chatHeader: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  myChatHeader: {
    flexDirection: "row",
  },

  chatTitle: {
    display: "inline-block",
    fontSize: "1.3rem",
    marginLeft: "4px",
    color: theme.palette.text.primary,
  },

  chatCreated: {
    fontSize: "0.7rem",
  },

  chatBoxContainer: {
    display: "flex",
    flexDirection: "row-reverse",
    paddingTop: "20px",
  },

  myChatBoxContainer: {
    flexDirection: "row",
  },

  chatBox: {
    marginLeft: "40px",
    marginRight: "40px",
    fontSize: "1.3rem",
    padding: "20px",
    marginTop: "-5px",
    borderRadius: "30px 10px 30px 30px",
    backgroundColor: theme.palette.secondary.light,
    maxWidth: "calc(100% - 120px)",
    wordWrap: "break-word",
  },

  myChatBox: {
    borderRadius: "10px 30px 30px 30px",
    backgroundColor: theme.palette.primary.light,
  },
}));

export default function Chat({ id, uid, name, content, created, isMe }) {
  const classes = useStyles();

  return (
    <div key={id} className={classes.root}>
      <div className={clsx(classes.chatHeader, isMe && classes.myChatHeader)}>
        {!isMe && (
          <Avatar aria-label="user" className={classes.avatar}>
            {name[0]}
          </Avatar>
        )}
        <span className={classes.chatTitle}>{!isMe && name}</span>
      </div>
      <div
        className={clsx(
          classes.chatBoxContainer,
          isMe && classes.myChatBoxContainer
        )}
      >
        <p className={clsx(classes.chatBox, isMe && classes.myChatBox)}>
          {content} <br />
          <span className={classes.chatCreated}>
            {new Date(+created).toString()}
          </span>
        </p>
      </div>
    </div>
  );
}
