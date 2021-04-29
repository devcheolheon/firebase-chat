import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useUserStackedData = () => {
  const users = useSelector((state) => state.users);
  const chats = useSelector((state) => state.chats);
  const messages = useSelector((state) => state.messages);
  const [data, setData] = useState([[]]);

  const getData = () => {
    let data = chats.chats.map((id) => ({
      id,
      total: chats[id].messages ? chats[id].messages.length : 0,
    }));

    data.sort((a, b) => b.total - a.total);
    data = data.concat(new Array(5).fill(null));
    data = data.slice(0, 5);

    data = data.map(({ id, total }) => {
      if (!id) return new Array(3).fill(null).map(() => [0, ""]);
      let u = chats[id].users
        .map((uid) => [
          chats[id].messages.filter(({ id: mid }) => messages[mid].user == uid)
            .length,
          users[uid].nickname,
        ])
        .filter(([length]) => length > 0);
      u.sort((a, b) => b[0] - a[0]);
      u = u.concat(new Array(3).fill(null).map(() => [0, ""]));
      u = u.slice(0, 3);
      u.name = chats[id].name;
      return u;
    });

    setData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return [data];
};

export default useUserStackedData;
