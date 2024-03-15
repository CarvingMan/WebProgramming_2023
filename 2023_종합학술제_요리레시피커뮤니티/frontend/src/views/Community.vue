<template>
  <v-container fluid style="padding: 0;">
    <div class="my-custom-container text-center">
      <v-row >
        <v-col>
          <center>
              <span style="font-size: 30px; font-weight: bold; color:rgb(139, 91, 85)">요리 커뮤니티</span>
          </center>
        </v-col>
      </v-row>
    </div>
    <div style="margin-top: 15px;">
      <post-board/>
    </div>
    <div style="margin-top: 15px;">
      <board-list :posts="posts" />
    </div>
  </v-container>
</template>



<script>
import BoardList from '../components/BoardList.vue'; // 위에서 작성한 컴포넌트를 불러옴
import PostBoard from '../components/PostBoard.vue'; // 위에서 작성한 컴포넌트를 불러옴



export default {
  data() {
    return {
      posts: [],
     
    };
  },
  methods: {
    fetchPosts() {
      // 서버에서 게시물을 가져오는 로직을 넣어주세요.
      // this.posts = ...
      this.axios.get('http://localhost:8000/boards',{
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    withCredentials: true
                })
          .then((res) => {
            console.log(res);
            this.posts = res.data; // 전체 데이터를 설정
            if(res.data.code === 2){        //로그인 실패
                    alert('로그인이 필요한 페이지입니다.')
                    this.$router.push('/login');       
                } 
          })
          .catch((err) => {
            alert('에러 발생: ' + err); //에러 발생
            console.log(err.response.status);            
          }); 
    },
    
  },
  mounted() {
    this.fetchPosts();
  },
  components: {
    BoardList, // BoardList 컴포넌트 등록
    PostBoard//게시물 등록 컴포넌트
  },
  created(){ //board.cotroll.js에서 create함수가 호출되면(게시물 등록) $socket의 boardPost이벤트 emit되고 컴포넌트에서 on으로 구독
    this.$socket.on('boardPost',(data)=>{
      this.fetchPosts();
    });
    this.$socket.on('boardDelete',(data)=>{
      this.fetchPosts();
    })    
    this.$socket.on('boardUpdate',(data)=>{
      this.fetchPosts();
    })            
  },
};
</script>

<style scoped>
.my-custom-container {
  background-color: #FCA096; /* 사용자 지정 색상 코드로 변경 */
  /* 다른 스타일 속성들을 필요에 따라 추가할 수 있습니다. */
}
</style>