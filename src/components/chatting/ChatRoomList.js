import React, { useCallback, useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
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

function makeMemberSelector() {
  return createSelector(
    (state, id) => state.users,
    (state, id) => state.chats[id].users,
    (users, members) => members.map((mId) => users[mId].nickname)
  );
}

function makeMessageSelector() {
  return createSelector(
    (state, id) => state.messages,
    (_, id) => id,
    (messages, id) => messages[id]
  );
}

function ChatRoomLiHeader({ name, classes, users }) {
  return (
    <React.Fragment>
      <Typography variant="h5" component="h5" color="textPrimary">
        {name}
      </Typography>
      <Members classes={classes} member={users}></Members>
    </React.Fragment>
  );
}
const MemoChatRoomLiHeader = React.memo(ChatRoomLiHeader);

function ChatRoomLiBody({ totalMessages, classes, recentMessage }) {
  return (
    <div className={classes.chatRoomLiBody}>
      <div className={classes.totalTalks}> {totalMessages || 0} </div>
      <div>
        <Typography
          component="span"
          variant="body2"
          className={classes.inline}
          color="textPrimary"
        >
          {recentMessage && recentMessage.content.slice(0, 14)}
        </Typography>
      </div>
    </div>
  );
}

const MemoChatRoomLiBody = React.memo(ChatRoomLiBody);

function ChatRoomLi({ chat: id, selected, classes }) {
  const memberSelector = useMemo(makeMemberSelector, []);
  const messageSelector = useMemo(makeMessageSelector, []);

  const { name = "", totalMessages = 0, recentMessage = null } = useSelector(
    (state) => state.chats[id]
  );

  const users = useSelector((state) => memberSelector(state, id), shallowEqual);
  const message = useSelector(
    (state) => messageSelector(state, recentMessage),
    shallowEqual
  );

  return (
    <React.Fragment>
      <ListItem
        alignItems="flex-start"
        data-id={id}
        key={id}
        className={clsx(selected && classes.selectedChat)}
      >
        <ListItemText
          primary={<MemoChatRoomLiHeader {...{ name, classes, users }} />}
          secondary={
            <MemoChatRoomLiBody
              {...{ totalMessages, classes, recentMessage: message }}
            />
          }
        />
      </ListItem>
      <Divider component="li" />
    </React.Fragment>
  );
}
const MemoChatRoomLi = React.memo(ChatRoomLi);

const ChatRoomList = ({ chats, onClickHandler, selectedChat }) => {
  const classes = useStyles();
  const onClick = useCallback(
    (e) => {
      const li = e.target.closest("li");
      if (!li) return;
      const id = li.dataset.id;
      onClickHandler(id, selectedChat);
    },
    [selectedChat]
  );

  return (
    <List onClick={onClick}>
      {chats.map((chat) => (
        <MemoChatRoomLi
          key={chat}
          classes={classes}
          chat={chat}
          selected={chat === selectedChat}
        ></MemoChatRoomLi>
      ))}
    </List>
  );
};

export default ChatRoomList;
