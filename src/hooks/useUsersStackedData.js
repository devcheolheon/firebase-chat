import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import throttle from "../utils/throttle";

const useUserStackedData = ({ timeDiff }) => {
  const users = useSelector((state) => state.users);
  const chats = useSelector((state) => state.chats);
  const messages = useSelector((state) => state.messages);
  const [data, setData] = useState([[]]);
  const [loaded, setLoaded] = useState(false);

  const getData = () => {
    let data = chats.chats.map((id) => ({
      id,
      total: chats[id].messages ? chats[id].messages.length : 0,
    }));

    data.sort((a, b) => b.total - a.total);
    data = data.concat(new Array(5).fill(null).map(() => ({})));
    data = data.slice(0, 5);

    data = data.map(({ id, total }) => {
      if (!id) return new Array(3).fill(null).map(() => [0, ""]);
      let u = chats[id].users
        .map((uid) => {
          let result = [
            chats[id].messages
              ? chats[id].messages.filter(
                  ({ id: mid }) => messages[mid].user == uid
                ).length
              : 0,
            users[uid].nickname,
          ];
          result.id = uid;
          return result;
        })
        .filter(([length]) => length > 0);
      u.sort((a, b) => b[0] - a[0]);
      u = u.concat(new Array(3).fill(null).map(() => [0, ""]));
      u = u.slice(0, 3);
      u.name = chats[id].name;
      u.id = chats[id].id;
      return u;
    });

    data.sort(
      (a, b) =>
        b.reduce((acc, v) => acc + v[0], 0) -
        a.reduce((acc, v) => acc + v[0], 0)
    );

    setData(data);
    setLoaded(true);
  };

  useEffect(() => {
    throttle(getData, timeDiff)();
  }, [users, chats]);

  return [data, loaded];
};

export default useUserStackedData;
