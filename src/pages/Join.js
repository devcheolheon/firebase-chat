import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import styles from "../bootstrap/join.module.css";
import Loading from "../components/common/Loading";
import { authJoin, authSaveUser } from "../utils/libFirebase";
import useCheckLogin from "../hooks/useCheckLogin";

const Join = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginStatus, setLoginStatus] = useCheckLogin(
    {
      setLoading,
      successUrl: "/chatRooms",
      failureUrl: "/join",
    },
    []
  );

  const join = useCallback(async (body) => {
    setLoading(true);
    try {
      let uid = await authJoin(body);
      await authSaveUser({ ...body, uid });
      setLoginStatus(true);
    } catch (e) {}
    setLoading(false);
  }, []);

  return loading ? (
    <Loading></Loading>
  ) : (
    <main className={styles.join}>
      <form>
        <h1 class="h3 mb-3 fw-normal">가입하기</h1>
        <div class="form-floating">
          <input
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <label for="floatingInput">이메일</label>
        </div>
        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            vaule={password}
          />
          <label for="floatingPassword">비밀번호</label>
        </div>
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            onChange={(e) => setNickname(e.target.value)}
            vaule={nickname}
          />
          <label for="floatingInput">닉네임</label>
        </div>

        <button
          class="w-100 btn btn-lg btn-primary"
          type="submit"
          onClick={() => join({ email, password, nickname })}
        >
          가입
        </button>
      </form>
    </main>
  );
};

export default Join;
