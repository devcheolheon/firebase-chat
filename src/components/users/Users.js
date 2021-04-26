import React, { useState, useCallback, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import chatRoomList from "../chatting/ChatRoomList";

import { BsChat } from "react-icons/bs";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Card } from "@material-ui/core";
import UserList from "../users/UserList";
import Loading from "../common/Loading";

import { useImmer } from "use-immer";
import ChatRoomList from "../chatting/ChatRoomList";

const drawerWidth = 160;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  reactIcon: {
    padding: "2px",
  },
  listItemIcon: {
    padding: "10px",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },

  appBarSpacer: theme.mixins.toolbar,

  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },

  fixedHeight: {
    height: 240,
  },

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

  liRoot: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },

  liInline: {
    display: "inline",
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

  const [open, setOpen] = React.useState(true);
  const [selectedUser, setSelectedUser] = React.useState("");

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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
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
          <ChatRoomList chats={usersChats} />
          <Grid item xs={12} className={classes.LongChatRoomList} />
        </Grid>
        <Grid item xs={12} lg={4} className={classes.LongChatListContainer}>
          {selectedUser && (
            <React.Fragment>
              <Typography variant="h6" className={classes.ChatRoomListTitle}>
                {selectedUserName}님이 참여중인 채팅방
              </Typography>
              <ChatRoomList chats={selectedUsersChats} />
              <Grid item xs={12} className={classes.LongChatRoomList} />
            </React.Fragment>
          )}
        </Grid>
      </Grid>
      <Box pt={4}></Box>
    </React.Fragment>
  );
};

export default Users;
