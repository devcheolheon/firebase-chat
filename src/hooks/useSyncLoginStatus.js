import { useEffect } from "react";
import { linkToAuthState } from "../firebaseUtils/auth";
import { useDispatch } from "react-redux";
import { init, unSetUser } from "../module/auth";

const useSyncLoginStatus = () => {
  const dispatch = useDispatch();
  const onLogin = (uid) => {
    console.log("onLogin");
    dispatch(init(uid));
  };
  const onLogout = (uid) => {
    dispatch(unSetUser());
  };

  useEffect(() => {
    const unscribe = linkToAuthState({ onLogin, onLogout });
    return () => {
      console.log(unscribe);
      if (typeof unscribe == "function") unscribe();
    };
  }, []);
};

export default useSyncLoginStatus;
