<template>
    <v-container fluid style="padding: 0;">
      <div class="my-custom-container text-center">
        <v-row >
          <v-col>
            <center>
                <span style="font-size: 30px; font-weight: bold;">알림판</span>
            </center>
          </v-col>
        </v-row>
      </div>
    
      <v-list>
        <v-list-item-group>
          <v-list-item v-for="(post, index) in posts" :key="post.date" class="custom-list-item">
            <v-list-item-content>
              <v-list-item-title>{{ post.message }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ this.formatDate(post.date) }}
              </v-list-item-subtitle>
             
              
            </v-list-item-content>
           
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-container>
  </template>
  
  
  <script>
  export default {
    data() {
      return {
        posts: [],
      
      };
    },
    created(){ //board.cotroll.js에서 create함수가 호출되면(게시물 등록) $socket의 boardPost이벤트 emit되고 컴포넌트에서 on으로 구독
      this.$socket.on('boardPost',(data)=>{ //게시글이 등록 되었을때
        console.log(data);
        const item = {message:data.message, date: data.date }
        this.$set(this.posts, this.posts.length, item); // 수정된 코드
      });
      this.$socket.on('join',(data)=>{
        const item = {message:data.message, date: data.date }
        this.posts.push(item) // 회원가입이 있을시
    }),
    this.$socket.on('delete-account',(data)=>{//회원 탈퇴시
        const item = {message:data.message, date: data.date }
        this.posts.push(item)
    });
                           
    },
    
    methods: {
    
        formatDate(timestamp) { //날짜를 보기편하게 가공
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      },
    },
   

  };
  </script>
  
  <style scoped>
  .my-custom-container {
    background-color: #FCA096; /* 사용자 지정 색상 코드로 변경 */
    /* 다른 스타일 속성들을 필요에 따라 추가할 수 있습니다. */
    background-color: #FFF0F5
  }

  .custom-list-item {
    border-bottom: 1px solid rgb(189, 159, 155); /* 각 v-list-item 간의 경계선을 설정 */
  }
  
  </style>