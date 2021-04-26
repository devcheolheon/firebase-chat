import React, { useState, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import AlertDialog from "../common/Popup";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import UserList from "../users/UserList";

import ChatRoomList from "../chatting/ChatRoomList";
import { joinChats as joinChatsAction } from "../../module/chats";

const useStyles = makeStyles((theme) => ({
  UserListTitle: {
    flex: 1,
    backgroundColor: theme.palette.primary.dark,
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },

  UserListContainer: {
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      flexDirection: "row",
    },
  },

  UserList: {
    height: "785px",
    overflowY: "scroll",
  },

  ChatRoomListTitle: {
    flex: 1,
    backgroundColor: theme.palette.primary.dark,
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },

  LongChatRoomListContainer: {
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      flexDirection: "row",
    },
  },

  LongChatRoomList: {
    height: "750px",
    overflowY: "scroll",
  },

  userLiBody: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  selectedUser: {
    backgroundColor: theme.palette.primary.light,
  },
}));

const Users = () => {
  const classes = useStyles();
  const users = useSelector((state) => state.users.users);
  const uid = useSelector((state) => state.auth.uid);
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedMyChat, setSelectedMyChat] = useState("");
  const [selectedYourChat, setSelectedYourChat] = useState("");

  const [popupOpen, setPopupOpen] = useState(false);

  const selectedUsersChats = useSelector(
    (state) => (!selectedUser ? [] : state.users[selectedUser].chats || []),
    shallowEqual
  );

  const selectedUserName = useSelector((state) =>
    !selectedUser ? "" : state.users[selectedUser].nickname
  );

  const usersChats = useSelector(
    (state) => state.users[state.auth.uid].chats || [],
    shallowEqual
  );

  const onClickMyChat = (chatId) => {
    setSelectedMyChat(chatId);
    setSelectedYourChat(chatId);
  };

  const joinChats = useCallback(() => {
    dispatch(joinChatsAction({ uid, id: selectedYourChat }));
  }, [uid, dispatch, selectedYourChat]);

  const onClickYourChat = (chatId) => {
    if (usersChats.indexOf(chatId) != -1) {
      setSelectedMyChat(chatId);
      setSelectedYourChat(chatId);
      return;
    } else {
      setSelectedYourChat(chatId);
      setSelectedMyChat("");
      setPopupOpen(true);
    }
  };

  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid container xs={12} lg={4} className={classes.UserListContainer}>
          <Grid item xs={12} className={classes.UserList}>
            <UserList
              users={users}
              onClickHandler={(id) => setSelectedUser(id)}
              selectedUser={selectedUser}
              classes={classes}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} lg={4} className={classes.LongChatListContainer}>
          <Typography variant="h6" className={classes.ChatRoomListTitle}>
            내가 참여 중인 채팅방
          </Typography>
          <ChatRoomList
            chats={usersChats}
            selectedChat={selectedMyChat}
            onClickHandler={onClickMyChat}
          />
          <Grid item xs={12} className={classes.LongChatRoomList} />
        </Grid>
        <Grid item xs={12} lg={4} className={classes.LongChatListContainer}>
          {selectedUser && (
            <React.Fragment>
              <Typography variant="h6" className={classes.ChatRoomListTitle}>
                {selectedUserName}님이 참여중인 채팅방
              </Typography>
              <ChatRoomList
                chats={selectedUsersChats}
                selectedChat={selectedYourChat}
                onClickHandler={onClickYourChat}
              />
              <Grid item xs={12} className={classes.LongChatRoomList} />
            </React.Fragment>
          )}
        </Grid>
      </Grid>
      <Box pt={4}></Box>
      <AlertDialog
        open={popupOpen}
        setOpen={setPopupOpen}
        content="채팅에 참여하시겠습니까?"
        title="잠시만요~"
        handleAgree={joinChats}
      ></AlertDialog>
    </React.Fragment>
  );
};

export default Users;
