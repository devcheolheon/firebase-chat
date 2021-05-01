
### ReactJS Chat APP

- [▶️데모]( https://first-firebase-47a29.web.app ) 

## 개요 

-  react + fire base chat app v2 입니다

-  기능 

   로그인 / 회원가입 / 채팅방 만들기 / 채팅 / 새글 알림 / 사용자 관계, 채팅방 채팅수 관련 그래프 출력 ( d3 ) 등등 


- 주요 라이브러리
   
   react, redux ( + reselect), firebase, d3, material-ui 

## 실행화면 

## 구조 

### 주요 컴포넌트 

1. pages/Join : 회원가입 페이지

2.  pages/Login : 로그인 페이지 

3.  pages/Main : 메인 페이지 

    최초 렌더링시 initSaga를 작동시킨다. 사용자 정보, 채팅방 정보를 가져와서 초기 리덕스 스토어 값을 설정해주고  사용자가 입장한 채팅방이 있을 경우 이에 대한 메시지들도 가져와 해당 채팅방에 세팅해준다

    unReadMessageSelector로 안읽은 메시지들을 모아 상단 알림창에 표시해준다 

 4.  pages/Main > components/Users

     사용자 정보를 볼 수 있다. 채팅방에 참가할 수 있다

 5.  pages/Main > components/Chatting

     메시지를 보내고 채팅방에 참여 또는 나가기를 할 수 있다

 6.  pages/Main >  components/GraphChart 

     hooks/useUsersRelationData.js , hooks/useUsersStackedData.js 를 활용하여 
          그래프를 출력한다 ( 리덕스 스토어의 상태가 변경될때마다 데이터를 다시 가져온다)


### 디렉터리   


```
├── src
│   ├── Routes.js //  최초 진입 라우터 
│   ├── components
│   │   ├── chatting
│   │   │   ├── ChatInputText.js
│   │   │   ├── ChatRoom.js
│   │   │   ├── ChatRoomList.js
│   │   │   ├── Chatting.js
│   │   │   ├── CreateChatFormDialog.js
│   │   │   ├── GraphChart.js
│   │   │   ├── Message.js
│   │   │   └── MessageList.js
│   │   ├── common
│   │   │   ├── Alarm.js
│   │   │   ├── Loading.js
│   │   │   ├── Logo.js
│   │   │   ├── Popup.js
│   │   │   └── Timestamp.js
│   │   └── users
│   │       ├── UserList.js
│   │       └── Users.js
│   ├── firebase.js 
│   ├── firebaseUtils // 파이어베이스 관련 api
│   │   ├── auth.js
│   │   ├── chats.js
│   │   ├── common.js
│   │   ├── messages.js
│   │   └── users.js
│   ├── graphUtils // d3 그래프를 그리는 함수들
│   │   ├── usersRelationGraph.js
│   │   └── usersStackedGraph.js
│   ├── hooks
│   │   ├── useCheckLogin.js
│   │   ├── useInterval.js
│   │   ├── useSyncLoginStatus.js
│   │   ├── useUsersRelationData.js
│   │   └── useUsersStackedData.js
│   ├── index.js
│   ├── logo.png
│   ├── module  // 리듀서 + 사가 
│   │   ├── auth.js
│   │   ├── chats.js
│   │   ├── index.js
│   │   ├── init.js
│   │   ├── messages.js
│   │   └── users.js
│   ├── pages
│   │   ├── Join.js   
│   │   ├── Login.js
│   │   └── Main.js
│   ├── theme.js  // material-ui 테마 
│   └── utils
│       └── throttle.js
```


## 출처 
  
- 링글의 firebase chat app 스터디에서 출발한 프로젝트입니다. 

( 스터디 모집 링크 ) 
https://dev-recruiting.ringleplus.com/414762d8-a627-4ff6-ab6c-4422ab0c92bb


### 참고한 url 
  
##### 리덕스 사가
- [velopert 리덕스 사가 관련 웹 북](https://react.vlpt.us/redux-middleware/10-redux-saga.html
 )
- [리덕스 사가 공식 문서 (특히 채널 관련 부분)](https://redux-saga.js.org/docs/advanced/Channels)


##### d3 그래프 

- [Observable에 올려진 d3 튜토리얼](https://observablehq.com/@d3/learn-d3)

##### (사용자 관계 그래프 )

- [참고한 d3 작품 1 (temporal-force-directed-graph)](https://observablehq.com/@d3/temporal-force-directed-graph)

- [참고한 d3 작품 2 (force-directed-graph)](https://observablehq.com/@d3/force-directed-graph)

#####  (채팅방 채팅수 그래프 )

- [참고한 d3 작품 3 (stacked-to-grouped-bars)](https://observablehq.com/@d3/stacked-to-grouped-bars)