<template>
  <v-container>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card style="background-color: rgb(255, 219, 215)">
          <v-card-title>
            <span class="headline">게시물 수정</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="8">
                  <v-text-field
                    label="제목*"
                    required
                    v-model="title"
                  ></v-text-field>
                </v-col>
                <v-col cols="10">
                  <v-textarea
                    label="본문"
                    required
                    v-model="contents"
                    filled
                    outlined
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog=false">취소</v-btn>
            <v-btn color="blue darken-1" text @click="boardUpdate(userId, paramTitle, paramContent)">확인</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-list>
      <v-list-item-group>
        <v-list-item v-for="(post, index) in paginatedPosts" :key="post._id" class="custom-list-item" @click="toggleContents(post)">
          <v-list-item-content>
            <v-list-item-title>{{ post.title }}</v-list-item-title>
            <v-list-item-subtitle>
              작성자: {{ post.userId }} 작성시간: {{ formatDate(post.register_date) }}
            </v-list-item-subtitle>

            <v-list-item-content v-if="selectedPost === post">
              <span style="font-size: 13px; font-weight: bold; color:rgb(67, 67, 67)">
                본문
              </span>
              <hr>
              <span v-html="formatLineBreaks(post.contents)" style="font-size: 13px; font-style: italic; color:rgb(67, 67, 67)"></span>
            </v-list-item-content>
          </v-list-item-content>
          <v-btn v-if="post.userId === userId" @click="updateBtn(post)">수정</v-btn>
          <v-btn v-if="post.userId === userId" @click="deleteBoard(post.userId, post.title, post.contents)">삭제</v-btn>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <!--게시글들을 페이징하여 정리하는 태그
      자동으로 클릭시 해당 이벤트 객체가 newPage로 이동한다고 한다.-->
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      @input="changePage" 
    ></v-pagination>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    posts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedPost: null,
      userId: null,
      title: null,
      contents: null,
      dialog: false,
      paramId: null,
      paramTitle: null,
      paramContent: null,
      currentPage: 1, //현재 페이지
      itemsPerPage: 8, // 한 페이지에 표시할 아이템 수
    };
  },
  created(){
      this.checkUser();//this.userId에 현재 로그인한 user의 id 저장
    },
  computed: {//computed는 Vue.js에서 제공하는 속성으로, 데이터의 변화에 따라 계산된 값을 반환하는 데 사용한다고 핟나.
    reversedPosts() {
      // 배열을 뒤집어서 반환 최신순으로 나열하기 위함
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
    formatDate(timestamp) { //날짜를 보기좋게 가공한다.
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    toggleContents(clickedPost) {
      // 클릭한 리스트의 post.contents를 토글하고 selectedPost 업데이트 //클릭시 content가 나온다.
      this.selectedPost = this.selectedPost === clickedPost ? null : clickedPost;
    },
    formatLineBreaks(text) {
      // 줄바꿈 문자를 <br> 태그로 바꾸기
      return text.replace(/\n/g, '<br>');
    },
    deleteBoard(Id, title, contents) {
      //데이터 삭제
      axios
        .delete('http://localhost:8000/boards/' + encodeURIComponent(Id) + '/' + encodeURIComponent(title) + '/' + encodeURIComponent(contents), {
          withCredentials: true,
        })
        .then((res) => {
          alert('게시글 삭제 성공!');
        })
        .catch((err) => {
          alert('에러 발생: ' + err); //에러 발생
        });
    },
    async checkUser() {
      try {
        const response = await axios.get('http://localhost:8000/user-info', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          withCredentials: true,
        });

        console.log('현재 아이디:' + response.data.userId);
        this.userId = response.data.userId;
      } catch (error) {
        console.error(error);
      }
    },
    boardUpdate(upId, upTitle, upContents) {
      if (this.title === null || this.title === '') {
        alert('제목을 입력하세요');
        return (this.title = null);
      } else if (this.contents === null || this.contents === '') {
        alert('본문을 입력하세요');
        this.contents = null;
        return;
      } else {
        console.log(upId + ' ' + upTitle + '' + upContents);
        axios
          .put(
            'http://localhost:8000/boards/' + encodeURIComponent(upId) + '/' + encodeURIComponent(upTitle) + '/' + encodeURIComponent(upContents),
            {
              userId: this.userId,
              title: this.title,
              contents: this.contents,
            },
            { withCredentials: true }
          )
          .then((res) => {
            alert('게시글 수정 성공!');
            this.title = null;
            this.contents = null;

            this.paramTitle = null;
            this.paramContent = null;
          })
          .catch((err) => {
            alert('에러 발생: ' + err); //에러 발생
          });
      }
    },
    updateBtn(data) {
      //dialog true로 토글하고 들어갈 값 세팅
      this.dialog = true;
      this.dialogTitle = '수정';
      //this.paramId = data.userId;
      this.paramTitle = data.title;
      this.paramContent = data.contents;
      this.title = data.title;
      this.contents = data.contents;
    },
    changePage(newPage) { //사용자가 클릭시 해당 페이지가 newPage로 전송
      this.currentPage = newPage;
    },
  },
};
</script>

<style scoped>
.custom-list-item {
  border-bottom: 1px solid rgb(189, 159, 155); /* 각 v-list-item 간의 경계선을 설정 */
}
</style>