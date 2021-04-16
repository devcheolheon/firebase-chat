import React, { useState, useCallback, useEffect } from "react";
import { BsChat } from "react-icons/bs";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { Card } from "@material-ui/core";

import {
  linkToChatRoomList,
  createRoom,
  getUserNameById,
  authLogout,
} from "../../firebaseUtils/libFirebase";

import useCheckLogin from "../../hooks/useCheckLogin";

import { useImmer } from "use-immer";

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

const Users = () => {
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
    <React.Fragment>
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
          <Grid item xs={12} className={classes.ChatRoomList}></Grid>
          <Typography variant="h6" className={classes.ChatRoomListTitle}>
            채팅방
          </Typography>
          <Grid item xs={12} className={classes.ChatRoomList}></Grid>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} lg={4} className={classes.ChatListContainer}></Grid>
        <Grid item xs={12} lg={4} className={classes.ChatCardContainer}>
          <Card variant="outlined" className={classes.ChatCard} />
          <Card variant="outlined" className={classes.ChatCard} />
        </Grid>
      </Grid>
      <Box pt={4}></Box>
    </React.Fragment>
  );
};

export default Users;
