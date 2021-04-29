import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useUserRelationData = () => {
  const users = useSelector((state) => state.users);
  const chats = useSelector((state) => state.chats);
  let nodes = [];
  let links = [];
  const [data, setData] = useState({ nodes, links });

  const getData = () => {
    nodes = users.users.map((id) => ({
      name: users[id].nickname,
      id: users[id].uid,
    }));
    console.log(nodes);

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
  };

  useEffect(() => {
    getData();
    setData({ nodes, links });
  }, []);

  return [data];
};

export default useUserRelationData;
