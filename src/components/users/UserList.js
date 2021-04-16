import React from "react";
import clsx from "clsx";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Divider, makeStyles, Typography } from "@material-ui/core";
import List from "@material-ui/core/List";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
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

const UserLi = ({ id, name, email, selected }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <ListItem
        alignItems="flex-start"
        data-id={id}
        key={id}
        className={clsx(selected && classes.selectedUser)}
      >
        <ListItemText
          primary={
            <React.Fragment>
              <Typography variant="h5" component="h5" color="textPrimary">
                {name}
              </Typography>
            </React.Fragment>
          }
          secondary={
            <div className={classes.userLiBody}>
              <div>{email}</div>
            </div>
          }
        />
      </ListItem>
      <Divider component="li" />
    </React.Fragment>
  );
};

const UserList = ({ users, onClickHandler, selectedUser }) => {
  const checkedUsers = users.map((user) => {
    if (user.id === selectedUser) return { ...user, selected: true };
    if (user.selected) return { ...user, selected: false };
    return user;
  });

  return (
    <List
      onClick={(e) => {
        const li = e.target.closest("li");
        const id = li.dataset.id;
        onClickHandler(id);
      }}
    >
      {checkedUsers.map(UserLi)}
    </List>
  );
};

export default UserList;
