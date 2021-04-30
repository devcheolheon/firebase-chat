import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import throttle from "../utils/throttle";

const useUserRelationData = ({ timeDiff }) => {
  const users = useSelector((state) => state.users);
  const chats = useSelector((state) => state.chats);

  let nodes = [];
  let links = [];
  const [data, setData] = useState({ nodes, links });
  const [loaded, setLoaded] = useState(false);

  const getData = () => {
    nodes = users.users.map((id) => ({
      name: users[id].nickname,
      id: users[id].uid,
    }));

    const linkdic = {};
    nodes.forEach((node) => (linkdic[node.id] = {}));

    chats.chats.forEach((chatId) => {
      let host = "";
      chats[chatId].users.forEach((id1, i) => {
        if (i == 0) {
          host = id1;
          return;
        }
        if (!linkdic[host][id1]) linkdic[host][id1] = 0;
        linkdic[host][id1]++;
      });
    });

    links = [];
    Object.keys(linkdic).forEach((source) => {
      Object.keys(linkdic[source]).forEach((target) => {
        links.push({ source, target, value: linkdic[source][target] });
      });
    });

    setData({ nodes, links });
    setLoaded(true);
  };

  useEffect(() => {
    throttle(getData, timeDiff)();
  }, [users, chats]);

  return [data, loaded];
};

export default useUserRelationData;
