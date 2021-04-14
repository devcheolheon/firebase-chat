import { makeStyles, TextField, Button } from "@material-ui/core";
import React from "react";
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

const ChatInputText = () => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <TextField
        className={classes.textField}
        id="filled-multiline-static"
        multiline
        rows={4}
        defaultValue="메시지를 입력해주세요..."
        variant="filled"
      />
      <Button
        variant="outlined"
        size="large"
        color="primary"
        className={classes.margin}
      >
        전송
      </Button>
    </div>
  );
};

export default ChatInputText;
