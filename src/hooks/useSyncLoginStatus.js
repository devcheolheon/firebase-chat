import { useEffect } from "react";
import { linkToAuthState } from "../firebaseUtils/auth";
import { useDispatch } from "react-redux";
import { init, unSetUser } from "../module/auth";

const useSyncLoginStatus = () => {
  const dispatch = useDispatch();
  const onLogin = (uid) => {
    dispatch(init(uid));
  };
  const onLogout = (uid) => {
    dispatch(unSetUser());
  };

  useEffect(() => {
    const unscribe = linkToAuthState({ onLogin, onLogout });
    return () => unscribe();
  }, []);
};

export default useSyncLoginStatus;
