import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Loading from "../components/common/Loading";
import { authJoin, authSaveUser } from "../firebaseUtils/auth";
import useCheckLogin from "../hooks/useCheckLogin";

import Logo from "../components/common/Logo";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Join = () => {
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  useCheckLogin({
    loginUrl: "/main",
  });

  const join = useCallback(async (body) => {
    setLoading(true);
    try {
      let uid = await authJoin(body);
      await authSaveUser({ ...body, uid });
      //setLoginStatus(uid);
    } catch (e) {}
    setLoading(false);
  }, []);

  return loading ? (
    <Loading></Loading>
  ) : (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      component="main"
      style={{ minHeight: "100vh" }}
    >
      <Container maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Logo></Logo>
          <Typography component="h1" variant="h5">
            가입하기
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="이메일"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="비밀번호"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="nickname"
                  label="닉네임"
                  type="text"
                  id="nickname"
                  onChange={(e) => setNickname(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => join({ nickname, password, email })}
            >
              가입
            </Button>
          </form>
        </div>
        <Box mt={5}></Box>
      </Container>
    </Grid>
  );
};

export default Join;
