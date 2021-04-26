import { makeStyles, TextField, Button } from "@material-ui/core";
import React, { useState } from "react";

const useStyle = makeStyles((theme) => ({
  root: {
    minWidth: "100%",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
  },

  textField: {
    flex: 2,
    marginRight: "20px",
  },
}));

const ChatInputText = ({ onSendMessage }) => {
  const classes = useStyle();
  const [text, setText] = useState("");
  const onSubmitHandler = () => {
    onSendMessage(text);
    setText("");
  };
  return (
    <div className={classes.root}>
      <TextField
        className={classes.textField}
        id="filled-multiline-static"
        multiline
        rows={4}
        value={text}
        variant="filled"
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        variant="outlined"
        size="large"
        color="primary"
        className={classes.margin}
        onClick={onSubmitHandler}
      >
        전송
      </Button>
    </div>
  );
};

export default ChatInputText;
