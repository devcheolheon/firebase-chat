import { authJoin, authLogin, authLogout, authSaveUser } from "./auth";
import { joinChats } from "./chats";
import { getUserNameById } from "./users";

const idArr = [
  ["test1", "test1@gmail.com", "민준", "777777!"],
  ["test2", "test2@gmail.com", "서준", "777777!"],
  ["test3", "test3@gmail.com", "예준", "777777!"],
  ["test4", "test4@gmail.com", "도윤", "777777!"],
  ["test5", "test5@gmail.com", "시우", "777777!"],
  ["test6", "test6@gmail.com", "주원", "777777!"],
  ["test7", "test7@gmail.com", "하준", "777777!"],
  ["test8", "test8@gmail.com", "지호", "777777!"],
  ["test9", "test9@gmail.com", "지후", "777777!"],
  ["test10", "test10@gmail.com", "준서", "777777!"],
  ["test11", "test11@gmail.com", "준우", "777777!"],
  ["test12", "test12@gmail.com", "현우", "777777!"],
  ["test13", "test13@gmail.com", "도현", "777777!"],
  ["test14", "test14@gmail.com", "지훈", "777777!"],
  ["test15", "test15@gmail.com", "건우", "777777!"],
  ["test16", "test16@gmail.com", "우진", "777777!"],
  ["test17", "test17@gmail.com", "선우", "777777!"],
  ["test18", "test18@gmail.com", "서진", "777777!"],
  ["test19", "test19@gmail.com", "민재", "777777!"],
  ["test20", "test20@gmail.com", "현준", "777777!"],
  ["test21", "test21@gmail.com", "연우", "777777!"],
  ["test22", "test22@gmail.com", "유준", "777777!"],
  ["test23", "test23@gmail.com", "정우", "777777!"],
  ["test24", "test24@gmail.com", "승우", "777777!"],
  ["test25", "test25@gmail.com", "승현", "777777!"],
  ["test26", "test26@gmail.com", "시윤", "777777!"],
  ["test27", "test27@gmail.com", "준혁", "777777!"],
  ["test28", "test28@gmail.com", "은우", "777777!"],
  ["test29", "test29@gmail.com", "지환", "777777!"],
  ["test30", "test30@gmail.com", "승민", "777777!"],
  ["test31", "test31@gmail.com", "지우", "777777!"],
  ["test32", "test32@gmail.com", "유찬", "777777!"],
  ["test33", "test33@gmail.com", "윤우", "777777!"],
  ["test34", "test34@gmail.com", "민성", "777777!"],
  ["test35", "test35@gmail.com", "준영", "777777!"],
  ["test36", "test36@gmail.com", "시후", "777777!"],
  ["test37", "test37@gmail.com", "진우", "777777!"],
  ["test38", "test38@gmail.com", "지원", "777777!"],
  ["test39", "test39@gmail.com", "수현", "777777!"],
  ["test40", "test40@gmail.com", "재윤", "777777!"],
  ["test41", "test41@gmail.com", "시현", "777777!"],
  ["test42", "test42@gmail.com", "동현", "777777!"],
  ["test43", "test43@gmail.com", "수호", "777777!"],
  ["test44", "test44@gmail.com", "태윤", "777777!"],
  ["test45", "test45@gmail.com", "민규", "777777!"],
  ["test46", "test46@gmail.com", "재원", "777777!"],
  ["test47", "test47@gmail.com", "한결", "777777!"],
  ["test48", "test48@gmail.com", "민우", "777777!"],
  ["test49", "test49@gmail.com", "재민", "777777!"],
  ["test50", "test50@gmail.com", "은찬", "777777!"],
  ["test51", "test51@gmail.com", "윤호", "777777!"],
  ["test52", "test52@gmail.com", "시원", "777777!"],
  ["test53", "test53@gmail.com", "이준", "777777!"],
  ["test54", "test54@gmail.com", "민찬", "777777!"],
  ["test55", "test55@gmail.com", "지안", "777777!"],
  ["test56", "test56@gmail.com", "시온", "777777!"],
  ["test57", "test57@gmail.com", "성민", "777777!"],
  ["test58", "test58@gmail.com", "준호", "777777!"],
  ["test59", "test59@gmail.com", "승준", "777777!"],
  ["test60", "test60@gmail.com", "성현", "777777!"],
  ["test61", "test61@gmail.com", "이안", "777777!"],
  ["test62", "test62@gmail.com", "현서", "777777!"],
  ["test63", "test63@gmail.com", "재현", "777777!"],
  ["test64", "test64@gmail.com", "하율", "777777!"],
  ["test65", "test65@gmail.com", "지한", "777777!"],
  ["test66", "test66@gmail.com", "우빈", "777777!"],
  ["test67", "test67@gmail.com", "태민", "777777!"],
  ["test68", "test68@gmail.com", "지성", "777777!"],
  ["test69", "test69@gmail.com", "예성", "777777!"],
  ["test70", "test70@gmail.com", "민호", "777777!"],
  ["test71", "test71@gmail.com", "태현", "777777!"],
  ["test72", "test72@gmail.com", "지율", "777777!"],
  ["test73", "test73@gmail.com", "민혁", "777777!"],
  ["test74", "test74@gmail.com", "서우", "777777!"],
  ["test75", "test75@gmail.com", "성준", "777777!"],
  ["test76", "test76@gmail.com", "은호", "777777!"],
  ["test77", "test77@gmail.com", "규민", "777777!"],
  ["test78", "test78@gmail.com", "정민", "777777!"],
  ["test79", "test79@gmail.com", "준", "777777!"],
  ["test80", "test80@gmail.com", "지민", "777777!"],
  ["test81", "test81@gmail.com", "윤성", "777777!"],
  ["test82", "test82@gmail.com", "율", "777777!"],
  ["test83", "test83@gmail.com", "윤재", "777777!"],
  ["test84", "test84@gmail.com", "하람", "777777!"],
  ["test85", "test85@gmail.com", "하진", "777777!"],
  ["test86", "test86@gmail.com", "민석", "777777!"],
  ["test87", "test87@gmail.com", "준수", "777777!"],
  ["test88", "test88@gmail.com", "은성", "777777!"],
  ["test89", "test89@gmail.com", "태양", "777777!"],
  ["test90", "test90@gmail.com", "예찬", "777777!"],
  ["test91", "test91@gmail.com", "준희", "777777!"],
  ["test92", "test92@gmail.com", "도훈", "777777!"],
  ["test93", "test93@gmail.com", "하민", "777777!"],
  ["test94", "test94@gmail.com", "준성", "777777!"],
  ["test95", "test95@gmail.com", "건", "777777!"],
  ["test96", "test96@gmail.com", "지완", "777777!"],
  ["test97", "test97@gmail.com", "현수", "777777!"],
  ["test161", "test161@gmail.com", "나윤", "777777!"],
  ["test162", "test162@gmail.com", "수현", "777777!"],
  ["test163", "test163@gmail.com", "예지", "777777!"],
  ["test164", "test164@gmail.com", "다현", "777777!"],
  ["test165", "test165@gmail.com", "소은", "777777!"],
  ["test166", "test166@gmail.com", "나은", "777777!"],
  ["test167", "test167@gmail.com", "나연", "777777!"],
  ["test168", "test168@gmail.com", "지은", "777777!"],
  ["test169", "test169@gmail.com", "민주", "777777!"],
  ["test170", "test170@gmail.com", "아윤", "777777!"],
  ["test171", "test171@gmail.com", "사랑", "777777!"],
  ["test172", "test172@gmail.com", "시현", "777777!"],
  ["test173", "test173@gmail.com", "예빈", "777777!"],
  ["test174", "test174@gmail.com", "윤지", "777777!"],
  ["test175", "test175@gmail.com", "서하", "777777!"],
  ["test176", "test176@gmail.com", "지현", "777777!"],
  ["test177", "test177@gmail.com", "소연", "777777!"],
  ["test178", "test178@gmail.com", "혜원", "777777!"],
  ["test179", "test179@gmail.com", "지수", "777777!"],
  ["test180", "test180@gmail.com", "은채", "777777!"],
  ["test181", "test181@gmail.com", "주하", "777777!"],
  ["test182", "test182@gmail.com", "채아", "777777!"],
  ["test183", "test183@gmail.com", "승아", "777777!"],
  ["test184", "test184@gmail.com", "다윤", "777777!"],
  ["test185", "test185@gmail.com", "소민", "777777!"],
  ["test186", "test186@gmail.com", "서희", "777777!"],
  ["test187", "test187@gmail.com", "나현", "777777!"],
  ["test188", "test188@gmail.com", "민아", "777777!"],
  ["test189", "test189@gmail.com", "채린", "777777!"],
  ["test190", "test190@gmail.com", "하영", "777777!"],
  ["test191", "test191@gmail.com", "세아", "777777!"],
  ["test192", "test192@gmail.com", "세은", "777777!"],
  ["test193", "test193@gmail.com", "도연", "777777!"],
  ["test194", "test194@gmail.com", "규리", "777777!"],
  ["test195", "test195@gmail.com", "아영", "777777!"],
  ["test196", "test196@gmail.com", "다온", "777777!"],
  ["test197", "test197@gmail.com", "가윤", "777777!"],
  ["test198", "test198@gmail.com", "지연", "777777!"],
  ["test199", "test199@gmail.com", "예림", "777777!"],
  ["test200", "test200@gmail.com", "태희", "777777!"],
  ["test201", "test201@gmail.com", "민채", "777777!"],
  ["", "teample@gmail.com", "19학번 김수빈", "teample1!"],
  ["", "computerscience@gmail.com", "과대남 김땡땡", "computerscience1!"],
];

const chatsIdArr = ["MATvCZC7D9uBybp25mOX", "J8Zd3jNawLM5zC4BzggJ"];

async function delay(time) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, time)
  );
}

async function makeTempUsers() {
  async function asyncRecur(arr, index = 0) {
    if (index == arr.length) return;
    await arr[index]();
    asyncRecur(arr, index + 1);
  }

  await asyncRecur(
    idArr
      .slice(0, 30)
      .map(([_, email, nickname, password], index) => async () => {
        let uid;
        uid = await authLogin({ email, password });
        await delay(1000);
        await delay(1000);
        if (index !== 2) {
          const chat = "BnUb99GNqAJxSU7VJ4Dw";
          await joinChats({ uid, chat });
        }
        await delay(1000);
        await authLogout();
        await delay(1000);
        console.log(email);
      })
  );
}

export default makeTempUsers;
