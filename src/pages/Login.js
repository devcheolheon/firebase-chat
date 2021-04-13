import React, { useState, useEffect, useCallback } from "react";
import { authLogin, authLogout } from "../utils/libFirebase";
import { useHistory } from "react-router-dom";
import logo from "../logo.png";
import Loading from "../components/common/Loading";
import useCheckLogin from "../hooks/useCheckLogin";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
  const classes = useStyles();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useCheckLogin(
    {
      setLoading,
      successUrl: "/chatRooms",
      failureUrl: "",
    },
    []
  );

  const linktoJoin = useCallback(() => {
    history.push("/join");
  }, []);

  const validateForm = useCallback(() => {
    // todo : 로그인 폼 validation
    return true;
  }, {});

  const login = useCallback(async (email, password) => {
    if (!validateForm()) return false;
    setLoading(true);

    try {
      await authLogin(email, password);
      //
      setLoginStatus(true);
    } catch (e) {
      console.log(e);
      if (e.code == "auth/user-not-found") {
        alert("가입하세요");
        return;
      }
    }

    setLoading(false);
  }, []);

  return loading ? (
    <Loading></Loading>
  ) : (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar
          className={`${classes.avatar} ${classes.large}`}
          src={logo}
          variant="square"
        />
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => login(email, password)}
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
  );
};

export default Login;
