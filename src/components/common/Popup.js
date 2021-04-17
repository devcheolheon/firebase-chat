import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function AlertDialog({
  open,
  setOpen,
  content,
  title,
  handleAgree,
}) {
  const handleCloseAgree = () => {
    setOpen(false);
    handleAgree();
  };

  const handleCloseDisagree = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCloseDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAgree} color="primary">
            아니요
          </Button>
          <Button onClick={handleCloseDisagree} color="primary" autoFocus>
            네
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
