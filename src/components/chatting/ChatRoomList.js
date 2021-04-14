import React from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Divider, makeStyles, Typography, Box } from "@material-ui/core";
import List from "@material-ui/core/List";

const tempArr = [
  {
    chatRoomName: "채팅방1",
    members: ["피카츄", "라이츄", "꼬부기"],
    totalTalks: 10,
    recentTalk: {
      user: "피카츄",
      content: "안녕하세요우",
    },
  },
  {
    chatRoomName: "채팅방1",
    totalTalks: 5,
    members: ["피카츄", "라이츄", "꼬부기"],
    recentTalk: {
      user: "피카츄",
      content: "안녕하세요우",
    },
  },
  {
    chatRoomName: "채팅방1",
    members: ["피카츄", "라이츄", "꼬부기"],
    totalTalks: 5,
    recentTalk: {
      user: "피카츄",
      content: "안녕하세요우",
    },
  },
  {
    chatRoomName: "채팅방1",
    members: ["피카츄", "라이츄", "꼬부기"],
    totalTalks: 5,
    recentTalk: {
      user: "피카츄",
      content: "안녕하세요우",
    },
  },
  {
    chatRoomName: "채팅방1",
    members: ["피카츄", "라이츄", "꼬부기"],
    totalTalks: 5,
    recentTalk: {
      user: "피카츄",
      content: "안녕하세요우",
    },
  },
  {
    chatRoomName: "채팅방1",
    members: ["피카츄", "라이츄", "꼬부기"],
    totalTalks: 5,
    recentTalk: {
      user: "피카츄",
      content: "안녕하세요우",
    },
  },
];

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

const ChatRoomLi = ({ chatRoomName, members, recentTalk, totalTalks }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={
            <React.Fragment>
              <Typography variant="h5" component="h5" color="textPrimary">
                {chatRoomName}
              </Typography>

              <Members classes={classes} member={members}></Members>
            </React.Fragment>
          }
          secondary={
            <div className={classes.chatRoomLiBody}>
              <div className={classes.totalTalks}> {totalTalks} </div>
              <div>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {recentTalk.user} -
                </Typography>
                {" " + recentTalk.content}
              </div>
            </div>
          }
        />
      </ListItem>
      <Divider component="li" />
    </React.Fragment>
  );
};

const ChatRoomList = () => {
  return <List>{tempArr.map(ChatRoomLi)}</List>;
};

export default ChatRoomList;

console.log("?");
