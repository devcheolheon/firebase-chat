import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Grid, Box, Typography, CardContent } from "@material-ui/core";
import ControlPointIcon from "@material-ui/icons/ControlPoint";

import ChatRoomList from "./ChatRoomList";
import MessageList from "./MessageList";
import ChatInputText from "./ChatInputText";
import AlertDialog from "../common/Popup";
import CreateChatFormDialog from "./CreateChatFormDialog";
import GraphChart from "./GraphChart";

import {
  joinChats,
  unjoinChats,
  createChats as createChatAction,
} from "../../module/chats";

import { sendMessage, setMessagesRead } from "../../module/messages";

import { usersStackedGraph } from "../../graphUtils/usersStackedGraph";
import { usersRelationGraph } from "../../graphUtils/usersRelationGraph";
import useUserRelationData from "../../hooks/useUsersRelationData";
import useUsersStackedData from "../../hooks/useUsersStackedData";

const useStyles = makeStyles((theme) => ({
  ChatRoomListTitle: {
    flex: 1,
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(2),
  },

  notInChatRoomListTitle: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(2),
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
  const [popupOpen2, setPopupOpen2] = useState(false);
  const [popupOpen3, setPopupOpen3] = useState(false);

  const [userRelationData] = useUserRelationData();
  const [userStackedData] = useUsersStackedData();
  const dispatch = useDispatch();
  const uid = useSelector((state) => state.auth.uid);
  const chats = useSelector((state) => state.chats.chats);

  const { chats: myChats = [] } = useSelector(
    (state) => state.users[state.auth.uid] || { chats: [] }
  );

  const notMyChats = chats.filter(
    (chat) => myChats.findIndex((myChat) => myChat == chat) == -1
  );

  const classes = useStyles();

  const onClickChatRoomLi = useCallback((id, selectedChat) => {
    setSelectedChat(id);
    if (id == selectedChat) {
      setPopupOpen2(true);
    } else {
      dispatch(setMessagesRead({ chat: id }));
    }
  }, []);

  const onClickNotMyChatRoomLi = useCallback((id) => {
    setSelectedChat(id);
    setPopupOpen(true);
  }, []);

  const joinChat = useCallback(() => {
    console.log(`${uid} 가 ${selectedChat}에 join!`);
    dispatch(joinChats({ uid, id: selectedChat }));
  }, [selectedChat, dispatch]);

  const unJoinChat = useCallback(() => {
    console.log(`${uid} 가 ${selectedChat}에 unjoin!`);
    dispatch(unjoinChats({ uid, id: selectedChat }));
  }, [selectedChat, dispatch]);

  const createChat = useCallback(
    (subject) => {
      console.log(`create chat ${subject}`);
      dispatch(createChatAction({ userId: uid, name: subject }));
    },
    [dispatch, uid]
  );

  const onSendMessage = useCallback(
    (text) => {
      console.log(uid, selectedChat, text);
      dispatch(sendMessage({ user: uid, chat: selectedChat, content: text }));
    },
    [uid, selectedChat, dispatch]
  );
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
          <div className={classes.notInChatRoomListTitle}>
            <Typography variant="h6">채팅방</Typography>
            <ControlPointIcon size="33" onClick={() => setPopupOpen3(true)} />
          </div>
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
          {selectedChat && (
            <React.Fragment>
              <MessageList chat={selectedChat}></MessageList>
              <ChatInputText onSendMessage={onSendMessage} />
            </React.Fragment>
          )}
        </Grid>
        <Grid item xs={12} lg={4} className={classes.ChatCardContainer}>
          <Card variant="outlined" className={classes.ChatCard}>
            <CardContent>
              <GraphChart
                graphFunc={usersStackedGraph}
                data={userStackedData}
              ></GraphChart>
            </CardContent>
          </Card>
          <Card variant="outlined" className={classes.ChatCard}>
            <CardContent>
              <GraphChart
                graphFunc={usersRelationGraph}
                data={userRelationData}
              ></GraphChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box pt={4}></Box>
      <AlertDialog
        open={popupOpen}
        setOpen={setPopupOpen}
        content="채팅에 참여하시겠습니까?"
        title="잠시만요~"
        handleAgree={joinChat}
      ></AlertDialog>
      <AlertDialog
        open={popupOpen2}
        setOpen={setPopupOpen2}
        content="채팅에서 나오시겠습니까?"
        title="잠시만요~"
        handleAgree={unJoinChat}
      ></AlertDialog>
      <CreateChatFormDialog
        open={popupOpen3}
        setOpen={setPopupOpen3}
        onSubmit={createChat}
      ></CreateChatFormDialog>
    </React.Fragment>
  );
};

export default Chatting;
