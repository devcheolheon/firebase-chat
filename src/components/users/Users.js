import React, { useState, useCallback, useEffect } from "react";
import { BsChat } from "react-icons/bs";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Card } from "@material-ui/core";
import UserList from "../users/UserList";

import { useImmer } from "use-immer";

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
}));

const tempuserData = [
  { id: 1, name: "피카츄", email: "a@gmail.com" },
  { id: 2, name: "라이츄", email: "b@gmail.com" },
  { id: 3, name: "파이리", email: "c@gmail.com" },

  { id: 4, name: "피카츄", email: "a@gmail.com" },
  { id: 5, name: "라이츄", email: "b@gmail.com" },
  { id: 6, name: "파이리", email: "c@gmail.com" },

  { id: 7, name: "피카츄", email: "a@gmail.com" },
  { id: 9, name: "라이츄", email: "b@gmail.com" },
  { id: 10, name: "파이리", email: "c@gmail.com" },
];

const Users = () => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(true);
  const [selectedUser, setSelectedUser] = React.useState("");

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
              users={tempuserData}
              onClickHandler={(id) => setSelectedUser(id)}
              selectedUser={selectedUser}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} lg={4} className={classes.LongChatListContainer}>
          <Typography variant="h6" className={classes.ChatRoomListTitle}>
            참여 중인 채팅방
          </Typography>
          <Grid item xs={12} className={classes.LongChatRoomList} />
        </Grid>
        <Grid item xs={12} lg={4} className={classes.LongChatListContainer}>
          <Typography variant="h6" className={classes.ChatRoomListTitle}>
            나와 함께 참여중인 채팅방
          </Typography>
          <Grid item xs={12} className={classes.LongChatRoomList} />
        </Grid>
      </Grid>
      <Box pt={4}></Box>
    </React.Fragment>
  );
};

export default Users;
