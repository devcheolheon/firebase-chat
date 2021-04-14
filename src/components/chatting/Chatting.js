import React, { useState, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Grid, Box, Typography } from "@material-ui/core";

import ChatRoomList from "./ChatRoomList";
import Chat from "./Chat";
import ChatInputText from "./ChatInputText";

import { useImmer } from "use-immer";

import {
  linkToChatRoomList,
  createRoom,
  getUserNameById,
  authLogout,
} from "../../utils/libFirebase";
import useCheckLogin from "../../hooks/useCheckLogin";

const useStyles = makeStyles((theme) => ({
  ChatRoomListTitle: {
    flex: 1,
    backgroundColor: theme.palette.primary.dark,
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },

  ChatRoomListContainer: {
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      flexDirection: "row",
    },
  },

  ChatRoomList: {
    height: "350px",
    overflowY: "scroll",
  },

  ChatListContainer: {
    marginTop: "4px",
    height: "785px",
    borderLeft: "2px solid rgb(66,66,66)",
    borderRight: "2px solid rgb(66,66,66)",
  },

  ChatList: {
    height: "630px",
    overflowY: "scroll",
  },

  ChatCardContainer: {
    height: "785px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },

  ChatCard: {
    marginLeft: "30px",
    marginRight: "30px",
    height: "300px",
  },
}));

const tempChatsArr = [
  {
    id: "1",
    uid: "----",
    name: "피카츄",
    content: "aaaa",
    created: "1618378653151",
    isMe: true,
  },
  {
    id: "1",
    uid: "----",
    name: "피카츄",
    content: "aaaa",
    created: "1618378653151",
    isMe: true,
  },
  {
    id: "1",
    uid: "----",
    name: "피카츄",
    content: "aaaa",
    created: "1618378653151",
    isMe: true,
  },
  {
    id: "1",
    uid: "----",
    name: "피카츄",
    content: "aaaa",
    created: "1618378653151",
    isMe: true,
  },
  {
    id: "1",
    uid: "----",
    name: "피카츄",
    content: "aaaa",
    created: "1618378653151",
    isMe: true,
  },
  {
    id: "2",
    uid: "----",
    name: "라이츄",
    content:
      "bbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    created: "1618378653151",
  },
  {
    isMe: true,
    id: "3",
    uid: "----",
    name: "피카츄",
    content: "aaaa",
    created: "1618378653151",
  },
];

const Chatting = () => {
  const [close, setClose] = useState(false);
  const [chatRooms, setChatRooms] = useImmer([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("noname");
  const classes = useStyles();

  const [loginStatus, setLoginStatus] = useCheckLogin(
    {
      setLoading,
      successUrl: "",
      failureUrl: "/login",
    },
    []
  );

  useEffect(() => {
    if (loginStatus == "") return;
    const userId = loginStatus;
    async function fetchNickname(userId) {
      setLoading(true);
      const name = await getUserNameById(userId);
      setNickname(name);
      setLoading(false);
    }
    fetchNickname(userId);
  }, [loginStatus]);

  const addChatRooms = useCallback((newRoom) => {
    setChatRooms((draft) => {
      draft.push(newRoom);
    });
  }, []);

  const removeChatRooms = useCallback((newRoom) => {
    setSelectedChatRoom("");
    setChatRooms((draft) => draft.filter((v) => v.id !== newRoom.id));
  }, []);

  const onClickChatRoomLi = useCallback((event) => {
    event.preventDefault();
    setSelectedChatRoom(event.target.id);
  }, []);

  const onClickLogout = useCallback((event) => {
    event.preventDefault();
    authLogout();
  });

  useEffect(() => {
    //  linkToChatRoomList({ onAdded: addChatRooms, onRemoved: removeChatRooms });
  }, []);

  return (
    <React.Fragment>
      <div className={classes.appBarSpacer} />
      <Grid container spacing={1}>
        {/* Chart */}
        <Grid
          container
          xs={12}
          lg={4}
          className={classes.ChatRoomListContainer}
        >
          <Typography variant="h6" className={classes.ChatRoomListTitle}>
            참여 중인 채팅방
          </Typography>
          <Grid item xs={12} className={classes.ChatRoomList}>
            <ChatRoomList />
          </Grid>
          <Typography variant="h6" className={classes.ChatRoomListTitle}>
            채팅방
          </Typography>
          <Grid item xs={12} className={classes.ChatRoomList}>
            <ChatRoomList />
          </Grid>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} lg={4} className={classes.ChatListContainer}>
          <div className={classes.ChatList}>{tempChatsArr.map(Chat)}</div>
          <ChatInputText />
        </Grid>
        <Grid item xs={12} lg={4} className={classes.ChatCardContainer}>
          <Card variant="outlined" className={classes.ChatCard} />
          <Card variant="outlined" className={classes.ChatCard} />
        </Grid>
      </Grid>
      <Box pt={4}></Box>
    </React.Fragment>
  );
};

export default Chatting;
