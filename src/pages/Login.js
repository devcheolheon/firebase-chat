import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import logo from "../logo.png";
import styles from "../bootstrap/login.module.css";
import Loading from "../components/common/Loading";

const authLogin = () => {
  return new Promise((resolve) => setTimeout(() => resolve(true), 4000));
};

const authLogout = () => {
  Promise.resolve(true);
};

const Login = () => {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);

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
      setLoginStatus(true);
    } catch (e) {
      if (e.code == "auth/user-not-found") {
        alert("가입하세요");
      }
    }

    setLoading(false);
    history.push("/createChat");
  }, []);

  return loading ? (
    <Loading></Loading>
  ) : (
    <main className={styles.login}>
      <form>
        <img class="mb-4" src={logo}></img>
        <h1 class="h3 mb-5 fw-normal text-center">로그인 해주세요</h1>
        <div class="form-floating">
          <input
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
          />
          <label for="floatingInput">이메일</label>
        </div>
        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />
          <label for="floatingPassword">비밀번호</label>
        </div>

        <button
          class="w-100 btn btn-lg btn-primary"
          type="submit"
          onClick={() => {
            login(email, password);
          }}
        >
          로그인
        </button>
        <p
          onClick={linktoJoin}
          class="text-center text-muted w-100 mt-3 font-weight-light linktext"
        >
          가입하기
        </p>
      </form>
    </main>
  );
};

export default Login;
