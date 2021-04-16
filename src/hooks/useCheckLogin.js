import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const useCheckLogin = ({ loginUrl, logoutUrl }) => {
  const { login_loading, isLogin, uid, nickname } = useSelector(
    (state) => state.auth
  );

  const history = useHistory();

  useEffect(() => {
    if (!login_loading) {
      if (isLogin && loginUrl) history.push(loginUrl);
      if (!isLogin && logoutUrl) history.push(logoutUrl);
    }
  }, [login_loading, isLogin]);

  return [login_loading, isLogin, uid, nickname];
};

export default useCheckLogin;
