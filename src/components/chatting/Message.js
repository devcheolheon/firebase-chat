/*
  {
    id: "2",
    uid: "----",
    name: "라이츄",
    content: "bbbb",
    created: "1618378653151",
  }
*/

import React from "react";
import clsx from "clsx";
import Avatar from "@material-ui/core/Avatar";
import { useSelector } from "react-redux";
import { Timestamp } from "../common/Timestamp";

export default function Message({ message: { id, created }, classes }) {
  const uid = useSelector((state) => state.auth.uid);
  const { user, content, readUsers = [] } = useSelector(
    (state) => state.messages[id]
  );
  const { nickname: name = "" } = useSelector((state) => state.users[user]);
  const isMe = uid === user;

  return (
    <div key={id} className={classes.root}>
      <div className={clsx(classes.chatHeader, isMe && classes.myChatHeader)}>
        {!isMe && (
          <Avatar aria-label="user" className={classes.avatar}>
            {name && name[0]}
          </Avatar>
        )}
        <span className={classes.chatTitle}>{!isMe && name}</span>
      </div>
      <div
        className={clsx(
          classes.chatBoxContainer,
          isMe && classes.myChatBoxContainer
        )}
      >
        <p className={clsx(classes.chatBox, isMe && classes.myChatBox)}>
          {content} <br />
          <span className={classes.chatCreated}>
            <Timestamp date={created} />
          </span>
          <span className={classes.chatReadCounts}>
            ( {readUsers.length} 읽음 )
          </span>
        </p>
      </div>
    </div>
  );
}
