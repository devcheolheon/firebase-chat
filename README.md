
### Firebase Chat APP

- [▶️데모]( https://first-firebase-47a29.web.app ) 

## 개요 

-  react + fire base chat app v2 입니다

-  기능 

   로그인 / 회원가입 / 채팅방 만들기 / 채팅 / 새글 알림 / 사용자 관계, 채팅방 채팅수 관련 그래프 출력 ( d3 ) 등등 


- 주요 라이브러리
   
   react, redux ( + reselect), firebase, d3, material-ui 


- 링글의 firebase chat app 스터디에서 출발한 프로젝트입니다. 

( 스터디 모집 링크 ) 
https://dev-recruiting.ringleplus.com/414762d8-a627-4ff6-ab6c-4422ab0c92bb

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


### 리덕스 스토어 구조 


- 각 도큐먼트가 스토어 구조의 외곽에서 아이디를 key값으로 해서 저장되도록 했다.
  ( 메시지의 경우 채팅 컬렉션 내부에 있지만 바깥의 message에 message id를 키값으로 저장된다 )

```javascript
{
    // auth 인증 관련 
    "auth": {
      "isLogin": true,  // 로그인 여부 
      "loading": false, // 로그인 상태 로딩  
      "uid": "3JaHddfzVFTGlukPyvKaR72iR583", // 로그인한 사용자의 id
      "nickname": "12234" // 로그인한 사용자의 nickname 
    },  

    // 유져 정보  
    "users": {
      "users": [ "VymBLk2oZQQY6f55fxgEFKgfktR2", ] ,  //  모든 유져들의 id 배열 
      "lwc7wr2Xgth0ExGnfBQ2Lz6fiTg1": {  // [ 유져 아이디 ]
        "chats": [ "5NeaeN0RiuJCnNfgD1fp", ] , // 유져가 참여한 채팅방 id 배열 
        "nickname": "123456",   //  유져의 닉네임  
        "created": 1619486564,  // 유져 정보가 생성된 시간
        "email": "chickenmoo@gmail.com", // email 유져가 로그인할 때 쓰는 아이디 
        "uid": "lwc7wr2Xgth0ExGnfBQ2Lz6fiTg1" // 유져 아이디 ( uid )
      },

    },

    // 채팅방 정보
    "chats": {
      "chats": [  "5NeaeN0RiuJCnNfgD1fp", ] , // 모든 채팅방들의 id 배열 
      "5NeaeN0RiuJCnNfgD1fp": { // [ 채팅방 아이디 ]
        "name": "채팅방3",  // 채팅방 이름 
        "totalMessages": 72, //  채팅방에 모든 메시지 수 
        //( 유져입장에선 본인이 채팅방에 있을때 등록된 메시지만 볼수 있기 때문에 보이는 
        //  메시지 수와 다를 수 있다. ) 
        "users": [ "euB0APR1l4QgMd6E2kIV5fqmKy93", ] , // 채팅방에 입장한 유져들의 id 배열 
        "recentMessage": "ZQs2lD703fTicQYLcM1C", // 채팅방의 가장 최근 메시지 id
        "id": "5NeaeN0RiuJCnNfgD1fp", // 채팅방 아이디 
        "messages": [  // 채팅방 내 메시지의 리스트
          {
            "id": "ZQs2lD703fTicQYLcM1C", // 해당 메시지의 id 
            "created": 1619765586  // 해당 메시지가 생성된 시간 
          }
        ]
      },
    },

    // 메시지 정보 
    "messages": {
      "ZQs2lD703fTicQYLcM1C": {  // [ 메시지 아이디 ]
        "chat": "5NeaeN0RiuJCnNfgD1fp", // 메시지가 등록된 채팅방의 id 
        "targets": [ // 메시지가 등록될때 채팅방에 있었던 user의 배열
          "euB0APR1l4QgMd6E2kIV5fqmKy93",
          "pVT4XR1z5bf0AhyLrOckLd9Pxfd2"
        ],
        "content": "asdfsdf", // 메시지의 내용 
        "readUsers": [ // 메시지를 읽은 유져의 아이디 
          "pVT4XR1z5bf0AhyLrOckLd9Pxfd2"
        ],
        "created": 1619765586, // 메시지가 생성된 시간 
        "user": "pVT4XR1z5bf0AhyLrOckLd9Pxfd2", // 메시지를 등록한 user의 id
        "id": "ZQs2lD703fTicQYLcM1C" // 메시지의 id
      },
    },

    // 초기화 
    "init": {
      "loading": false, // 초기화 진행 중 여부 
      "init": true // 초기화 완료 여부 
    }
  }

```

### 디렉터리  구조 


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
