import React, { useState, useEffect, useCallback } from "react";
import { authLogin, authLogout } from "../firebaseUtils/auth";
import { useHistory } from "react-router-dom";
import Loading from "../components/common/Loading";
import useCheckLogin from "../hooks/useCheckLogin";

import Logo from "../components/common/Logo";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../module/auth";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login_loading, isLogin, uid, nickname] = useCheckLogin({
    loginUrl: "/main",
  });

  const loading = useSelector((state) => state.init.loading);

  const dispatch = useDispatch();
  const onLogin = (email, password) => {
    dispatch(login(email, password));
  };

  const history = useHistory();
  const linktoJoin = useCallback(() => {
    history.push("/join");
  }, []);

  const validateForm = useCallback(() => {
    // todo : 로그인 폼 validation
    return true;
  }, {});

  const classes = useStyles();
  return login_loading || loading ? (
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
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="이메일"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={(e) => {
                e.preventDefault();
                onLogin({ email, password });
              }}
            >
              입장
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link onClick={() => linktoJoin()} variant="body2">
                  {"계정이 없으신가요? 가입하세요"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}></Box>
      </Container>
    </Grid>
  );
};

export default Login;
