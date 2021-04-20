import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function CreateChatFormDialog({ open, setOpen, onSubmit }) {
  const [text, setText] = React.useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseWithSubmit = () => {
    onSubmit(text);
    setText("");
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">채팅방 추가하기 </DialogTitle>
        <DialogContent>
          <DialogContentText>
            채팅방을 자유롭게 추가할 수 있습니다. 채팅방 이름을 입력해주세요
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="채팅방 이름"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            취소
          </Button>
          <Button onClick={handleCloseWithSubmit} color="primary">
            추가
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
