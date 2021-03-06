import React from "react";
import clsx from "clsx";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Divider, makeStyles, Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import { useSelector } from "react-redux";

const UserLi = ({ user: { id, selected }, classes }) => {
  const user = useSelector((state) => state.users[id]);

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
                {user.nickname}
              </Typography>
            </React.Fragment>
          }
          secondary={
            <div className={classes.userLiBody}>
              <div>{user.email}</div>
            </div>
          }
        />
      </ListItem>
      <Divider component="li" />
    </React.Fragment>
  );
};

const UserList = ({ classes, users, onClickHandler, selectedUser }) => {
  const checkedUsers = users.map((id) => {
    if (id === selectedUser) return { id, selected: true };
    return { id };
  });

  return (
    <List
      onClick={(e) => {
        const li = e.target.closest("li");
        const id = li.dataset.id;
        onClickHandler(id);
      }}
    >
      {checkedUsers.map((user) => (
        <UserLi user={user} classes={classes}></UserLi>
      ))}
    </List>
  );
};

export default UserList;
