<template>
    <v-container fluid style="padding: 0;">
      <div class="my-custom-container text-center">
        <v-row >
          <v-col>
            <center>
                <span style="font-size: 30px; font-weight: bold; color:rgb(139, 91, 85)">커뮤니티 관리</span>
            </center>
          </v-col>
        </v-row>
      </div>
    
      <v-list>
        <v-list-item-group>
          <v-list-item v-for="(post, index) in paginatedPosts" :key="post._id" class="custom-list-item" @click="toggleContents(post)">
            <v-list-item-content>
              <v-list-item-title>{{ post.title }}</v-list-item-title>
              <v-list-item-subtitle>
                작성자: {{ post.userId }}   작성시간: {{ formatDate(post.register_date) }}
              </v-list-item-subtitle>
             
              <v-list-item-content v-if="selectedPost === post">
                <span style="font-size: 13px; font-weight: bold;  color:rgb(67, 67, 67)">
                  본문
                </span>
                <hr>
                <span v-html="formatLineBreaks(post.contents)" style="font-size: 13px; font-style: italic; color:rgb(67, 67, 67)"></span>
              </v-list-item-content>
            </v-list-item-content>
           
            <v-btn  @click="deleteBoard(post.userId,post.title,post.contents)">삭제</v-btn><!--관리자는 모든 회원의 게시물 삭제가능-->
          </v-list-item>
        </v-list-item-group>
      </v-list>

       <!--게시글들을 페이징하여 정리하는 태그-->
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      @input="changePage"
    ></v-pagination>
    </v-container>
  </template>
  
  
  
  <script>
  export default {
    data() {
      return {
        posts: [],
        selectedPost: null,
        currentPage: 1, //현재 페이지
        itemsPerPage: 5, // 한 페이지에 표시할 아이템 수
      };
    },
    created(){ //board.cotroll.js에서 create함수가 호출되면(게시물 등록) $socket의 boardPost이벤트 emit되고 컴포넌트에서 on으로 구독
      this.$socket.on('boardPost',(data)=>{
        console.log('확인: '+data)
        this.fetchPosts();
      });
      this.$socket.on('boardDelete',(data)=>{
        this.fetchPosts();
      })    
      this.$socket.on('boardUpdate',(data)=>{
        this.fetchPosts();
      })            
    },
    mounted() {
      this.fetchPosts();
    },
    computed: {//computed는 Vue.js에서 제공하는 속성으로, 데이터의 변화에 따라 계산된 값을 반환하는 데 사용한다고 핟나.
      reversedPosts() {
        // 배열을 뒤집어서 반환 //최신순으로 나열하기위함
        return this.posts.slice().reverse();
      },
      paginatedPosts() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage; //각 페이지의 시작인덱스를 구한다 posts 배열의 인덱스 0부터 시작하기에 -1
        const endIndex = startIndex + this.itemsPerPage; // 각 페이지의 다음 인덱스 시작점을 구한다. 
        return this.reversedPosts.slice(startIndex, endIndex);
      },
      totalPages() {
        return Math.ceil(this.reversedPosts.length / this.itemsPerPage); //전체 페이지 수를 구한다.
      },
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
      formatDate(timestamp) { //날짜를 보기편하게 가공
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      },
      toggleContents(clickedPost) {
        // 클릭한 리스트의 post.contents를 토글하고 selectedPost 업데이트
        this.selectedPost = this.selectedPost === clickedPost ? null : clickedPost;
      },
      formatLineBreaks(text) { //v-html="formatLineBreaks(post.contents) 식으로 <br>문자가 생기면 html요소로 인식
        // 줄바꿈 문자를 <br> 태그로 바꾸기
        return text.replace(/\n/g, '<br>');
      },
      deleteBoard(Id,title,contents){ //데이터 삭제
        this.axios.delete('http://localhost:8000/boards/'+encodeURIComponent(Id)+'/'+encodeURIComponent(title)+
        '/'+encodeURIComponent(contents),{withCredentials:true})
             .then((res) => {
                   alert('게시글 삭제 성공!');
                 
             })
               .catch((err) => {
                  alert('에러 발생: ' + err); //에러 발생
            });          
      },
      changePage(newPage) { //페이지 넘기기
      this.currentPage = newPage;
    },
      
    },
   

  };
  </script>
  
  <style scoped>
  .my-custom-container {
    background-color: #FCA096; /* 사용자 지정 색상 코드로 변경 */
    /* 다른 스타일 속성들을 필요에 따라 추가할 수 있습니다. */
  }

  .custom-list-item {
    border-bottom: 1px solid rgb(189, 159, 155); /* 각 v-list-item 간의 경계선을 설정 */
  }
  
  </style>