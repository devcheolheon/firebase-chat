import React, { useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { BsChat } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import Chatting from "../components/chatting/Chatting";
import Users from "../components/users/Users";

import useCheckLogin from "../hooks/useCheckLogin";
import { logout } from "../module/auth";
import { startInit } from "../module/init";
import Loading from "../components/common/Loading";
import Alarm from "../components/common/Alarm";

const drawerWidth = 160;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
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

  selectedMenu: {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const MENU_USER = "MENU_USER";
const MENU_CHATTING = "MENU_CHATTING";

const makeUnreadMessageSelector = () => {
  return createSelector(
    (state) => state.init.init,
    (state) => state.messages,
    (state) => {
      console.log(state);
      return state.init.init &&
        !state.init.loading &&
        state.auth.isLogin &&
        state.users[state.auth.uid].chats
        ? state.users[state.auth.uid].chats
            .map((chat) => state.chats[chat])
            .map(({ messages = [], name, recentMessage }) => ({
              name,
              recentMessage,
              messages: messages
                .map(({ id }) => state.messages[id])
                .filter(
                  ({ targets, readUsers }) =>
                    targets &&
                    targets.indexOf(state.auth.uid) != -1 &&
                    readUsers.indexOf(state.auth.uid) == -1
                ),
            }))
        : [];
    },
    (init, messages, newMessagesInChat) => {
      if (!init) return [];
      newMessagesInChat = newMessagesInChat.map((obj) => ({
        name: obj.name,
        message: messages[obj.recentMessage],
        count: obj.messages.length,
      }));
      newMessagesInChat.sort((a, b) => b.count - a.count);
      return newMessagesInChat;
    }
  );
};

const Main = () => {
  const classes = useStyles();
  const [menu, setMenu] = React.useState(MENU_CHATTING);
  const [open, setOpen] = React.useState(true);
  const [alarmOpen, setAlarmOpen] = React.useState(false);
  const [login_loading, isLogin, uid, nickname] = useCheckLogin({
    logoutUrl: "/login",
  });

  const loading = useSelector((state) => state.init.loading);
  const isInit = useSelector((state) => state.init.init);

  const unReadMessagesSelector = useMemo(makeUnreadMessageSelector, []);
  const unReadMessages = useSelector(unReadMessagesSelector, shallowEqual);
  const totalAlarms = unReadMessages.reduce((acc, v) => acc + v.count, 0);

  const dispatch = useDispatch();

  useEffect(() => {
    if (uid && !loading && !isInit) {
      dispatch(startInit({ uid }));
    }
  }, [uid, isInit, loading]);

  const onLogout = () => {
    dispatch(logout());
  };

  const selectMenu = (menu) => {
    setMenu(menu);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return loading !== false ? (
    <div className={classes.root}>
      <Loading></Loading>
    </div>
  ) : (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {menu === MENU_CHATTING && " ?????? "}
            {menu === MENU_USER && "????????? ?????? "}
          </Typography>

          <IconButton
            color="inherit"
            onClick={() => {
              if (totalAlarms > 0) setAlarmOpen("true");
            }}
          >
            <Badge badgeContent={totalAlarms} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={onLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem
            button
            onClick={() => {
              selectMenu(MENU_CHATTING);
            }}
            className={clsx({
              [classes.selectedMenu]: menu === MENU_CHATTING,
            })}
          >
            <ListItemIcon className={classes.listItemIcon}>
              <BsChat size="22" className={classes.reactIcon} />
            </ListItemIcon>
            <ListItemText primary="?????????" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              selectMenu(MENU_USER);
            }}
            className={clsx({ [classes.selectedMenu]: menu === MENU_USER })}
          >
            <ListItemIcon className={classes.listItemIcon}>
              <FiUsers size="22" className={classes.reactIcon} />
            </ListItemIcon>
            <ListItemText primary="?????????" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {menu === MENU_CHATTING && <Chatting />}
        {menu === MENU_USER && <Users myId={uid} />}
      </main>
      <Alarm
        open={alarmOpen}
        setOpen={setAlarmOpen}
        unReadMessages={unReadMessages}
      ></Alarm>
    </div>
  );
};

export default Main;
