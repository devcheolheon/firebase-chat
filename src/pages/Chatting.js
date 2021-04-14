import React, { useState, useCallback, useEffect } from "react";
import { BsChat } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Grid from "@material-ui/core/Grid";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import ChatRoomList from "../components/ChatRoomList";
import Chat from "../components/Chat";

import {
  linkToChatRoomList,
  createRoom,
  getUserNameById,
  authLogout,
} from "../utils/libFirebase";
import useCheckLogin from "../hooks/useCheckLogin";

import { useImmer } from "use-immer";
import { CallReceived } from "@material-ui/icons";

const ChatRoomLi = ({ id, name, selected, onClick }) => {
  console.log(`${id} - selected: ${selected}`);
  return (
    <li class="nav-item" key={id}>
      <a
        id={id}
        href="#"
        className={"nav-link " + (selected ? "active" : "text-white")}
        onClick={onClick}
      >
        <BsChat size={"1.4rem"} class="pb-1"></BsChat> {name}
      </a>
    </li>
  );
};
/*
const Content = ({ setClose, select }) => {
  const [name, setName] = useState("");

  const makeRoom = useCallback(async (name) => {
    await createRoom(name);
    setClose(true);
  }, []);

  return (
    <div className={Styles.popupContent}>
      <h1>채팅방 이름을 입력하세요 </h1>
      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        ></input>
        <button type="submit" onClick={(e) => makeRoom(name)}>
          방 만들기{" "}
        </button>
      </div>
    </div>
  );
};

const SelectRoomPlease = () => {
  return (
    <div className={Styles.background}>
      <h1> 방을 선택해 주세요 </h1>
    </div>
  );
};

*/

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
    overflowY: "scroll",
    border: "2px solid black",
    borderColor: theme.palette.text.secondary,
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

  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
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
            채팅방
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
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
          <ListItem button>
            <ListItemIcon className={classes.listItemIcon}>
              <BsChat size="22" className={classes.reactIcon} />
            </ListItemIcon>
            <ListItemText primary="채팅방" />
          </ListItem>
          <ListItem button>
            <ListItemIcon className={classes.listItemIcon}>
              <FiUsers size="22" className={classes.reactIcon} />
            </ListItemIcon>
            <ListItemText primary="사용자" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
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
            {tempChatsArr.map(Chat)}
          </Grid>
          <Grid item xs={12} lg={4}>
            <List>
              <ListItem>
                <ListItemText primary="채팅1" />
              </ListItem>
              <ListItem>
                <ListItemText primary="채팅2" />
              </ListItem>
              <ListItem>
                <ListItemText primary="채팅" />
              </ListItem>
            </List>
          </Grid>
        </Grid>
        <Box pt={4}></Box>
      </main>
    </div>
  );
};

export default Chatting;
