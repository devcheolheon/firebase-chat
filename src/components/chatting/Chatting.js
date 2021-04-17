import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Grid, Box, Typography } from "@material-ui/core";

import ChatRoomList from "./ChatRoomList";
import ChatInputText from "./ChatInputText";

import AlertDialog from "../common/Popup";

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
  const [selectedChat, setSelectedChat] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const uid = useSelector((state) => state.auth.uid);
  const chats = useSelector((state) => state.chats.chats);
  const { chats: myChats = [] } = useSelector((state) => state.auth);
  const notMyChats = chats.filter(
    (chat) => myChats.findIndex((myChat) => myChat == chat) == -1
  );

  const classes = useStyles();

  const onClickChatRoomLi = useCallback((id) => {
    setSelectedChat(id);
  }, []);

  const onClickNotMyChatRoomLi = useCallback((id) => {
    setSelectedChat(id);
    setPopupOpen(true);
  }, []);

  const handleAgree = useCallback(() => {
    console.log(`${uid} 가 ${selectedChat}에 join!`);
  }, [selectedChat]);

  useEffect(() => {
    //linkToChatsList({ onAdded: addChat });
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
              chats={myChats}
              onClickHandler={onClickChatRoomLi}
            />
          </Grid>
          <Typography variant="h6" className={classes.ChatRoomListTitle}>
            채팅방
          </Typography>
          <Grid item xs={12} className={classes.ChatRoomList}>
            <ChatRoomList
              selectedChat={selectedChat}
              chats={notMyChats}
              onClickHandler={onClickNotMyChatRoomLi}
            />
          </Grid>
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
      <AlertDialog
        open={popupOpen}
        setOpen={setPopupOpen}
        content="채팅에 참여하시겠습니까?"
        title="잠시만요~"
        handleAgree={handleAgree}
      ></AlertDialog>
    </React.Fragment>
  );
};

export default Chatting;
