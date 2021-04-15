import React from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Divider, makeStyles, Typography } from "@material-ui/core";
import List from "@material-ui/core/List";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },

  chatRoomLiBody: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  totalTalks: {
    padding: "4px 8px",
    marginLeft: "10px",
    fontSize: "0.9em",
    borderRadius: "100px",
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Members = ({ member, classes }) => {
  console.log(member);
  return (
    <Typography
      variant="h8"
      component="h8"
      className={classes.inline}
      color="textSecondary"
    >
      {member < 4
        ? member.join(" ")
        : member
            .slice(0, 4)
            .join(", ")
            .concat(" ... ", `외 ${member.length} 명`)}
    </Typography>
  );
};

const ChatRoomLi = ({ name, users, recentMessage, totalMessages }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={
            <React.Fragment>
              <Typography variant="h5" component="h5" color="textPrimary">
                {name}
              </Typography>

              <Members classes={classes} member={users}></Members>
            </React.Fragment>
          }
          secondary={
            <div className={classes.chatRoomLiBody}>
              <div className={classes.totalTalks}> {totalMessages || 0} </div>
              <div>
                {recentMessage && (
                  <React.Fragement>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {recentMessage.user} -
                    </Typography>
                    {" " + recentMessage.content}
                  </React.Fragement>
                )}
              </div>
            </div>
          }
        />
      </ListItem>
      <Divider component="li" />
    </React.Fragment>
  );
};

const ChatRoomList = ({ chats }) => {
  return <List>{chats.map(ChatRoomLi)}</List>;
};

export default ChatRoomList;

console.log("?");
