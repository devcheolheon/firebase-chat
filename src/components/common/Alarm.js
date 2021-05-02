import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  tableBackground: {
    width: "100%",
    height: "100%",
    position: "fixed",
    zIndex: 3000,
  },
  tableContainer: {
    position: "fixed",
    right: "115px",
    top: "45px",
    width: 330,
    border: "1px solid white",
  },
  table: {
    width: 300,
  },
});

export default function Alarm({ open, setOpen, unReadMessages }) {
  const classes = useStyles();

  const onClose = () => {
    setOpen(false);
  };

  return (
    open && (
      <div className={classes.tableBackground} onClick={onClose}>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {unReadMessages.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">
                    {row.message.content.slice(0, 20)}
                  </TableCell>
                  <TableCell align="right">{row.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  );
}
