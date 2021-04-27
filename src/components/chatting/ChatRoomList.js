import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import clsx from "clsx";

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

  selectedChat: {
    backgroundColor: theme.palette.primary.light,
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

function makeSelectChatRoomInfo() {
  return createSelector(
    (state, id) => state.chats[id],
    (state, id) => state.users,
    (state, id) => state.messages,
    (state, id) => state.chats[id].recentMessage,
    (chat, users, messages, recentMessage) => ({
      ...chat,
      users: chat.users.map((id) =>
        users[id] ? users[id].nickname : "unknown"
      ),
      recentMessage: messages[recentMessage],
    })
  );
}

function ChatRoomLi({ chat: { id, selected }, classes }) {
  const selectChatRoomInfo = useMemo(makeSelectChatRoomInfo, []);

  let {
    name = "",
    totalMessages = 0,
    recentMessage = null,
    users = [],
  } = useSelector((state) => selectChatRoomInfo(state, id));

  const [Primary, Secondary] = useMemo(
    () => [
      <React.Fragment>
        <Typography variant="h5" component="h5" color="textPrimary">
          {name}
        </Typography>
        <Members classes={classes} member={users}></Members>
      </React.Fragment>,
      <div className={classes.chatRoomLiBody}>
        <div className={classes.totalTalks}> {totalMessages || 0} </div>
        <div>
          <Typography
            component="span"
            variant="body2"
            className={classes.inline}
            color="textPrimary"
          >
            {recentMessage && recentMessage.content}
          </Typography>
        </div>
      </div>,
    ],
    [classes, name, users, recentMessage]
  );

  return (
    <React.Fragment>
      <ListItem
        alignItems="flex-start"
        data-id={id}
        key={id}
        className={clsx(selected && classes.selectedChat)}
      >
        <ListItemText primary={Primary} secondary={Secondary} />
      </ListItem>
      <Divider component="li" />
    </React.Fragment>
  );
}

const ChatRoomList = ({ chats, onClickHandler, selectedChat }) => {
  const classes = useStyles();
  const checkedChats = chats.map((id) => {
    if (id === selectedChat) return { id, selected: true };
    return { id };
  });

  return (
    <List
      onClick={(e) => {
        const li = e.target.closest("li");
        if (!li) return;
        const id = li.dataset.id;
        onClickHandler(id);
      }}
    >
      {checkedChats.map((chat) => (
        <ChatRoomLi classes={classes} chat={chat}></ChatRoomLi>
      ))}
    </List>
  );
};

export default ChatRoomList;
