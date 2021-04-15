import { useEffect, useState } from "react";
import { firebaseApp } from "../firebase";
import { useHistory } from "react-router-dom";

const useCheckLogin = ({ setLoading, successUrl, failureUrl }) => {
  const [isInit, setIsInit] = useState(true);
  const [loginStatus, setLoginStatus] = useState("");
  const history = useHistory();

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (isInit) setLoading(true);
      const uid = (firebaseApp.auth().currentUser || {}).uid;

      if (uid) {
        setLoginStatus(uid);
        if (successUrl) history.push(successUrl);
      } else {
        setLoginStatus("");
        if (failureUrl) history.push(failureUrl);
      }

      if (isInit) setLoading(false);
      setIsInit(false);
    });
  }, []);

  return [loginStatus, setLoginStatus];
};

export default useCheckLogin;
