import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { firebaseApp } from "../firebase";
import { useHistory } from "react-router-dom";

const useCheckLogin = ({ loginUrl, logoutUrl }) => {
  const login_loading = useSelector((state) => state.auth.loading);
  const isLogin = useSelector((state) => state.auth.isLogin);
  const uid = useSelector((state) => state.auth.uid);
  const nickname = useSelector((state) => state.auth.nickname);

  const history = useHistory();

  useEffect(() => {
    if (!login_loading) {
      if (isLogin && loginUrl) history.push(loginUrl);
      if (!isLogin && logoutUrl) history.push(logoutUrl);
    }
  }, [login_loading]);

  return [login_loading, isLogin, uid, nickname];
};

export default useCheckLogin;
