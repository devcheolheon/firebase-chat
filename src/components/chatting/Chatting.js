import React, { useState, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Grid, Box, Typography } from "@material-ui/core";

import ChatRoomList from "./ChatRoomList";
import Chat from "./Chat";
import ChatInputText from "./ChatInputText";

import { useImmer } from "use-immer";

import { createChat, linkToChatsList } from "../../firebaseUtils/chats";

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

const Chatting = () => {
  const [close, setClose] = useState(false);
  const [chats, setChats] = useImmer([]);
  const [selectedChat, setSelectedChat] = useState("");
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
      //const name = await getUserNameById(userId);
      //setNickname(name);
      setLoading(false);
    }
    fetchNickname(userId);
  }, [loginStatus]);

  const addChat = useCallback((newRoom) => {
    setChats((draft) => {
      draft.push(newRoom);
    });
  }, []);

  //  addChat 테스트
  useEffect(() => {
    if (loginStatus !== "") {
      createChat({ name: "test", userId: loginStatus });
    }
  }, [loginStatus]);

  /*
  const removeChatRooms = useCallback((newRoom) => {
    setSelectedChatRoom("");
    setChatRooms((draft) => draft.filter((v) => v.id !== newRoom.id));
  }, []);
  */

  const onClickChatRoomLi = useCallback((id) => {
    setSelectedChat(id);
  }, []);

  /*
  const onClickLogout = useCallback((event) => {
    event.preventDefault();
    authLogout();
  });
  */

  useEffect(() => {
    linkToChatsList({ onAdded: addChat });
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
            <ChatRoomList
              selectedChat={selectedChat}
              chats={chats}
              onClickHandler={onClickChatRoomLi}
            />
          </Grid>
          <Typography variant="h6" className={classes.ChatRoomListTitle}>
            채팅방
          </Typography>
          <Grid item xs={12} className={classes.ChatRoomList}></Grid>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} lg={4} className={classes.ChatListContainer}>
          <div className={classes.ChatList}>{}</div>
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
